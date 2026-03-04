export function formatDate(date: string) {
    return new Date(date).toLocaleDateString('es-PE', {
        day: 'numeric', month: 'numeric', year: 'numeric'
    })
}