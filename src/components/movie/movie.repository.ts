import { prisma } from "../../config/prisma.js";
import { MovieInput } from "./movie.types.js";


export const movieRepository = {
    findAll: () => prisma.movie.findMany({ orderBy: { id: "asc" } }),
    findById: (id: string) => prisma.movie.findUnique({ where: { id } }),
    create: (data: MovieInput) => prisma.movie.create({ data }),
    update: (id: string, data: MovieInput) => prisma.movie.update({ where: { id }, data }),
    delete: (id: string) => prisma.movie.delete({ where: { id } }),
}