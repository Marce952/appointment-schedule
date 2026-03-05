import { google } from "googleapis";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.businessId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const businessId = session.user.businessId;

    // 1. Obtener eventos de Google Calendar
    let googleEvents: any[] = [];
    try {
      const auth = new google.auth.JWT({
        email: process.env.GOOGLE_CLIENT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
      });

      const calendar = google.calendar({ version: "v3", auth });
      const calendarId = process.env.GOOGLE_CALENDAR_ID;

      if (calendarId) {
        const response = await calendar.events.list({
          calendarId,
          timeMin: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(), // Un mes atrás para ver historial reciente
          maxResults: 100,
          singleEvents: true,
          orderBy: "startTime",
        });

        googleEvents = response.data.items?.map((event) => ({
          id: event.id,
          title: `[GC] ${event.summary} `,
          start: event.start?.dateTime || event.start?.date,
          end: event.end?.dateTime || event.end?.date,
          source: 'google'
        })) || [];
      }
    } catch (gcError) {
      console.error("Error fetching Google Calendar events:", gcError);
      // Continuamos aunque falle Google Calendar
    }

    // 2. Obtener citas de la base de datos local
    const dbAppointments = await prisma.appointment.findMany({
      where: {
        businessId,
        status: 'CONFIRMED'
      },
      include: {
        client: true,
        pet: true,
        service: true
      }
    });

    const dbEvents = dbAppointments.map(app => {
      const start = new Date(app.date);
      const durationInMinutes = app.service?.duration || 60;
      const end = new Date(start.getTime() + durationInMinutes * 60 * 1000);

      return {
        id: `db - ${app.id} `,
        title: `${app.service?.name}: ${app.client.name} ${app.pet ? `(${app.pet.name})` : ''} `,
        start: start.toISOString(),
        end: end.toISOString(),
        source: 'local',
        status: app.status
      };
    });

    // Combinar ambos
    const allEvents = [...googleEvents, ...dbEvents];

    return NextResponse.json(allEvents);
  } catch (error) {
    console.error("Error al obtener eventos del calendario:", error);
    return NextResponse.json({ error: "Error al obtener eventos" }, { status: 500 });
  }
}