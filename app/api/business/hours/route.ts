import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const businessId = (session.user as any).businessId;

    const hours = await prisma.businessHour.findMany({
      where: { businessId: parseInt(businessId) },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }]
    });

    return NextResponse.json(hours);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const businessId = parseInt((session.user as any).businessId);
    const body = await req.json();
    const { hours } = body;

    // Usar transacción para asegurar consistencia
    await prisma.$transaction([
      prisma.businessHour.deleteMany({
        where: { businessId: businessId }
      }),
      prisma.businessHour.createMany({
        data: hours.map((h: any) => ({
          businessId: businessId,
          dayOfWeek: parseInt(h.dayOfWeek),
          startTime: h.startTime,
          endTime: h.endTime,
        }))
      })
    ]);

    return NextResponse.json({ message: "Horarios actualizados" });
  } catch (error: any) {
    console.error("Error updating hours:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
