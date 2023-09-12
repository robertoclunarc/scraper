export interface IRemax  {
    id?: number,
    parent_id?: string,
    slug?: string,
    property_title?: string,
    is_favorite?: number,
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
    parking_spots?: number,
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
            realstate_id?:number,
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
    project?: {
        id?: number,
        delivers?: string,
        separation_price?: number,
        separation_currency?: {
            iso?:string,
            symbol?: string
        },
        sets_count?: number,
        units_count?: number,
        minimum_price?: number,
        maximum_price?: number
    }    
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