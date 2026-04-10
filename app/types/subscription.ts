import type { Customer } from "./customer"

export interface Subscription {
    id: string
    serviceName: string
    isActive: boolean
    createdAt: string
    customer: Customer
    externalAccountId: string
}