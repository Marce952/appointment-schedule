import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/errors";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.businessId) {
      return errorResponse("Unauthorized", 401);
    }

    const businessId = session.user.businessId;
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    const where: any = {
      businessId,
      ...(name ? { name: { contains: name, mode: "insensitive" } } : {}),
    };

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
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
        skip,
        take: limit,
      }),
      prisma.client.count({ where }),
    ]);

    return NextResponse.json({
      data: clients,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    return errorResponse("Failed to fetch clients", 500, err);
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.businessId) {
      return errorResponse("Unauthorized", 401);
    }
    const businessId = session.user.businessId;

    const data = await req.json();

    if (!data.name || !data.email || !data.phone)
      return errorResponse("Missing required fields: name, email, phone");

    // Verificar si el cliente ya existe por email
    const existingClient = await prisma.client.findUnique({
      where: { email: data.email },
    });

    if (existingClient) {
      // Si existe pero es de otro negocio, devolver error
      if (existingClient.businessId !== businessId) {
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
        businessId: businessId,
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
