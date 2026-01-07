import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/errors";
import { NextResponse } from "next/server";

// GET: Obtener una cita específica
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        client: true,
        pet: true,
        service: true,
        user: true,
        business: true,
      },
    });

    if (!appointment) {
      return errorResponse("Appointment not found", 404);
    }

    return NextResponse.json(appointment);
  } catch (err) {
    return errorResponse("Failed to fetch appointment", 500, err);
  }
}

// PATCH: Actualizar una cita (especialmente el estado)
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    const appointmentId = parseInt(params.id);

    // Obtener la cita actual para verificar el estado anterior
    const currentAppointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        client: true,
        service: true,
      },
    });

    if (!currentAppointment) {
      return errorResponse("Appointment not found", 404);
    }

    // Actualizar la cita
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: data.status,
        note: data.note,
        date: data.date,
      },
      include: {
        client: true,
        pet: true,
        service: true,
        user: true,
        business: true,
      },
    });

    // Si la cita se marcó como DONE y antes no estaba en DONE, incrementar tarjetas
    if (
      data.status === "DONE" &&
      currentAppointment.status !== "DONE"
    ) {
      await incrementLoyaltyCards(
        currentAppointment.clientId,
        currentAppointment.businessId,
        currentAppointment.serviceId
      );
    }

    return NextResponse.json(updatedAppointment);
  } catch (err) {
    return errorResponse("Failed to update appointment", 500, err);
  }
}

// DELETE: Eliminar una cita
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.appointment.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: "Appointment deleted successfully" });
  } catch (err) {
    return errorResponse("Failed to delete appointment", 500, err);
  }
}

// Función auxiliar para incrementar las tarjetas de fidelización
async function incrementLoyaltyCards(
  clientId: number,
  businessId: number,
  serviceId: number
) {
  try {
    // Buscar tarjetas activas del cliente que:
    // 1. Pertenecen al mismo negocio
    // 2. Están activas
    // 3. No han sido canjeadas
    // 4. Son para este servicio específico O son generales (serviceId = null)
    const eligibleCards = await prisma.loyaltyCard.findMany({
      where: {
        clientId,
        businessId,
        isActive: true,
        isRedeemed: false,
        OR: [
          { serviceId: serviceId }, // Tarjeta específica para este servicio
          { serviceId: null }, // Tarjeta general para todos los servicios
        ],
      },
    });

    // Incrementar el contador de cada tarjeta elegible
    for (const card of eligibleCards) {
      const newVisitsCompleted = card.visitsCompleted + 1;

      await prisma.loyaltyCard.update({
        where: { id: card.id },
        data: {
          visitsCompleted: newVisitsCompleted,
          // Si alcanzó el límite, la tarjeta sigue activa pero lista para canjear
          // El negocio puede marcar isRedeemed cuando se use el premio
        },
      });
    }

    return eligibleCards.length;
  } catch (err) {
    console.error("Error incrementing loyalty cards:", err);
    throw err;
  }
}


