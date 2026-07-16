/* eslint-disable */
import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { getMongoClient } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });

  try {
    const client = await getMongoClient();
    const collection = client.db(process.env.MONGODB_DB || "adybabacrm").collection("website_enquiries");

    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

    // Filter by assignment if employee
    const baseQuery: any = { status: { $nin: ["Won", "Lost", "Archived"] } };
    if (admin.role === "employee") {
      baseQuery.assignedTo = admin.id;
    }

    // 1. Overdue Follow-ups
    const overdueLeads = await collection.find({
      ...baseQuery,
      nextFollowUpAt: { $lt: startOfToday },
      followUpStatus: { $ne: "Completed" }
    }).project({ name: 1, nextFollowUpAt: 1, phone: 1 }).limit(10).toArray();

    // 2. Due Today
    const dueTodayLeads = await collection.find({
      ...baseQuery,
      nextFollowUpAt: { $gte: startOfToday, $lte: endOfToday },
      followUpStatus: { $ne: "Completed" }
    }).project({ name: 1, nextFollowUpAt: 1, phone: 1 }).limit(10).toArray();

    // 3. New Assignments (Status is New, assigned to me)
    const newLeads = await collection.find({
      ...baseQuery,
      status: { $in: ["New", "new"] },
      assignedTo: admin.id
    }).project({ name: 1, createdAt: 1, assignedBy: 1 }).limit(10).toArray();

    // 4. SLA Breaches (New for > 8 hours)
    const slaBreachThreshold = new Date(Date.now() - 8 * 3600000);
    const slaBreaches = await collection.find({
      ...baseQuery,
      status: { $in: ["New", "new"] },
      createdAt: { $lt: slaBreachThreshold }
    }).project({ name: 1, createdAt: 1, phone: 1 }).limit(10).toArray();

    // 5. Idle High Priority (No contact in 14 days)
    const idleThreshold = new Date(Date.now() - 14 * 86400000);
    const idleLeads = await collection.find({
      ...baseQuery,
      status: { $nin: ["Won", "Lost"] },
      priority: "High",
      $or: [{ lastContactedAt: { $lt: idleThreshold } }, { lastContactedAt: { $exists: false }, createdAt: { $lt: idleThreshold } }]
    }).project({ name: 1, lastContactedAt: 1, phone: 1 }).limit(10).toArray();

    const inboxItems = [];

    for (const l of overdueLeads) {
      inboxItems.push({
        id: `overdue-\${l._id}`,
        leadId: l._id,
        type: 'overdue',
        title: l.name,
        description: 'Follow-up overdue',
        actionLabel: 'Call Now',
        phone: l.phone,
        timestamp: l.nextFollowUpAt,
        priority: 'high'
      });
    }

    for (const l of dueTodayLeads) {
      inboxItems.push({
        id: `today-\${l._id}`,
        leadId: l._id,
        type: 'today',
        title: l.name,
        description: 'Follow-up due today',
        actionLabel: 'Call Now',
        phone: l.phone,
        timestamp: l.nextFollowUpAt,
        priority: 'medium'
      });
    }

    for (const l of newLeads) {
      inboxItems.push({
        id: `new-\${l._id}`,
        leadId: l._id,
        type: 'new',
        title: l.name,
        description: 'New lead assigned to you',
        actionLabel: 'Open Lead',
        timestamp: l.createdAt,
        priority: 'low'
      });
    }

    for (const l of slaBreaches) {
      inboxItems.push({
        id: `sla-\${l._id}`,
        leadId: l._id,
        type: 'sla',
        title: l.name,
        description: 'SLA Breach (New > 8h)',
        actionLabel: 'Call Now',
        phone: l.phone,
        timestamp: l.createdAt,
        priority: 'high'
      });
    }

    for (const l of idleLeads) {
      inboxItems.push({
        id: `idle-\${l._id}`,
        leadId: l._id,
        type: 'idle',
        title: l.name,
        description: 'Idle High Priority (>14d)',
        actionLabel: 'Open Lead',
        phone: l.phone,
        timestamp: l.lastContactedAt,
        priority: 'high'
      });
    }

    inboxItems.sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());

    return NextResponse.json({
      items: inboxItems,
      summary: {
        overdue: overdueLeads.length,
        dueToday: dueTodayLeads.length,
        newLeads: newLeads.length,
        slaBreaches: slaBreaches.length,
        idle: idleLeads.length
      }
    });

  } catch (error) {
    console.error("Inbox fetch failed", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
