export interface Movie {
    id: string,
    title: string,
    release_date: Date | null,
    runtime: number,
    mpaa_rating: "G" | "PG" | "PG13" | "R" | "NC17" | "",
    rating: string,
    description: string
}

export type Option = {
    id: string,
    value: string
}