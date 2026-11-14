
export interface UserInput {
    email: string
    name: string
    password: string
}

export type LoginInput = Pick<UserInput, "email" | "password">

