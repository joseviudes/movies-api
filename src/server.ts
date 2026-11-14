import "dotenv/config"
import app from "./app.js"
import { prisma } from "./config/prisma.js"

// responde a ¿como y donde se enciede?

const PORT = process.env.PORT || 3000



async function start() {
    try {

        await prisma.$connect()

        // la app escucha las peticiones que llegan a ese puerto
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}/api/`)
        })

    } catch (error) {
        console.log("No se pudo conectar a la base de datos: ", error)
        process.exit(1)
    }
}

start()


