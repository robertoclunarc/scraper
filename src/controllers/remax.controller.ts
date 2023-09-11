import { Request,  Response  } from 'express';
//const cheerio = require('cheerio');
import dotenv from 'dotenv';
import fetch from "node-fetch";
import axios from 'axios';
import { IRemax } from 'interfaces/remax.interface';
import { IAgent, ICurrency, IPhoto, IProject, IProperty, IRealState, ISector, IVideo, Icity, Iimprovements } from 'interfaces/bienes-raices.interface';

dotenv.config();

async function getDataFromAPI(apiUrl: string): Promise<any[]> {  
  try {
    console.log(`conectandose a: ${apiUrl}`);
    const response = await axios.get(apiUrl, { timeout: 120000 });
    const data: IRemax[] = response.data.data;

    let propertys: IRealState[]=[];
    let property: IProperty;
    let currency: ICurrency;
    let city: Icity;
    let improvements: Iimprovements[];
    let sector: ISector;
    let photo: IPhoto[];
    let agents: IAgent[];
    let videos: IVideo[];
    let project: IProject;
    for await (let dt of data){
      property={};
      currency={};
      city={};
      sector={};
      improvements=[];
      photo=[];
      agents=[];
      videos=[];
      project={};
      property={
        url: `https://remaxrd.com/propiedad/${dt.realstate_type}/${dt.slug}`,
        title: dt.property_title,
        details: `${dt.condition_status} ${dt.property_title}. ${dt.city}. ${dt.arrangement}`,
        price: `${dt.currency?.symbol}${dt.price}`,
        type_of_property: dt.realstate_type,
        bedrooms: dt.bedrooms,
        bathrooms: dt.bathrooms,
        mts_terrain: dt.sqm_construction,
        parking_spaces: dt.parking_spots,
        type_of_business: dt.business_type,
        status_condition: dt.condition_status,
        address: `${dt.city} ${dt.sector}`,
        longitude: dt.longitude,
        latitude: dt.latitude,
        parent_id: dt.parent_id,
		    slug: dt.slug,
        is_favorite: dt.is_favorite,        
        alternative_price: dt.alternate_price,
        agreement: dt.arrangement,
        is_collection: Number(dt.is_collection),
        status: dt.status,        
        floors_total: Number(dt.floors_total),		    
      };
      currency= { iso: dt.currency?.iso, symbol: dt.currency?.symbol  };
      city={ name: dt.city};
      sector = {name: dt.sector};
      improvements = dt.improvements?.map(improvement => {
        const { name, value } = improvement;
        return {           
           name: name,
           value: value,
        };
      }) || [];
      photo[0] = {small: dt.main_picture?.small, large: dt.main_picture?.big};
      agents = dt.agents?.map(agent => {
        const { name, email, phone, picture_url , picture} = agent;
        return {           
           name,
           email,           
           phone_number: phone,
           photo:picture,
           photo_url: picture_url,
        };
      }) || [];
      videos = dt.videos?.map( vid => {
        const  url = vid.url;
        return { video_url: url}
      }) || [];
      project={        
        delivery_date: dt.project?.delivers,
        separation_price: dt.project?.separation_price,
        iso_currency_separation: dt.project?.separation_currency?.iso,
        number_of_sets: dt.project?.sets_count,
        number_of_units: dt.project?.units_count,
      };
      propertys.push({ property, currency, city, improvements, sector, photo, agents, videos, project});
    }

    return (propertys);
    
  } catch (error) {
    console.error('Error al obtener los datos de la API:', error);
    return [];
  }
}

export const scrapearRemax = async (req: Request, resp: Response) => {
  
  const url: string = encodeURI(req.body.url);
  try {      
      let links: IRealState[]=[];
      const data: any = await getDataFromAPI(url);
      if (!data) {
          return resp.status(402).json({ msg: "Sin resultado" });
      }
      links = data;
      console.log(`Nro. de elementos en Remax: ${links.length}`);
      
      resp.status(200).json(links);

  } catch (error) {
      resp.status(401).json({ err: error });
  }
}

export const migrarRemax = async (req: Request, resp: Response) => {
  
  const url: string = encodeURI(req.body.url);
  try {      
      let links: IRealState[]=[];
      const data: any = await getDataFromAPI(url);
      if (!data) {
          return resp.status(402).json({ msg: "Sin resultado" });
      }
      links = data;
      console.log(`Nro. de elementos en Remax: ${links.length}`);
      
      // Enviar los datos a la api-database
      const apiDatabaseURL = process.env.URLREMAX || ''; // Cambiar la URL según tu configuración
      console.log(`conectandose a ${apiDatabaseURL}`);
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(links),
      };

      const response = await fetch(apiDatabaseURL, requestOptions);
      const databaseResponse = await response.json();

      console.log(`Respuesta de api-database:`, databaseResponse);      
      resp.status(200).json({cosola: databaseResponse, data: links});
  } catch (error) {
      
      resp.status(401).json({ err: error });
  }
}
