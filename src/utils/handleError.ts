import { HttpError } from "./httpError.js";
import { Response } from "express";

export function handleError(res: Response, error: unknown) {
    if (error instanceof HttpError) {
        return res.status(error.status).json({ message: error.message })
    }
    console.log(error) // el detalle real queda en la consola, no lo ve el cliente
    return res.status(500).json({ message: "Error interno del servidor" })
}