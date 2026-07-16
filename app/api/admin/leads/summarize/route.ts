/* eslint-disable */
import { NextResponse } from "next/server";
import { getMongoClient } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getCurrentAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });

  try {
    const { leadId } = await request.json();
    if (!leadId) return NextResponse.json({ message: "Lead ID required" }, { status: 400 });

    const client = await getMongoClient();
    const db = client.db(process.env.MONGODB_DB || "adybabacrm");
    const lead = await db.collection("website_enquiries").findOne({ _id: new ObjectId(leadId) });

    if (!lead) return NextResponse.json({ message: "Lead not found" }, { status: 404 });

    // Mock AI summarization using lead data
    const lastEvent = lead.events && lead.events.length > 0 ? lead.events[lead.events.length - 1] : null;
    const idleDays = lead.lastContactedAt ? Math.floor((Date.now() - new Date(lead.lastContactedAt).getTime()) / 86400000) : 0;
    
    let risks = "None detected.";
    let nextStep = "Follow up and check requirements.";

    if (idleDays > 3) {
      risks = `No follow-up in \${idleDays} days. Risk of going cold.`;
      nextStep = "Call immediately to re-engage.";
    } else if (lead.status === "New") {
      risks = "Lead has not been contacted yet.";
      nextStep = "Initial contact required ASAP.";
    } else if (lead.status === "Interested" || lead.status === "Qualified") {
      nextStep = "Prepare and send proposal.";
    }

    const summary = {
      customer: `Interested in \${lead.service || "our services"}.`,
      status: `Currently in '\${lead.status}' stage. \${lastEvent ? "Last action: " + lastEvent.action : ""}`,
      risks: risks,
      recommendedNextStep: nextStep
    };

    // If Gemini key exists, you would pass `lead.events`, `lead.notes`, `lead.source` 
    // to generate a real response here.

    return NextResponse.json(summary);
  } catch (error) {
    console.error("AI Summary failed", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
