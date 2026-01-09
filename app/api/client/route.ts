import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/errors";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const phone = searchParams.get("phone");
    const search = searchParams.get("search"); // Búsqueda general

    let where: any = {};

    if (email) {
      where.email = email;
    } else if (phone) {
      where.phone = phone;
    } else if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
        { name: { contains: search, mode: "insensitive" } },
      ];
    }

    return NextResponse.json(
      await prisma.client.findMany({
        where,
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
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

// POST ya no se usa para crear clientes desde el negocio
// Los clientes se registran ellos mismos
export async function POST(req: Request) {
  return errorResponse("Los clientes deben registrarse ellos mismos. Use /api/client/register", 405);
}
