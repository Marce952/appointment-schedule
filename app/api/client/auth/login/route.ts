import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/errors";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// POST: Autenticación de clientes
export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.email || !data.password) {
      return errorResponse("Email and password are required", 400);
    }

    // Buscar al cliente en la base de datos
    const client = await prisma.client.findUnique({
      where: { email: data.email },
      include: {
        business: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });

    if (!client) {
      return errorResponse("Email o contraseña incorrectos", 401);
    }

    // Verificar que el cliente tiene contraseña (está registrado)
    if (!client.password) {
      return NextResponse.json(
        {
          error: "Este cliente no tiene contraseña establecida. Por favor, establece tu contraseña primero.",
          needsPassword: true,
          email: client.email,
        },
        { status: 401 }
      );
    }

    // Comparar la contraseña
    const isValid = await bcrypt.compare(data.password, client.password);
    if (!isValid) {
      return errorResponse("Email o contraseña incorrectos", 401);
    }

    // Devolver información del cliente (sin la contraseña)
    const { password, ...clientWithoutPassword } = client;

    return NextResponse.json({
      message: "Login exitoso",
      client: clientWithoutPassword,
    });
  } catch (err) {
    return errorResponse("Failed to authenticate client", 500, err);
  }
}


