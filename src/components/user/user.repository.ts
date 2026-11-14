import { prisma } from "../../config/prisma.js";
import { UserInput } from "./user.types.js";

export const userRepository = {
    // FindUnique en vez de FindFirst prque el email es unique
    findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),
    create: (data: UserInput) => prisma.user.create({ data })
}