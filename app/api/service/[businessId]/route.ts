import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/errors";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { businessId: string } }) {
  try {
    const { businessId } = params;
    console.log("🚀 ~ GET ~ businessId:", businessId)

    parseInt(businessId, 10);
    return NextResponse.json(await prisma.service.findMany({
      where: {
        businessId
      }
    }));
  } catch (err) {
    return errorResponse("Failed to fetch service?", 500, err);
  }
}