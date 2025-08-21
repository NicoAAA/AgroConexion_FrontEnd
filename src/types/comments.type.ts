export type Image = {
    id: number
    image: string
}

export type UserComment = {
    email: string
    username: string
    profile_image: string
}
export type Comment = {
    id: number
    images: Image[]
    user: UserComment
    comment: string
}