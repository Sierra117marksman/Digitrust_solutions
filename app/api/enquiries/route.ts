import { NextResponse } from "next/server";
import { getMongoClient } from "@/lib/mongodb";
import { serviceTitles } from "@/content/services";

export const runtime = "nodejs";

const allowedServices = new Set(serviceTitles);

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    if (clean(body.website, 200)) {
      return NextResponse.json({ message: "Enquiry received." });
    }

    const enquiry = {
      name: clean(body.name, 80),
      company: clean(body.company, 100),
      email: clean(body.email, 120).toLowerCase(),
      phone: clean(body.phone, 20),
      service: clean(body.service, 80),
      message: clean(body.message, 2000),
      consent: body.consent === "accepted",
    };

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[+\d][\d\s()-]{7,19}$/;

    if (
      !enquiry.name ||
      !emailPattern.test(enquiry.email) ||
      !phonePattern.test(enquiry.phone) ||
      !allowedServices.has(enquiry.service) ||
      enquiry.message.length < 10 ||
      !enquiry.consent
    ) {
      return NextResponse.json(
        { message: "Please check the required fields and try again." },
        { status: 400 },
      );
    }

    const client = await getMongoClient();
    const database = client.db(process.env.MONGODB_DB || "adybabacrm");
    await database.collection("website_enquiries").insertOne({
      ...enquiry,
      status: "new",
      source: "website",
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "Thank you. Your enquiry has been received." },
      { status: 201 },
    );
  } catch (error) {
    console.error("Enquiry submission failed", error);
    return NextResponse.json(
      { message: "We could not send your enquiry. Please try again shortly." },
      { status: 500 },
    );
  }
}
