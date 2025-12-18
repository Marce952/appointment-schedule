import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/errors";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json(
      await prisma.appointment.findMany({
        include: {
          client: true,
          pet: true,
          service: true,
          user: true,
        },
      })
    );
  } catch (err) {
    return errorResponse("Failed to fetch appointments", 500, err);
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.clientId || !data.serviceId || !data.date || !data.businessId)
      return errorResponse("Missing appointment data");

    const overlapping = await prisma.appointment.findFirst({
      where: {
        date: data.date,
        businessId: data.businessId,
        status: { not: "CANCELLED" },
      },
    });

    if (overlapping)
      return errorResponse("Time slot already booked", 409);

    const appointment = await prisma.appointment.create({ data });
    return NextResponse.json(appointment, { status: 201 });
  } catch (err) {
    return errorResponse("Failed to create appointment", 500, err);
  }
}
