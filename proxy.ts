import { auth } from "@/lib/auth/server";
import { NextRequest, NextResponse } from "next/server";

const protectedMiddleware = auth.middleware({
  loginUrl: "/auth/sign-in",
});

export default function proxy(req: NextRequest) {
  // Let Server Action POSTs through — auth is enforced inside the action itself
  if (req.headers.get("next-action")) {
    return NextResponse.next();
  }

  return protectedMiddleware(req);
}

export const config = {
  matcher: [
    // Protected routes requiring authentication
    "/account/:path*",
    "/dashboard/:path*",
    "/events/:path*",
  ],
};
