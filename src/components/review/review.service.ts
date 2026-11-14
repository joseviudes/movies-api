import { HttpError } from "../../utils/httpError.js"
import { isValidUUID } from "../../utils/validateUUID.js"
import { movieService } from "../movie/movie.service.js"
import { reviewRepository } from "./review.repository.js"
import { ReviewInput } from "./review.types.js"

function validateReview(data: ReviewInput) {
    const { movieId, comment, score } = data

    if (typeof movieId !== "string" || !isValidUUID(movieId)) {
        throw new HttpError(400, "movieId is required and must be a UUID.")
    }

    if (typeof comment !== "string" || comment.trim() === "") {
        throw new HttpError(400, "Comment is required.")
    }

    if (!Number.isInteger(score) || score < 1 || score > 10) {
        throw new HttpError(400, "Score must be an integer between 1 and 10.")
    }
}

export const reviewService = {

    getMine(userId: string) {
        return reviewRepository.findAllByUser(userId)
    },

    async create(userId: string, data: ReviewInput) {
        validateReview(data)

        // Si la película no existe, getById ya tira 404
        await movieService.getById(data.movieId)

        const existing = await reviewRepository.findByUserAndMovie(userId, data.movieId)
        if (existing) {
            throw new HttpError(400, "You already reviewed this movie.")
        }

        return reviewRepository.create(userId, data)
    },

    async delete(id: string, userId: string) {
        const review = await reviewRepository.findById(id)

        if (!review || review.userId !== userId) {
            throw new HttpError(404, "Review not found.")
        }

        await reviewRepository.delete(id)
    }
}