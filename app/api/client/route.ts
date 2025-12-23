import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/errors";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json(
      await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          businessId: true,
        },
      })
    );
  } catch (err) {
    return errorResponse("Failed to fetch users", 500, err);
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.email || !data.businessId)
      return errorResponse("Missing required fields");

    const user = await prisma.user.create({ data });
    return NextResponse.json(user, { status: 201 });
  } catch (err: any) {
    if (err.code === "P2002")
      return errorResponse("Email already exists", 409);
    return errorResponse("Failed to create user", 500, err);
  }
}
