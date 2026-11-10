import { HttpError } from "../../utils/httpError.js"
import { movieRepository } from "./movie.repository.js"
import { MovieInput } from "./movie.types.js"

function checkRequiredFields(data: Partial<MovieInput>) {
    const { title, director, genre, duration, yearOfRelease, rating } = data;

    if (!title || !director || !genre || duration === undefined || yearOfRelease === undefined || rating === undefined) {
        throw new HttpError(400, "Fields are missings, title, director, genre, duration, yearOfRelease, rating are required.")
    }
}

export const movieService = {

    getAll() {
        return movieRepository.findAll()
    },

    async getById(id: string) {
        const movie = await movieRepository.findById(id)
        if (!movie) throw new HttpError(404, "Movie not found.")
        return movie
    },

    async create(data: MovieInput) {
        checkRequiredFields(data)
        return await movieRepository.create(data)
    },

    async update(id: string, data: MovieInput) {
        checkRequiredFields(data)
        await this.getById(id)
        return await movieRepository.update(id, data)
    },

    async delete(id: string) {
        await this.getById(id)
        await movieRepository.delete(id)
    }


}