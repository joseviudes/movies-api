import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import { HttpError } from "../../utils/httpError.js"
import { userRepository } from "./user.repository.js"
import { LoginInput, UserInput } from "./user.types.js"
import { JWT_SECRET } from "../../config/jwt.js"


const SALT_ROUNDS = 10
const MIN_PASSWORD_LENGTH = 6

function normalizeEmail(email: string) {
    return email.trim().toLowerCase()
}

export const userService = {

    async register(data: UserInput) {

        const { email, name, password } = data

        if (typeof email !== "string" || typeof password !== "string" || typeof name !== "string" || !email || !name || !password) {
            throw new HttpError(400, "Name, email and password are required.")
        }

        if (password.length < MIN_PASSWORD_LENGTH) {
            throw new HttpError(400, `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`)
        }

        const normalizedEmail = normalizeEmail(email)
        const exists = await userRepository.findByEmail(normalizedEmail)

        if (exists) {
            throw new HttpError(400, "Email already registered.")
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

        const user = await userRepository.create({
            name,
            email: normalizedEmail,
            password: hashedPassword
        })

        const { password: _password, ...userWithoutPassword } = user

        return userWithoutPassword
    },

    async login(data: LoginInput) {

        const { email, password } = data

        if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
            throw new HttpError(400, "Email and password are required.")
        }

        const user = await userRepository.findByEmail(normalizeEmail(email))
        if (!user) {
            throw new HttpError(401, "Invalid credentials")
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            throw new HttpError(401, "Invalid credentials")
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email },
            JWT_SECRET,
            { expiresIn: "1h" }
        )

        return { token }
    }

}