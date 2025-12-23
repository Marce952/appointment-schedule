import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/errors";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { business, services, user } = body;

    // 1. Validaciones básicas
    if (!user.email || !user.password || !business.name) {
      return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
    }

    // 2. Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // 3. Transacción de Prisma: Crea todo en un solo paso
    const result = await prisma.business.create({
      data: {
        name: business.name,
        type: business.type,
        address: business.address,
        phone: business.phone,
        email: business.email,
        website: business.website,
        
        // Creamos los servicios asociados (Array del Paso 2)
        services: {
          create: services.map((s: any) => ({
            name: s.name,
            duration: parseInt(s.duration),
            price: parseFloat(s.price),
          })),
        },

        // Creamos el usuario administrador (Paso 3)
        users: {
          create: {
            name: user.name,
            email: user.email,
            password: hashedPassword,
            phone: user.phone,
            role: 'admin',
          },
        },
      },
      include: {
        services: true,
        users: true,
      }
    });

    return NextResponse.json({ message: "Registro exitoso", data: result }, { status: 201 });

  } catch (error: any) {
    console.error("Error en registro:", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "El email ya está registrado" }, { status: 400 });
    }
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}