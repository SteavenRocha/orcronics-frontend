export interface Meta {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
}

export interface QueryResponse<T> {
    data: T[]
    meta: Meta
}