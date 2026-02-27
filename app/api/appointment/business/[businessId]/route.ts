import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ businessId: string }> } // 1. Definimos que es una Promesa
) {
  try {
    const session = await getServerSession(authOptions);
    const { businessId: paramBusinessId } = await params;

    if (!session || !session.user?.businessId || session.user.businessId !== parseInt(paramBusinessId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const businessId = session.user.businessId;

    const appointments = await prisma.appointment.findMany({
      where: { businessId },
      include: {
        client: true,
        pet: true,
        service: true,
        user: true,
        business: true,
      },
      orderBy: {
        date: 'desc' // Opcional: ordenar por fecha
      }
    });

    if (!appointments || appointments.length === 0) {
      // Nota: Asegúrate de que errorResponse esté importado o usa NextResponse.json
      return NextResponse.json({ error: "No appointments found" }, { status: 404 });
    }

    return NextResponse.json(appointments);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    return NextResponse.json({ error: "Failed to fetch appointment" }, { status: 500 });
  }
}