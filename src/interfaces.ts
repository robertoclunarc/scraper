export interface IPage {
    idpage?: number;
    descripcion?: string;
    titulo?: string;
    url?: string;
    estatus?: string;
}

export interface IPagesGroup {
    idpage?: number; 
    titulo?: string; 
    descripcion?: string;
    urlpage?: string;
    idgrupo?: number; 
    grupo?: string;
    urlgrupo?: string;
}

export interface IRemax  {
    id?: string,
    parent_id?: string,
    slug?: string,
    property_title?: string,
    is_favorite?: string,
    address?: string,
    price?: string,
    alternate_price?: string,
    currency?: {
        iso?: string,
        symbol?:string,
    },
    business_type?: string,
    arrangement?: string,
    realstate_type?:string,
    sqm_construction?: string,
    sqm_land?:string,
    parking_spots?: string,
    bedrooms?: string,
    bathrooms?: string,
    city?:string,
    city_id?: string,
    sector?: string,
    sector_id?: string,
    latitude?: string,
    longitude?: string,
    maintenance_fee?: string,
    is_collection?: string,
    status?: string,
    visit_status?:string,
    floor_level?: string,
    floors_total?: string,
    pumps?: string,
    condition_status?: string,
    improvements?: 
        {
            realstate_id?:string,
            name?: string,
            value?: string,
        }[],
    agent_list?: 
        {
            id?: string,
            name?: string,
            email?: string,
            phone?: string,
            picture?: string,
            picture_url?: string,
            pivot?: {
                realstate_id?: string,
                people_id?: string,
                is_no_broker?:string,
            }
        }[],
    videos?: any[],
    main_picture?: {
        big?: string,
        small?: string,
    },
    project?: string,
    agency?: string,
    agents?: 
        {
            id?: string,
            name?: string,
            email?: string,
            phone?: string,
            picture?: string,
            picture_url?: string,
            pivot?: {
                realstate_id?: string,
                people_id?: string,
                is_no_broker?: string,
            }
        }[]        
}

export interface IPuntaCana {
    img?: string,
    name?: string,
    price?: string,
    measure?: string,
    location?: string,
    adviser?: string,
    url?: string,
    photos?: string[],
}


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