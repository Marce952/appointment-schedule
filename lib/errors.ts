import { NextResponse } from "next/server";

export function errorResponse(
  message: string,
  status = 400,
  details?: unknown
) {
  return NextResponse.json(
    { error: message, details },
    { status }
  );
}
