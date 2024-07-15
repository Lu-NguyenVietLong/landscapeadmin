import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import useAuth from './packages/hook/useAuth';

const protectedRoutes = ["/", "/services", "/order", "products"]

export function middleware(request: NextRequest) {
    const cookies = request.cookies.get('Info');
    if (!cookies && protectedRoutes.includes(request.nextUrl.pathname)) {
        const absoluteURL = new URL("/login", request.nextUrl.origin)
        return NextResponse.redirect(absoluteURL.toString())
    }
}