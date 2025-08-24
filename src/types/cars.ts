export interface Car {
    _id: string
    owner_id: string
    make: string
    carModel: string
    year: number
    price?: number | null
    description?: string
    location?: string
    engineType?: string
    vehicleType?: string
    fuelType?: string
    transmission?: string
    mileage?: number | null
    created_at?: Date
}
