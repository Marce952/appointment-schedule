import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/errors";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// POST: Registrar un nuevo cliente
export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.email || !data.password || !data.name || !data.phone || !data.businessId) {
      return errorResponse("Missing required fields: email, password, name, phone, businessId", 400);
    }

    // Verificar que el negocio existe
    const business = await prisma.business.findUnique({
      where: { id: data.businessId },
    });

    if (!business) {
      return errorResponse("Business not found", 404);
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Crear el cliente
    const client = await prisma.client.create({
      data: {
        businessId: data.businessId,
        name: data.name,
        phone: data.phone,
        email: data.email,
        password: hashedPassword,
        notes: data.notes || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        businessId: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Cliente registrado exitosamente",
        client,
      },
      { status: 201 }
    );
  } catch (err: any) {
    if (err.code === "P2002") {
      return errorResponse("El email ya está registrado", 409);
    }
    return errorResponse("Failed to register client", 500, err);
  }
}


