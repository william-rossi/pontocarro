export interface Vehicle {
    _id: string
    owner_id: string
    title: string
    brand: string
    vehicleModel: string
    engine: string
    year: number
    price: number
    mileage: number
    state: string
    city: string
    fuel: string
    exchange: string
    bodyType: string
    color: string
    description: string
    features?: string[]
    images?: string[]
    firstImageUrl?: string
    announcerName: string;
    announcerEmail: string;
    announcerPhone: string;
    created_at?: Date
}

export interface Image {
    _id: string;
    vehicle_id: string;
    imageUrl: string;
    created_at?: Date;
}
