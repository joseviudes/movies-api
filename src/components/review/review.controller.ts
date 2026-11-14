import { Request, Response } from "express"
import { handleError } from "../../utils/handleError.js"
import { HttpError } from "../../utils/httpError.js"
import { isValidUUID } from "../../utils/validateUUID.js"
import { reviewService } from "./review.service.js"

export const reviewController = {

    async getMine(_req: Request, res: Response) {
        try {
            const reviews = await reviewService.getMine(res.locals.user.id)
            res.status(200).json(reviews)
        } catch (error) {
            handleError(res, error)
        }
    },

    async create(req: Request, res: Response) {
        try {
            const review = await reviewService.create(res.locals.user.id, req.body ?? {})
            res.status(201).json(review)
        } catch (error) {
            handleError(res, error)
        }
    },

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params
            if (typeof id !== "string" || !isValidUUID(id)) {
                throw new HttpError(400, "Invalid id format, must be a UUID.")
            }
            await reviewService.delete(id, res.locals.user.id)
            res.status(200).json({ message: "Review deleted." })
        } catch (error) {
            handleError(res, error)
        }
    },
}
