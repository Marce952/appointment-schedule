// middleware.ts
export { default } from "next-auth/middleware";

export const config = { 
  // Aquí defines qué rutas están protegidas
  matcher: [
    "/dashboard/:path*", // Protege dashboard y todas sus sub-rutas
    "/api/admin/:path*"  // También puedes proteger rutas de API internas
  ] 
};