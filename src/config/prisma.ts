import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";


// Crear la conexión en el código

// Acá creamos una instancia del Prisma Client que luego vamos a usar en toda la app, s el punto central de conexión entre el backend y la bdd

// el adapter define como se conecta Prisma con la bdd
const adapter = new PrismaPg({connectionString: process.env.DATABASE_URL})

export const prisma = new PrismaClient({adapter})