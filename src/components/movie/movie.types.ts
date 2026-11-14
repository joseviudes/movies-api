
export interface MovieInput {
    title: string
    director: string
    genre: string
    duration: number
    yearOfRelease: number
    rating: number
}

export interface MovieQuery {
    genre?: string
    director?: string
    minRating?: string
}

export interface MovieFilters {
    genre?: string
    director?: string
    minRating?: number
}