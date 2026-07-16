/* eslint-disable */
import { NextResponse } from "next/server";
import { getMongoClient } from "@/lib/mongodb";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { ObjectId } from "mongodb";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });

  try {
    const client = await getMongoClient();
    const db = client.db(process.env.MONGODB_DB || "adybabacrm");
    
    // Get shared views or views owned by this admin
    const views = await db.collection("crm_views").find({
      $or: [
        { isShared: true },
        { createdBy: admin.id }
      ]
    }).toArray();

    return NextResponse.json(views);
  } catch (error) {
    console.error("Views fetch failed", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });

  try {
    const body = await request.json();
    const client = await getMongoClient();
    const db = client.db(process.env.MONGODB_DB || "adybabacrm");
    
    // Only managers/owners can create shared views
    if (body.isShared && admin.role === "employee") {
      return NextResponse.json({ message: "Employees cannot create shared views." }, { status: 403 });
    }

    const newView = {
      name: body.name,
      filters: body.filters || {},
      isShared: body.isShared || false,
      createdBy: admin.id,
      createdAt: new Date()
    };

    const result = await db.collection("crm_views").insertOne(newView);
    return NextResponse.json({ _id: result.insertedId, ...newView }, { status: 201 });
  } catch (error) {
    console.error("View create failed", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
