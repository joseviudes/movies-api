import { Request, Response } from "express"
import { userService } from "./user.service.js"
import { handleError } from "../../utils/handleError.js"


export const userController = {

    async register(req: Request, res: Response) {
        try {
            const user = await userService.register(req.body ?? {})
            res.status(201).json(user)
        } catch (error) {
            handleError(res, error)
        }

    },

    async login(req: Request, res: Response) {
        try {
            const result = await userService.login(req.body ?? {})
            res.status(200).json(result)
        } catch (error) {
            handleError(res, error)
        }
    }
}