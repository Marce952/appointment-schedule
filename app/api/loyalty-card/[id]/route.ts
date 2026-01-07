import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/errors";
import { NextResponse } from "next/server";

// GET: Obtener una tarjeta específica
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const card = await prisma.loyaltyCard.findUnique({
      where: { id: parseInt(params.id) },
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

    if (!card) {
      return errorResponse("Loyalty card not found", 404);
    }

    return NextResponse.json(card);
  } catch (err) {
    return errorResponse("Failed to fetch loyalty card", 500, err);
  }
}

// PATCH: Actualizar una tarjeta (incrementar visitas, marcar como usada, etc.)
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    const cardId = parseInt(params.id);

    // Verificar que la tarjeta existe
    const existingCard = await prisma.loyaltyCard.findUnique({
      where: { id: cardId },
    });

    if (!existingCard) {
      return errorResponse("Loyalty card not found", 404);
    }

    // Preparar los datos de actualización
    const updateData: any = {};

    if (data.visitsCompleted !== undefined) {
      updateData.visitsCompleted = parseInt(data.visitsCompleted);
    }

    if (data.isRedeemed !== undefined) {
      updateData.isRedeemed = Boolean(data.isRedeemed);
    }

    if (data.isActive !== undefined) {
      updateData.isActive = Boolean(data.isActive);
    }

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    // Incrementar visitas si se solicita
    if (data.incrementVisits === true) {
      updateData.visitsCompleted = {
        increment: 1,
      };
    }

    const updatedCard = await prisma.loyaltyCard.update({
      where: { id: cardId },
      data: updateData,
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

    return NextResponse.json(updatedCard);
  } catch (err) {
    return errorResponse("Failed to update loyalty card", 500, err);
  }
}

// DELETE: Eliminar una tarjeta
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cardId = parseInt(params.id);

    await prisma.loyaltyCard.delete({
      where: { id: cardId },
    });

    return NextResponse.json({ message: "Loyalty card deleted successfully" });
  } catch (err) {
    return errorResponse("Failed to delete loyalty card", 500, err);
  }
}


