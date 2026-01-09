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

    // Si no hay clientId pero hay datos del cliente, crear el cliente primero
    let clientId = data.clientId;

    if (!clientId && data.clientData) {
      const { name, email, phone } = data.clientData;

      if (!name || !email || !phone) {
        return errorResponse("Missing client data: name, email, phone");
      }

      // Buscar si el cliente ya existe
      let existingClient = await prisma.client.findUnique({
        where: { email },
      });

      if (!existingClient) {
        // Crear nuevo cliente (sin contraseña, la establecerá después)
        existingClient = await prisma.client.create({
          data: {
            name,
            email,
            phone,
          },
        });
      }

      clientId = existingClient.id;
    }

    if (!clientId || !data.serviceId || !data.date || !data.businessId)
      return errorResponse("Missing appointment data: clientId, serviceId, date, businessId");

    const overlapping = await prisma.appointment.findFirst({
      where: {
        date: data.date,
        businessId: data.businessId,
        status: { not: "CANCELLED" },
      },
    });

    if (overlapping)
      return errorResponse("Time slot already booked", 409);

    const appointment = await prisma.appointment.create({
      data: {
        ...data,
        clientId,
      },
      include: {
        client: true,
        service: true,
      },
    });
    return NextResponse.json(appointment, { status: 201 });
  } catch (err) {
    return errorResponse("Failed to create appointment", 500, err);
  }
}
