import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { getMongoClient } from "@/lib/mongodb";

export const runtime = "nodejs";

const statuses = ["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"];
const priorities = ["High", "Medium", "Low"];
const temperatures = ["Hot", "Warm", "Cold"];
const lostReasons = ["", "Budget", "No Response", "Chose Competitor", "Timeline", "Project Cancelled", "Not Qualified", "Other"];

function normalizeStatus(value: unknown) {
  if (typeof value !== "string") return "New";
  if (value.toLowerCase() === "new") return "New";
  return statuses.includes(value) ? value : "New";
}

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function serializeLead(lead: Record<string, unknown>) {
  return {
    ...lead,
    _id: String(lead._id),
    status: normalizeStatus(lead.status),
    priority: typeof lead.priority === "string" ? lead.priority : "Medium",
    leadTemperature: typeof lead.leadTemperature === "string" ? lead.leadTemperature : "Warm",
    source: typeof lead.source === "string" ? lead.source : "website",
  };
}

function activity(action: string, type: string, performedBy: string) {
  return { action, type, performedBy, timestamp: new Date() };
}

export async function GET(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });

  const searchParams = new URL(request.url).searchParams;
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const limit = Math.min(100, Math.max(10, Number(searchParams.get("limit") || 25)));
  const search = clean(searchParams.get("search"), 120);
  const status = clean(searchParams.get("status"), 40);
  const priority = clean(searchParams.get("priority"), 20);
  const leadTemperature = clean(searchParams.get("leadTemperature"), 20);
  const service = clean(searchParams.get("service"), 100);
  const timeline = clean(searchParams.get("timeline"), 30);

  const assignedToFilter = clean(searchParams.get("assignedTo"), 40);

  const query: Record<string, unknown> = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
      { service: { $regex: search, $options: "i" } },
    ];
  }
  if (status) query.status = status === "New" ? { $in: ["New", "new"] } : status;
  if (priority) query.priority = priority;
  if (leadTemperature) query.leadTemperature = leadTemperature;
  if (service) query.service = service;

  // Data Scoping
  if (admin.role === "employee") {
    query.assignedTo = admin.id;
  } else if (assignedToFilter) {
    if (assignedToFilter === "unassigned") {
      query.assignedTo = { $in: [null, "", { $exists: false }] };
    } else {
      query.assignedTo = assignedToFilter;
    }
  }

  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
  
  const startOfYesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
  const endOfYesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 23, 59, 59, 999);
  
  const idleThreshold = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const openStatus = { $nin: ["Won", "Lost"] };

  if (timeline === "dueToday") {
    query.followUpDate = { $gte: startOfToday, $lte: endOfToday };
    query.status = openStatus;
  } else if (timeline === "overdue") {
    query.followUpDate = { $lt: startOfToday };
    query.status = openStatus;
  } else if (timeline === "upcoming") {
    query.followUpDate = { $gt: endOfToday };
    query.status = openStatus;
  } else if (timeline === "idle") {
    query.status = { $in: ["New", "new"] };
    query.createdAt = { $lt: idleThreshold };
  }

  const client = await getMongoClient();
  const database = client.db(process.env.MONGODB_DB || "adybabacrm");
  const collection = database.collection("website_enquiries");
  const skip = (page - 1) * limit;

  const [leads, totalLeads, basicStats, timelineStats, idleCount, services, assignmentStats, yesterdayStats, globalEvents] = await Promise.all([
    collection.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
    collection.countDocuments(query),
    collection.aggregate<{ _id: string; count: number; totalWon: number }>([
      { $group: { _id: "$status", count: { $sum: 1 }, totalWon: { $sum: { $cond: [{ $eq: ["$status", "Won"] }, { $ifNull: ["$wonValue", 0] }, 0] } } } },
    ]).toArray(),
    collection.aggregate<{ _id: null; overdue: number; dueToday: number; upcoming: number }>([
      { $match: { status: { $nin: ["Won", "Lost"] } } },
      {
        $group: {
          _id: null,
          overdue: { $sum: { $cond: [{ $lt: ["$nextFollowUpAt", startOfToday] }, 1, 0] } },
          dueToday: { $sum: { $cond: [{ $and: [{ $gte: ["$nextFollowUpAt", startOfToday] }, { $lte: ["$nextFollowUpAt", endOfToday] }] }, 1, 0] } },
          upcoming: { $sum: { $cond: [{ $gt: ["$nextFollowUpAt", endOfToday] }, 1, 0] } },
        },
      },
    ]).toArray(),
    collection.countDocuments({ status: { $in: ["New", "new"] }, createdAt: { $lt: idleThreshold } }),
    collection.distinct("service"),
    collection.aggregate<{ _id: string | null; count: number }>([
      { $match: { status: { $nin: ["Won", "Lost"] } } },
      { $group: { _id: "$assignedTo", count: { $sum: 1 } } }
    ]).toArray(),
    
    // Yesterday's basics for trend
    collection.aggregate([
      { $match: { createdAt: { $gte: startOfYesterday, $lte: endOfYesterday } } },
      { $group: { _id: null, count: { $sum: 1 } } }
    ]).toArray(),
    
    // Global events (recent activity feed) for owner/manager
    (admin.role === "owner" || admin.role === "manager") ? 
      collection.aggregate([
        { $match: { events: { $exists: true, $not: { $size: 0 } } } },
        { $unwind: "$events" },
        { $sort: { "events.timestamp": -1 } },
        { $limit: 15 },
        { $project: { _id: 1, name: 1, action: "$events.action", type: "$events.type", performedBy: "$events.performedBy", timestamp: "$events.timestamp" } }
      ]).toArray() : Promise.resolve([])
  ]);

  const counts = Object.fromEntries(statuses.map((item) => [item, 0]));
  let totalWonValue = 0;
  for (const item of basicStats) {
    const key = normalizeStatus(item._id);
    counts[key] = (counts[key] || 0) + item.count;
    if (key === "Won") totalWonValue += item.totalWon || 0;
  }
  const timelineTotals = timelineStats[0] || { overdue: 0, dueToday: 0, upcoming: 0 };
  const total = basicStats.reduce((sum, item) => sum + item.count, 0);

  let unassigned = 0;
  const employeeStats: Record<string, number> = {};
  if (assignmentStats) {
    for (const stat of assignmentStats) {
      if (!stat._id) unassigned += stat.count;
      else employeeStats[stat._id] = stat.count;
    }
  }

  return NextResponse.json({
    leads: leads.map((lead) => serializeLead(lead)),
    pagination: { totalLeads, page, limit, totalPages: Math.ceil(totalLeads / limit) || 1 },
    services: services.filter(Boolean).sort(),
    stats: {
      total,
      active: total - (counts.Won || 0) - (counts.Lost || 0),
      new: counts.New || 0,
      contacted: counts.Contacted || 0,
      qualified: counts.Qualified || 0,
      proposalSent: counts["Proposal Sent"] || 0,
      won: counts.Won || 0,
      lost: counts.Lost || 0,
      overdue: timelineTotals.overdue || 0,
      dueToday: timelineTotals.dueToday || 0,
      upcoming: timelineTotals.upcoming || 0,
      idle: idleCount,
      unassigned,
      employeeStats,
      totalWonValue,
      yesterdayLeads: yesterdayStats[0]?.count || 0,
    },
    recentActivityFeed: globalEvents || []
  });
}

