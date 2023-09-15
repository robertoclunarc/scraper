import { Request,  Response  } from 'express';
import { IMaxcasa } from '../interfaces/maxcasa.interface'
import { IRealState } from '../interfaces/bienes-raices.interface';
  
export const scrapearMaxCasa = async (req: Request, resp: Response) => {   
    //para ver el formato/ejemplo del request body puede guiarse del archivo
    // ../lib/maxcasa.json, el cual tiene datos reales extraido de network/responde
    // del area herramientas de desarrollador en el navegador
    // url: https://maxcasasrd.com/propiedades?listing_type=1&currency=US&page=1
    try {        
        const propertyData: IMaxcasa[] = req.body.results;
        
        if (!propertyData) {
            return resp.status(402).json({ msg: "Sin resultado" });
        }

        const realState: IRealState[] = propertyData.map((dat) => {
            const photos = [
                { small: dat.parent.featured_image, large: dat.parent.featured_image_medium },
                { large: dat.parent.featured_image_thumb },
            ];
            const newData: IRealState = {
              property: {
                parent_id: dat.parent.uid,
                slug: dat.slug, 
                title: dat.name,
                details: dat.short_description,                
                address: dat.province,
                price: dat.sale_price?dat.sale_price.toString():"",
                type_of_business: dat.listing_type[0].listing, 
                agreement: dat.exclusive ? "exclusivo" : "", 
                type_of_property: dat.category.name,
                mts_terrain: dat.terrain_area ? dat.terrain_area + dat.terrain_area_measurer : "",
                mts_construction: dat.property_area ? dat.property_area?.toString() + dat.property_area_measurer: "", 
                parking_spaces: dat.parkinglot,
                bedrooms: dat.room? dat.room.toString(): "",
                bathrooms: dat.bathroom? dat.bathroom.toString(): "",                
                status: dat.status=="1"?"AVAILABLE":"INAVAILABLE", 
                url: `https://maxcasasrd.com/propiedad/${dat.parent.slug}`,
              },
              agents: dat.agents.map(name=> ({name})),
              currency: {iso: dat.currency_sale},
              city: {name: dat.city},
              sector: {name: dat.sector},              
              photo: photos,
            };
            return newData;
        });
        
        resp.status(200).json(realState);

    } catch (error) {
        console.error(error);
        resp.status(401).json({ err: error });
    }
}