import express, { NextFunction, Request, Response } from 'express'
import movieRouter from './components/movie/movie.routes.js'
import userRouter from './components/user/user.routes.js'
import reviewRouter from './components/review/review.routes.js'
import { loggerMiddleware } from './middlewares/logger.middleware.js'

// Config de Express, responde a ¿como está armada mi app?

const app = express()
app.use(loggerMiddleware) // primero, así se loguean todas las requests (incluso las que tienen un JSON roto)
app.use(express.json()) // permite leer el body en json de las requests

app.use("/api/movies", movieRouter)
app.use("/api/reviews", reviewRouter)
app.use("/api/auth", userRouter)

app.get("/api/health/", (_req, res) => {
    res.status(200).json({ ok: true })
})

// Si ninguna ruta de arriba coincidió, la ruta no existe -> 404 en JSON (en vez del HTML por defecto de Express)
app.use((_req: Request, res: Response) => {
    res.status(404).json({ message: "Route not found." })
})

// Middleware de errores: Express lo reconoce porque recibe 4 parámetros.
// Atrapa errores que no pasan por los try/catch, por ejemplo un body con JSON mal escrito.
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (error instanceof SyntaxError) {
        res.status(400).json({ message: "Invalid JSON body." })
        return
    }
    console.log(error)
    res.status(500).json({ message: "Error interno del servidor" })
})

export default app
