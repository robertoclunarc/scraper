import { Request,  Response  } from 'express';
const cheerio = require('cheerio');
import axios from 'axios';
//import axiosRetry from 'retry-axios';
import  { scrapeWebsite, scrapeAsync, } from '../middlewares/scrapeIt';

async function searchWebPages(query: string) {
  console.log(query);
  try {
    // Hacer una solicitud GET a Google con la consulta de búsqueda
    const response = await axios.get(`https://www.google.com/search?q=${query}`);
    
    const html = response.data;    
    // Cargar el HTML en Cheerio
    const $ = cheerio.load(html);    
    // Encontrar los enlaces de los resultados de búsqueda
    const links: string[] = [];
    $('a').each((index: any, element: any) => {
      const href = $(element).attr('href');
      if (href.startsWith('/url?q=')) {
        links.push(href.substr(7));
      }
    });    
    // Imprimir los resultados
    console.log('Resultados de búsqueda:', links.length);
    return links;
  } catch (error) {
    console.error(error);
  }
}

export const getUrlWeb = async (req: Request, resp: Response) => {
    const query: string = encodeURI(req.body.query);
    try {        
        let links: any = await searchWebPages(query);        
        if (links.length==0) {
            return resp.status(402).json({ msg: "Sin resultado" });
        }
        resp.status(200).json(links);
    } catch (error) {
        resp.status(401).json({ err: error });
    }
}

/*
export const scrapearPuntaCana = async (req: Request, resp: Response) => {
    const url: string = encodeURI(req.body.url);    
    try {        
        let links = await scrapeWebPage(url);        
        
        if (!links) {
            return resp.status(402).json({ msg: "Sin resultado" });
        }
        let arrayPuntaCana: {data?: IPuntaCana, property?: IProperty, photos?: string[], agent?: IAgent}[]=[];
        let puntaCana: {data?: IPuntaCana, property?: IProperty, photos?: string[], agent?: IAgent};
        let propertyPuntaCana: {body?: string, property?: IProperty, photos?: string[], agent?: IAgent } = {};
        let scraping: any;
        let index: number = 0;
        for await (let pta of links?.viviendas){
          if (index===15 || index===16 || index===6|| index===10){
            puntaCana= {};          
            propertyPuntaCana=await getPropertyPuntaCana(pta.url);
            //quitar esta linea al terminar:
            scraping=propertyPuntaCana.body;

            puntaCana.data=pta
            puntaCana.property=propertyPuntaCana.property;
            puntaCana.photos = propertyPuntaCana.photos;
            puntaCana.agent = propertyPuntaCana.agent;
            arrayPuntaCana.push(puntaCana);  
          }
          index++;      
        }
        
        resp.status(200).json({data: arrayPuntaCana, scraping: scraping});

    } catch (error) {
        resp.status(401).json({ err: error });
    }
}
*/
export const scrapeAsincrono = async (req: Request, resp: Response) => {
  const query: string = encodeURI(req.body.query);
  try {        
      let data: any = await scrapeAsync();
      if (!data) {
          return resp.status(402).json({ msg: "Sin resultado" });
      }
      resp.status(200).json(data);

  } catch (error) {
      resp.status(401).json({ err: error });
  }
}

export const scrapeSite = async (req: Request, resp: Response) => {
  //const query: string = encodeURI(req.body.query);
  try {        
      let links: any = await scrapeWebsite();
      if (!links) {
          return resp.status(402).json({ msg: "Sin resultado" });
      }
      resp.status(200).json(links);

  } catch (error) {
      resp.status(401).json({ err: error });
  }
}
/*
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
*/