export async function PATCH(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });

  const body = (await request.json()) as Record<string, unknown>;
  const id = clean(body.id, 60);
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid lead id." }, { status: 400 });
  }

  const client = await getMongoClient();
  const database = client.db(process.env.MONGODB_DB || "adybabacrm");
  const collection = database.collection("website_enquiries");
  const lead = await collection.findOne({ _id: new ObjectId(id) });
  if (!lead) return NextResponse.json({ message: "Lead not found." }, { status: 404 });

  const { canEditLead } = await import("@/lib/auth/ownership");
  if (!canEditLead(admin, lead as { assignedTo?: string })) {
    return NextResponse.json({ message: "Forbidden. You do not own this lead." }, { status: 403 });
  }

  // Optimistic Concurrency Check (Locking)
  if (body.updatedAt !== undefined) {
    const clientUpdatedAt = new Date(body.updatedAt as string).getTime();
    const serverUpdatedAt = lead.updatedAt ? new Date(lead.updatedAt).getTime() : 0;
    if (serverUpdatedAt > clientUpdatedAt + 1000) {
      return NextResponse.json({ message: "Lead was updated by someone else. Please refresh." }, { status: 409 });
    }
  }

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  const logs: unknown[] = [];

  // Assignment Logic
  if (body.assignedTo !== undefined) {
    const { computePermissions, hasPermission } = await import("@/lib/auth/roles");
    const { PERMISSIONS } = await import("@/lib/auth/permissions");
    type Role = import("@/lib/auth/roles").Role;
    const permissions = computePermissions(admin.role as Role);
    
    if (hasPermission(permissions, PERMISSIONS.ASSIGN_LEADS)) {
      const nextAssignedTo = clean(body.assignedTo, 60);
      if (nextAssignedTo !== lead.assignedTo) {
        updates.assignedTo = nextAssignedTo;
        updates.assignedBy = admin.id;
        updates.lastAssignedAt = new Date();
        if (!lead.assignedAt) updates.assignedAt = new Date();
        updates.reassignedCount = (lead.reassignedCount || 0) + 1;
        
        logs.push(activity(`Assigned to ${nextAssignedTo === "unassigned" || !nextAssignedTo ? "Unassigned" : "Employee"}`, "assignment", admin.email));
      }
    }
  }

  if (body.status !== undefined) {
    const next = clean(body.status, 40);
    if (!statuses.includes(next)) return NextResponse.json({ message: "Invalid status." }, { status: 400 });
    if (next !== normalizeStatus(lead.status)) {
      updates.status = next;
      logs.push(activity(`Status changed from ${normalizeStatus(lead.status)} to ${next}`, "status", admin.email));
      if (next === "Won" || next === "Lost") updates.closedAt = new Date();
    }
  }
  if (body.priority !== undefined) {
    const next = clean(body.priority, 20);
    if (!priorities.includes(next)) return NextResponse.json({ message: "Invalid priority." }, { status: 400 });
    updates.priority = next;
    logs.push(activity(`Priority set to ${next}`, "priority", admin.email));
  }
  if (body.leadTemperature !== undefined) {
    const next = clean(body.leadTemperature, 20);
    if (!temperatures.includes(next)) return NextResponse.json({ message: "Invalid temperature." }, { status: 400 });
    updates.leadTemperature = next;
    logs.push(activity(`Temperature set to ${next}`, "temperature", admin.email));
  }
  if (body.budgetRange !== undefined) {
    updates.budgetRange = clean(body.budgetRange, 30);
    logs.push(activity(`Budget set to ${updates.budgetRange || "not specified"}`, "budget", admin.email));
  }
  if (body.nextFollowUpAt !== undefined) {
    const value = clean(body.nextFollowUpAt, 40);
    updates.nextFollowUpAt = value ? new Date(value) : null;
    logs.push(activity(value ? `Follow-up scheduled for ${new Date(value).toLocaleString('en-IN')}` : "Follow-up removed", "followup", admin.name));
  }
  if (body.followUpReason !== undefined) {
    updates.followUpReason = clean(body.followUpReason, 200);
  }
  if (body.followUpType !== undefined) {
    updates.followUpType = clean(body.followUpType, 20);
  }
  if (body.followUpStatus !== undefined) {
    const status = clean(body.followUpStatus, 20);
    updates.followUpStatus = status;
    if (status === 'Completed') {
      logs.push(activity(`Follow-up completed`, "followup", admin.name));
    } else if (status === 'Missed') {
      logs.push(activity(`Follow-up marked as missed`, "followup", admin.name));
    }
  }

  if (body.lastContactedAt !== undefined) {
    updates.lastContactedAt = new Date(clean(body.lastContactedAt, 60) || Date.now());
    let msg = `Contact logged${body.contactChannel ? ` via ${clean(body.contactChannel, 30)}` : ""}`;
    if (body.callOutcome) msg += ` - Outcome: ${clean(body.callOutcome, 50)}`;
    
    logs.push({
       ...activity(msg, "contact", admin.name),
       callDuration: typeof body.callDuration === "number" ? body.callDuration : undefined,
       callOutcome: body.callOutcome ? clean(body.callOutcome, 50) : undefined,
       callReason: body.callReason ? clean(body.callReason, 100) : undefined
    });
  }
  if (body.wonValue !== undefined) {
    const value = Number(body.wonValue);
    if (Number.isNaN(value) || value < 0) return NextResponse.json({ message: "Invalid won value." }, { status: 400 });
    updates.wonValue = value;
    logs.push(activity(`Won value set to INR ${value}`, "financial", admin.email));
  }
  if (body.lostReason !== undefined) {
    const next = clean(body.lostReason, 80);
    if (!lostReasons.includes(next)) return NextResponse.json({ message: "Invalid lost reason." }, { status: 400 });
    updates.lostReason = next;
    if (next) logs.push(activity(`Lost reason set to ${next}`, "status", admin.email));
  }
  if (body.company !== undefined) updates.company = clean(body.company, 120);
  if (body.note !== undefined) {
    const note = clean(body.note, 1500);
    if (note) {
      const newNote = {
        author: admin.name,
        createdAt: new Date(),
        note,
        type: admin.role === 'employee' ? 'Employee' : 'Manager'
      };
      updates.notes = [...(Array.isArray(lead.notes) ? lead.notes : []), newNote];
      logs.push(activity("Note added", "note", admin.name));
    }
  }

  if (logs.length) {
    const existingEvents = Array.isArray(lead.events) ? lead.events : (Array.isArray(lead.activityLog) ? lead.activityLog : []);
    updates.events = [...existingEvents, ...logs];
  }

  await collection.updateOne({ _id: new ObjectId(id) }, { $set: updates });
  return NextResponse.json({ success: true });
}

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });

  try {
    const body = await request.json();
    const phone = clean(body.phone, 20);
    if (!phone) return NextResponse.json({ message: "Phone number is required." }, { status: 400 });

    const client = await getMongoClient();
    const collection = client.db(process.env.MONGODB_DB || "adybabacrm").collection("website_enquiries");

    // Duplicate Check
    const existing = await collection.findOne({ phone });
    if (existing) {
      return NextResponse.json({ 
        message: `Lead already exists.`,
        isDuplicate: true,
        existingLeadId: existing._id,
        lastContactedAt: existing.lastContactedAt
      }, { status: 409 });
    }

    const newLead = {
      name: clean(body.name, 80),
      company: clean(body.company, 100),
      email: clean(body.email, 120).toLowerCase(),
      phone,
      service: clean(body.service, 80),
      source: admin.role === 'employee' ? "Manual" : (clean(body.source, 50) || "Manual"),
      status: "New",
      priority: clean(body.priority, 20) || "Medium",
      leadTemperature: "Warm",
      createdAt: new Date(),
      events: [activity("Lead created manually", "creation", admin.name)],
      assignedTo: admin.id,
      assignedBy: admin.id,
      assignedAt: new Date(),
    };

    const result = await collection.insertOne(newLead);
    return NextResponse.json({ success: true, leadId: result.insertedId });
  } catch (error) {
    console.error("Manual lead creation failed", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
