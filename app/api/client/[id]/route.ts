import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/errors";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET: Obtener un cliente específico
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.businessId) {
      return errorResponse("Unauthorized", 401);
    }
    const businessId = session.user.businessId;

    const client = await prisma.client.findFirst({
      where: {
        id: parseInt(params.id),
        businessId: businessId
      },
      // No incluir la contraseña, usar select exclusivamente
      select: {
        id: true,
        businessId: true,
        name: true,
        phone: true,
        email: true,
        date: true,
        notes: true,
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

    if (!client) {
      return errorResponse("Client not found", 404);
    }

    return NextResponse.json(client);
  } catch (err) {
    return errorResponse("Failed to fetch client", 500, err);
  }
}

// PATCH: Actualizar un cliente
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.businessId) {
      return errorResponse("Unauthorized", 401);
    }
    const businessId = session.user.businessId;

    const data = await req.json();
    const clientId = parseInt(params.id);

    // Verificar que el cliente existe y pertenece al negocio
    const existingClient = await prisma.client.findFirst({
      where: {
        id: clientId,
        businessId: businessId
      },
    });

    if (!existingClient) {
      return errorResponse("Client not found", 404);
    }

    // Preparar los datos de actualización
    const updateData: any = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    if (data.email !== undefined) {
      updateData.email = data.email;
    }

    if (data.phone !== undefined) {
      updateData.phone = data.phone;
    }

    if (data.notes !== undefined) {
      updateData.notes = data.notes;
    }

    const updatedClient = await prisma.client.update({
      where: {
        id: clientId,
        businessId: businessId
      },
      data: updateData,
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

    return NextResponse.json(updatedClient);
  } catch (err: any) {
    if (err.code === "P2002") {
      return errorResponse("Email already exists", 409);
    }
    return errorResponse("Failed to update client", 500, err);
  }
}

// DELETE: Eliminar un cliente
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.businessId) {
      return errorResponse("Unauthorized", 401);
    }
    const businessId = session.user.businessId;

    const clientId = parseInt(params.id);

    // Verificar si el cliente tiene citas asociadas
    const appointments = await prisma.appointment.count({
      where: { clientId },
    });

    if (appointments > 0) {
      return errorResponse(
        "No se puede eliminar el cliente porque tiene citas asociadas",
        400
      );
    }

    await prisma.client.delete({
      where: {
        id: clientId,
        businessId: businessId
      },
    });

    return NextResponse.json({ message: "Client deleted successfully" });
  } catch (err) {
    return errorResponse("Failed to delete client", 500, err);
  }
}
