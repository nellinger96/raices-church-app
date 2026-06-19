import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const { pathname } = request.nextUrl;

  const isTodosLosDiasDomain =
    host === "iglesiadetodoslosdias.church" ||
    host === "www.iglesiadetodoslosdias.church";

  if (isTodosLosDiasDomain && pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/todos-los-dias";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
