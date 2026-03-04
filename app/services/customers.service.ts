export const customersService = {
    getAll: () => $fetch<any>(`${useApi()}/customers?limit=100&page=1`),
    create: (body: object) => $fetch(`${useApi()}/customers`, { method: 'POST', body }),
    update: (id: string, body: object) => $fetch(`${useApi()}/customers/${id}`, { method: 'PATCH', body }),
    remove: (id: string) => $fetch(`${useApi()}/customers/${id}`, { method: 'DELETE' }),
    activate: (id: string) => $fetch(`${useApi()}/customers/activate/${id}`, { method: 'PATCH' }),
    deactivate: (id: string) => $fetch(`${useApi()}/customers/deactivate/${id}`, { method: 'PATCH' }),
}