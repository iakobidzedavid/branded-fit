import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const destination = new URL("/admin/analytics", request.url);
  const response = NextResponse.redirect(destination);
  response.cookies.delete("admin_session");
  return response;
}
