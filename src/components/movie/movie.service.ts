import { HttpError } from "../../utils/httpError.js"
import { movieRepository } from "./movie.repository.js"
import { MovieInput, MovieQuery } from "./movie.types.js"

function checkRequiredFields(data: Partial<MovieInput>) {
    const { title, director, genre, duration, yearOfRelease, rating } = data;

    if (!title || !director || !genre || duration === undefined || yearOfRelease === undefined || rating === undefined) {
        throw new HttpError(400, "Missing fields: title, director, genre, duration, yearOfRelease and rating are required.")
    }
}

const FIRST_MOVIE_YEAR = 1888;

function validateMovie(data: MovieInput) {

    const { director, genre, duration, rating, title, yearOfRelease } = data

    // Si llega un número u otro tipo, Prisma fallaría y terminaría en un 500
    if (typeof title !== "string" || typeof director !== "string" || typeof genre !== "string"
        || title.trim() === "" || director.trim() === "" || genre.trim() === "") {
        throw new HttpError(400, "Title, director and genre must be non-empty text.")
    }

    if (typeof rating !== "number" || rating < 1 || rating > 10) {
        throw new HttpError(400, "Rating must be a number between 1 and 10.")
    }

    if (!Number.isInteger(duration) || duration <= 0) {
        throw new HttpError(400, "Duration must be a positive number (minutes)")
    }

    const currentYear = new Date().getFullYear()
    if (!Number.isInteger(yearOfRelease) || yearOfRelease < FIRST_MOVIE_YEAR || yearOfRelease > currentYear) {
        throw new HttpError(400, `Year of release must be between ${FIRST_MOVIE_YEAR} and ${currentYear}.`)
    }

}

async function checkNotDuplicated(title: string, director: string, id?: string) {
    const existing = await movieRepository.findByTitleAndDirector(title, director)

    if (existing && existing.id !== id) {
        throw new HttpError(400, `A movie called ${title} directed by ${director} already exists.`)
    }
}

export const movieService = {

    getAll(query: MovieQuery) {

        let minRating: number | undefined

        if (query.minRating !== undefined) {
            minRating = Number(query.minRating)
            if (Number.isNaN(minRating) || minRating < 1 || minRating > 10) {
                throw new HttpError(400, "minRating must be a number between 1 and 10.")
            }
        }

        return movieRepository.findAll({
            genre: query.genre,
            director: query.director,
            minRating: minRating
        })
    },

    async getById(id: string) {
        const movie = await movieRepository.findById(id)
        if (!movie) throw new HttpError(404, "Movie not found.")
        return movie
    },

    async create(data: MovieInput) {
        checkRequiredFields(data)
        validateMovie(data)
        await checkNotDuplicated(data.title, data.director)
        return await movieRepository.create(data)
    },

    async update(id: string, data: MovieInput) {
        checkRequiredFields(data)
        validateMovie(data)
        await this.getById(id)
        await checkNotDuplicated(data.title, data.director, id)
        return await movieRepository.update(id, data)
    },

    async delete(id: string) {
        await this.getById(id)
        await movieRepository.delete(id)
    }


}