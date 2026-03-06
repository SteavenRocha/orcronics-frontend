import type { Branch } from '~/types/branch'
import type { QueryResponse } from '~/types/pagination'

export const branchesService = {
    getAllByCustomer: (customerId: string, page = 1, limit = 10) =>
        $fetch<QueryResponse<Branch>>(`${useApi()}/branches/customer/${customerId}?page=${page}&limit=${limit}`),
}