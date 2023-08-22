export interface IProperty {
    id?: number;
    parent_id?: string;
    slug?: string;
    title?: string;
    details?: string;
    is_favorite?: number;
    address?: string;
    price?: string;
    alternative_price?: string;
    type_of_business?: string;
    agreement?: string;
    type_of_property?: string;
    mts_construction?: string;
    mts_terrain?: string;
    parking_spaces?: number;
    bedrooms?:number;
    bathrooms?: number;
    latitude?: string;
    longitude?: string;
    maintenance_fee?: string;
    is_collection?: number;
    status?: string;
    status_visit?: string;
    floor_number?: number;
    floors_total?: number;
    bombs?: number;
    status_condition?: string;
    idpage?: number;
    iso_currency?: string;
    id_city?: number;
    id_sector?: string;
}

export interface IAgent{
    id?: number;
    name?: string;
    email?: string;
    phone_number?: string;
    photo?: string;
    photo_url?: string;
}