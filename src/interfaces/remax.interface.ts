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