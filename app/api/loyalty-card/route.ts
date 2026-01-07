import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/errors";
import { NextResponse } from "next/server";

// GET: Obtener todas las tarjetas de fidelización (para el negocio)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId");
    const clientId = searchParams.get("clientId");

    if (clientId) {
      // Obtener tarjetas de un cliente específico
      const cards = await prisma.loyaltyCard.findMany({
        where: {
          clientId: parseInt(clientId),
        },
        include: {
          business: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
          service: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return NextResponse.json(cards);
    }

    if (businessId) {
      // Obtener todas las tarjetas de un negocio
      const cards = await prisma.loyaltyCard.findMany({
        where: {
          businessId: parseInt(businessId),
        },
        include: {
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
        orderBy: {
          createdAt: "desc",
        },
      });
      return NextResponse.json(cards);
    }

    return errorResponse("businessId or clientId is required", 400);
  } catch (err) {
    return errorResponse("Failed to fetch loyalty cards", 500, err);
  }
}

// POST: Crear una nueva tarjeta de fidelización
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

    // Verificar que el servicio existe si se proporciona
    if (data.serviceId) {
      const service = await prisma.service.findUnique({
        where: { id: data.serviceId },
      });

      if (!service) {
        return errorResponse("Service not found", 404);
      }
    }

    // Crear la tarjeta
    const card = await prisma.loyaltyCard.create({
      data: {
        businessId: data.businessId,
        clientId: data.clientId,
        serviceId: data.serviceId || null,
        name: data.name || null,
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
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
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
    if (err.code === "P2002") {
      return errorResponse("Loyalty card already exists", 409);
    }
    return errorResponse("Failed to create loyalty card", 500, err);
  }
}


