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
    url_map?: string;
    maintenance_fee?: string;
    is_collection?: number;
    status?: string;
    status_visit?: string;
    floor_number?: number;
    floors_total?: number;
    pombs?: string;
    status_condition?: string;
    idpage?: number;
    idcurrency?: number;
    id_city?: number;
    id_sector?: number;
    url?: string;
}

export interface IAgent{
    id?: number;
    name?: string;
    email?: string;
    phone_number?: string;
    photo?: string;
    photo_url?: string;
}

export interface ISector{
    id?:number;
    name?: string;
}

export interface Icity{
    id?:number;
    name?: string;
}

export interface IVideo{
    id?:number;
    id_property?: number;
    video_url?: string;
}

export interface ICurrency {
    iso?: string;
    symbol?: string;
    idcurrency?: number;
}

export interface Iimprovements {
    id_property?: number;    
    name?: string;
    value?: string;
}

export interface IPhoto {
    id?: number;
    id_property?: number;
    large?: string;
    small?: string;
}

export interface IPropertyAgents{
    id_property?: number;
    id_agent?: number;
    is_no_coordinator?: number;
}

export interface IProject{
    id?: number;
    delivery_date?: string;
    separation_price?: number;
    iso_currency_separation?: string;
    number_of_sets?: number;
    number_of_units?: number;
    id_property?:number;
    idcurrency?: number;
}
    
export interface IRealState { 
    property?: IProperty, 
    currency?: ICurrency, 
    city?: Icity, 
    improvements?: Iimprovements[], 
    sector?: ISector, 
    photo?: IPhoto[], 
    agents?: IAgent[], 
    videos?: IVideo[], 
    project?: IProject
}