import { Request, Response, NextFunction } from "express"

export function loggerMiddleware(req: Request, _res: Response, next: NextFunction) {
    const timestamp = new Date().toLocaleString("es-AR")
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`)
    next()
}
