import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const turnos = await prisma.turno.findMany();
    return NextResponse.json(turnos);
  } catch (error) {
    return NextResponse.json(
      { success: false, error },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const turno = await prisma.turnos.create({
      data: {
        nombre: data.nombre,
        telefono: data.telefono,
        fecha_solicitada: data.fecha_solicitada
          ? new Date(data.fecha_solicitada) : null,
        hora_solicitada: data.hora_solicitada
          ? new Date(`1970-01-01T${data.hora_solicitada}`) : null,
        estado: data.estado || "pendiente",
        motivo: data.motivo,
      }
    });

    return NextResponse.json({ success: true, turno });
  } catch (error) {
    return NextResponse.json(
      { success: false, error },
      { status: 500 }
    )
  }
}