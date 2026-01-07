import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/errors";
import { NextResponse } from "next/server";

// POST: Asignar una tarjeta de fidelización a un cliente
export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.businessId || !data.clientId || !data.visitsRequired) {
      return errorResponse("Missing required fields: businessId, clientId, visitsRequired", 400);
    }

    // Verificar que el cliente existe
    const client = await prisma.client.findUnique({
      where: { id: data.clientId },
    });

    if (!client) {
      return errorResponse("Client not found", 404);
    }

    // Verificar que el cliente pertenece al negocio
    if (client.businessId !== data.businessId) {
      return errorResponse("Client does not belong to this business", 403);
    }

    // Verificar si ya existe una tarjeta activa para este cliente y servicio
    if (data.serviceId) {
      const existingCard = await prisma.loyaltyCard.findFirst({
        where: {
          businessId: data.businessId,
          clientId: data.clientId,
          serviceId: data.serviceId,
          isActive: true,
        },
      });

      if (existingCard) {
        return errorResponse("Client already has an active loyalty card for this service", 409);
      }
    }

    // Crear la tarjeta
    const card = await prisma.loyaltyCard.create({
      data: {
        businessId: data.businessId,
        clientId: data.clientId,
        serviceId: data.serviceId || null,
        name: data.name || `Tarjeta de Fidelización - ${client.name}`,
        visitsRequired: parseInt(data.visitsRequired),
        visitsCompleted: 0,
        isRedeemed: false,
        isActive: true,
      },
      include: {
        business: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(card, { status: 201 });
  } catch (err: any) {
    return errorResponse("Failed to assign loyalty card", 500, err);
  }
}


