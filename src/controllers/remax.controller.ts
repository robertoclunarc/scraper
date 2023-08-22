import { Request,  Response  } from 'express';
const cheerio = require('cheerio');
import axios from 'axios';
import { IRemax } from 'interfaces/remax.interface';

async function getDataFromAPI(apiUrl: string): Promise<IRemax[]> {  
  try {
    const response = await axios.get(apiUrl);
    const data: IRemax[] = response.data;
    return data;
  } catch (error) {
    console.error('Error al obtener los datos de la API:', error);
    return [];
  }
}

export const scrapearRemax = async (req: Request, resp: Response) => {
  const url: string = encodeURI(req.body.url);
  try {        
      let links: IRemax[] = await getDataFromAPI(url)
      if (!links) {
          return resp.status(402).json({ msg: "Sin resultado" });
      }
      console.log(`Nro de elementos: ${links.length}`)
      resp.status(200).json(links);

  } catch (error) {
      resp.status(401).json({ err: error });
  }
}
