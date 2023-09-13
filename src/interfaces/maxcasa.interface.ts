export interface IMaxcasa {
  agents: string[];
  cid: number;
  uid: string;
  name: string;
  slug: string;
  category: {
    id: number;
    name: string;
    name_en: string;
    priority: null | any; // Define el tipo correcto si no es nulo
  };
  condition: null | string; // Define el tipo correcto si no es nulo
  room: number;
  bathroom: number;
  half_bathrooms: null | number; // Define el tipo correcto si no es nulo
  parkinglot: number;
  listing_type: {
    id: number;
    listing: string;
  }[];
  featured_image?: string;
  featured_image_medium?: string;
  featured_image_thumb?: string;
  currency_sale: string;
  currency_rent: string;
  currency_rental: string;
  currency_furnished: string;
  currency_maintenance: string;
  currency_sale_furnished: string;
  sale_price: number;
  rent_price: null | number; // Define el tipo correcto si no es nulo
  rental_price: null | number; // Define el tipo correcto si no es nulo
  furnished_price: null | number; // Define el tipo correcto si no es nulo
  furnished_sale_price: null | number; // Define el tipo correcto si no es nulo
  property_area: null | number; // Define el tipo correcto si no es nulo
  property_area_measurer: string;
  terrain_area: null | number; // Define el tipo correcto si no es nulo
  terrain_area_measurer: string;
  province: string;
  city: string;
  sector: string;
  status: string;
  external_route: null | any; // Define el tipo correcto si no es nulo
  exclusive: boolean;
  furnished: boolean;
  featured: boolean;
  masterbroker: boolean;
  short_description: string;
  is_project_v2: boolean;
  project_values: null | any; // Define el tipo correcto si no es nulo
  parent: {
    slug: string;
    uid: string;
    tid: string;
    cid: number;
    is_project_v2: boolean;
    masterbroker: boolean;
    featured_image: string;
    featured_image_medium: string;
    featured_image_thumb: string;
  };
  is_children: boolean;
}