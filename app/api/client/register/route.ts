import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/errors";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// POST: Registrar un nuevo cliente
export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.email || !data.password || !data.name || !data.phone) {
      return errorResponse("Missing required fields: email, password, name, phone", 400);
    }

    // Verificar si el cliente ya existe
    const existingClient = await prisma.client.findUnique({
      where: { email: data.email },
    });

    if (existingClient) {
      return errorResponse("Este email ya está registrado", 409);
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Crear el cliente
    const client = await prisma.client.create({
      data: {
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


