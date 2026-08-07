import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
    "/admin",
    "/user",
    "/staff"
]
export function middleware(request: NextRequest) {
    const token = request.cookies.get("accessToken")?.value;
    const isProtected = protectedRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route)
    )

    if(!token && isProtected) {
        return NextResponse.redirect(
            new URL("/login", request.url)
        )
    }
}