import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/errors";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json(await prisma.service.findMany());
  } catch (err) {
    return errorResponse("Failed to fetch services", 500, err);
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.name || !data.duration || !data.businessId)
      return errorResponse("Invalid service data");

    const service = await prisma.service.create({ data });
    return NextResponse.json(service, { status: 201 });
  } catch (err) {
    return errorResponse("Failed to create service", 500, err);
  }
}
