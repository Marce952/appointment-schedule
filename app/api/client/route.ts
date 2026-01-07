import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/errors";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId");

    const where = businessId ? { businessId: parseInt(businessId) } : {};

    return NextResponse.json(
      await prisma.client.findMany({
        where,
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          businessId: true,
          notes: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    );
  } catch (err) {
    return errorResponse("Failed to fetch clients", 500, err);
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.name || !data.email || !data.phone || !data.businessId)
      return errorResponse("Missing required fields: name, email, phone, businessId");

    // Verificar si el cliente ya existe por email
    const existingClient = await prisma.client.findUnique({
      where: { email: data.email },
    });

    if (existingClient) {
      // Si existe pero es de otro negocio, devolver error
      if (existingClient.businessId !== data.businessId) {
        return errorResponse("Este email ya está registrado en otro negocio", 409);
      }
      // Si existe y es del mismo negocio, devolver el cliente existente
      return NextResponse.json(existingClient, { status: 200 });
    }

    const client = await prisma.client.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        businessId: data.businessId,
        notes: data.notes || null,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        businessId: true,
        notes: true,
        createdAt: true,
      },
    });
    return NextResponse.json(client, { status: 201 });
  } catch (err: any) {
    if (err.code === "P2002")
      return errorResponse("Email already exists", 409);
    return errorResponse("Failed to create client", 500, err);
  }
}
