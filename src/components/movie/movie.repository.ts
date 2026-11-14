import { prisma } from "../../config/prisma.js";
import { MovieFilters, MovieInput } from "./movie.types.js";


export const movieRepository = {
    findAll: (query: MovieFilters) => prisma.movie.findMany({
        where: {
            genre: query.genre ? { equals: query.genre, mode: "insensitive" } : undefined,
            director: query.director ? { contains: query.director, mode: "insensitive" } : undefined,
            rating: query.minRating !== undefined ?  { gte: query.minRating } : undefined
        },
        orderBy: { createdAt: "asc" }
    }),
    findById: (id: string) => prisma.movie.findUnique({ where: { id } }),
    findByTitleAndDirector: (title: string, director: string) => prisma.movie.findFirst({
        where: {
            title: { equals: title, mode: "insensitive" },
            director: { equals: director, mode: "insensitive" }
        }
    }),
    create: (data: MovieInput) => prisma.movie.create({ data }),
    update: (id: string, data: MovieInput) => prisma.movie.update({ where: { id }, data }),
    delete: (id: string) => prisma.movie.delete({ where: { id } }),
}