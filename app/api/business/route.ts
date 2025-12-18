import { prisma } from "@/lib/prisma";
// import { errorResponse } from "@/lib/errors";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const businesses = await prisma.business.findMany();
    return NextResponse.json(businesses);
  } catch (err) {
    return errorResponse("Failed to fetch businesses", 500, err);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name || !body.type)
      return errorResponse("Name and type are required");

    const business = await prisma.business.create({
      data: body,
    });

    return NextResponse.json(business, { status: 201 });
  } catch (err) {
    return errorResponse("Failed to create business", 500, err);
  }
}

export async function UPDATE(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) return errorResponse("Business ID is required");

    const business = await prisma.business.update({
      where: { id: body.id },
      data: body,
    });

    return NextResponse.json(business);
  } catch (error) {
    console.log("🚀 ~ UPDATE ~ error:", error)
    return errorResponse("Failed to update business", 500, error);
  }
}

// Por esta función simple (mantenla dentro de route.ts/js temporalmente):
function errorResponse(message: string, status = 400, error: any = null) {
  // Simplemente devuelve una respuesta de error de Next.js
  return NextResponse.json({ 
    error: message, 
    details: error?.message || String(error) 
  }, { status });
}
