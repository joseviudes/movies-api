import { Request, Response } from "express";
import { handleError } from "../../utils/handleError.js";
import { HttpError } from "../../utils/httpError.js";
import { isValidUUID } from "../../utils/validateUUID.js";
import { movieService } from "./movie.service.js";



function getValidId(req: Request): string {
    const { id } = req.params
    if (typeof id !== "string" || !isValidUUID(id)) {
        throw new HttpError(400, "Invalid id format, must be a UUID.")
    }
    return id
}

export const movieController = {

    async getAll(_req: Request, res: Response) {
        try {
            const movies = await movieService.getAll()
            res.status(200).json(movies)
        } catch (error) {
            handleError(res, error)
        }
    },

    async getById(req: Request, res: Response) {
        try {
            const id = getValidId(req)
            const movie = await movieService.getById(id)
            res.status(200).json(movie)
        } catch (error) {
            handleError(res, error)
        }
    },

    async create(req: Request, res: Response) {
        try {
            const movie = await movieService.create(req.body)
            res.status(201).json(movie)
        } catch (error) {
            handleError(res, error)
        }
    },

    async update(req: Request, res: Response) {
        try {
            const id = getValidId(req)
            const movie = await movieService.update(id, req.body)
            res.status(200).json(movie)
        } catch (error) {
            handleError(res, error)
        }
    },

    async delete(req: Request, res: Response) {
        try {
            const id = getValidId(req)
            await movieService.delete(id)
            res.status(200).json({ message: "Movie deleted." })
        } catch (error) {
            handleError(res, error)
        }
    },

}