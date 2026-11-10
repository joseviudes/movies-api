import express from 'express'
import movieRouter from './components/movie/movie.routes.js'

// Config de Express, responde a ¿como está armada mi app?

const app = express()
app.use(express.json()) // permite leer el body en json de las requests

app.use("/api/movies", movieRouter)

app.get("/api/health/", (_req, res) => {
    res.status(200).json({ ok: true })
})



export default app