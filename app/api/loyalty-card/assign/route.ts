import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/errors";
import { NextResponse } from "next/server";

// POST: Asignar una tarjeta de fidelización a un cliente (busca por email o teléfono)
export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.businessId || !data.visitsRequired) {
      return errorResponse("Missing required fields: businessId, visitsRequired", 400);
    }

    if (!data.email && !data.phone) {
      return errorResponse("Debes proporcionar email o teléfono del cliente", 400);
    }

    // Buscar cliente por email o teléfono
    let client = null;
    
    if (data.email) {
      client = await prisma.client.findUnique({
        where: { email: data.email },
      });
    } else if (data.phone) {
      client = await prisma.client.findFirst({
        where: { phone: data.phone },
      });
    }

    // Si el cliente no existe, crearlo (sin contraseña, la establecerá después)
    if (!client) {
      if (!data.name) {
        return errorResponse("El cliente no existe. Debes proporcionar el nombre para crearlo.", 400);
      }

      // Si no hay email ni teléfono, error
      if (!data.email && !data.phone) {
        return errorResponse("Debes proporcionar email o teléfono", 400);
      }

      // Si solo hay teléfono, generar un email único temporal
      let emailToUse = data.email;
      if (!emailToUse && data.phone) {
        emailToUse = `temp_${Date.now()}_${data.phone.replace(/\D/g, '')}@temp.com`;
      }

      client = await prisma.client.create({
        data: {
          name: data.name,
          email: emailToUse,
          phone: data.phone || "",
        },
      });
    }

    // Verificar si ya existe una tarjeta activa para este cliente y servicio
    if (data.serviceId) {
      const existingCard = await prisma.loyaltyCard.findFirst({
        where: {
          businessId: data.businessId,
          clientId: client.id,
          serviceId: data.serviceId,
          isActive: true,
        },
      });

      if (existingCard) {
        return errorResponse("El cliente ya tiene una tarjeta activa para este servicio", 409);
      }
    }

    // Crear la tarjeta
    const card = await prisma.loyaltyCard.create({
      data: {
        businessId: data.businessId,
        clientId: client.id,
        serviceId: data.serviceId || null,
        name: data.cardName || data.name || `Tarjeta de Fidelización - ${client.name}`,
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
    if (err.code === "P2002") {
      return errorResponse("Email ya está en uso", 409);
    }
    return errorResponse("Failed to assign loyalty card", 500, err);
  }
}


