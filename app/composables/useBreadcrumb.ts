export function useBreadcrumb(labels?: MaybeRef<{
    customer?: string | null
    branch?: string | null
    area?: string | null
}>) {
    const route = useRoute()
    const customerId = route.params.customerId as string | undefined
    const branchId = route.params.branchId as string | undefined
    const areaId = route.params.areaId as string | undefined

    const items = computed(() => {
        const l = isRef(labels) ? labels.value : (labels ?? {})
        const crumbs: { label: string; to?: string; icon?: boolean }[] = [
            { label: 'Inicio', to: '/', icon: true },
            { label: 'Clientes', to: customerId ? '/customers' : undefined },
        ]

        if (customerId) {
            crumbs.push({
                label: l.customer ?? '...',
                to: areaId || branchId ? `/customers/${customerId}` : undefined
            })
        }

        if (branchId) {
            crumbs.push({
                label: l.branch ?? '...',
                to: areaId ? `/customers/${customerId}/branches/${branchId}` : undefined
            })
        }

        if (areaId) {
            crumbs.push({ label: l.area ?? '...' })
        }

        return crumbs
    })

    return { items }
}