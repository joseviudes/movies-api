import { prisma } from "../../config/prisma.js";
import { ReviewInput } from "./review.types.js";

export const reviewRepository = {
    findAllByUser: (userId: string) => prisma.review.findMany({
        where: { userId },
        include: { movie: { select: { title: true, director: true } } },
        orderBy: { createdAt: "desc" }
    }),
    findById: (id: string) => prisma.review.findUnique({ where: { id } }),
    findByUserAndMovie: (userId: string, movieId: string) => prisma.review.findFirst({
        where: { userId, movieId }
    }),
    create: (userId: string, data: ReviewInput) => prisma.review.create({
         data: {
            comment: data.comment,
            score: data.score,
            movieId: data.movieId,
            userId
         }
    }),
    delete: (id: string) => prisma.review.delete({ where: { id } }),
}