import "dotenv/config"

const secret = process.env.JWT_SECRET

if (!secret) {
    throw new Error("JWT_SECRET is not defined in .env")
}

// Exportamos la clave secreta ya validada
export const JWT_SECRET: string = secret

