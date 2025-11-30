export interface VehicleFilter {
    brand?: string
    vehicleModel?: string
    name?: string
    minYear?: number
    maxYear?: number
    minPrice?: number
    maxPrice?: number
    state?: string
    city?: string
    engine?: string
    fuel?: string
    transmission?: string
    bodyType?: string
    mileage?: number
    maxMileage?: number
    page?: number
    limit?: number
}

export type SortBy = 'createdAt' | 'price' | 'year' | 'mileage'
export type SortOrder = 'asc' | 'desc'