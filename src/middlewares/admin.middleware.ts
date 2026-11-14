import { NextFunction, Request, Response } from "express";



export function adminMiddleware(_req: Request, res: Response, next: NextFunction) {

    const user = res.locals.user

    if (!user || user.role !== "ADMIN") {
        res.status(403).json({ message: "Only admins can perform this action." })
        return
    }

    next()
}