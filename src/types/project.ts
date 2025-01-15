export type Project = {
    title: string
    slug: string
    description: string
    thumbnail?: string
    password: string
    tags: string[]
    pageUrl?: string
    public?: boolean
    createdAt?: number
    updatedAt?: number
}
