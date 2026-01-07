import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/errors";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// POST: Establecer contraseña para un cliente que fue creado por el negocio
export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.email || !data.password) {
      return errorResponse("Email and password are required", 400);
    }

    // Buscar al cliente en la base de datos
    const client = await prisma.client.findUnique({
      where: { email: data.email },
    });

    if (!client) {
      return errorResponse("Cliente no encontrado", 404);
    }

    // Verificar que el cliente no tenga contraseña ya establecida
    if (client.password) {
      return errorResponse("Este cliente ya tiene una contraseña establecida. Usa 'Olvidé mi contraseña' si la olvidaste.", 400);
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Actualizar el cliente con la contraseña
    const updatedClient = await prisma.client.update({
      where: { id: client.id },
      data: {
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        businessId: true,
        createdAt: true,
        business: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Contraseña establecida exitosamente",
      client: updatedClient,
    });
  } catch (err) {
    return errorResponse("Failed to set password", 500, err);
  }
}

