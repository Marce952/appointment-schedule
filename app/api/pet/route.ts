import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/errors";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json(
      await prisma.pet.findMany({
        include: { client: true },
      })
    );
  } catch (err) {
    return errorResponse("Failed to fetch pets", 500, err);
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.name || !data.clientId || !data.businessId)
      return errorResponse("Missing pet data");

    const pet = await prisma.pet.create({ data });
    return NextResponse.json(pet, { status: 201 });
  } catch (err) {
    return errorResponse("Failed to create pet", 500, err);
  }
}
