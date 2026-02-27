import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/errors";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.businessId) {
      return errorResponse("Unauthorized", 401);
    }
    const businessId = session.user.businessId;

    return NextResponse.json(
      await prisma.appointment.findMany({
        where: { businessId },
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
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.businessId) {
      return errorResponse("Unauthorized", 401);
    }
    const businessId = session.user.businessId;

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
        // Crear nuevo cliente
        existingClient = await prisma.client.create({
          data: {
            name,
            email,
            phone,
            businessId,
          },
        });
      } else if (existingClient.businessId !== businessId) {
        return errorResponse("Este email ya está registrado en otro negocio", 409);
      }

      clientId = existingClient.id;
    }

    if (!clientId || !data.serviceId || !data.date)
      return errorResponse("Missing appointment data: clientId, serviceId, date");

    const overlapping = await prisma.appointment.findFirst({
      where: {
        date: data.date,
        businessId: businessId,
        status: { not: "CANCELLED" },
      },
    });

    if (overlapping)
      return errorResponse("Time slot already booked", 409);

    const appointment = await prisma.appointment.create({
      data: {
        ...data,
        clientId,
        businessId, // Forzar el businessId de la sesión
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
