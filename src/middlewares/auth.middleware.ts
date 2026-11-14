import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config/jwt.js"

export function authMiddleware(req: Request, res: Response, next: NextFunction) {

    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Token not provided." })
        return
    }

    const token = authHeader.split(" ")[1]

    try {
        const payload = jwt.verify(token, JWT_SECRET)
        res.locals.user = payload
    } catch {
        res.status(401).json({ message: "Invalid or expired token." })
        return
    }

    next()
}