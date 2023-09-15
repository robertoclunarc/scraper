import { Request,  Response  } from 'express';
const cheerio = require('cheerio');
import axios from 'axios';

async function scrapeWebPage(url: string) {    
  try {    
    const response = await axios.get(`${url}`, { timeout: 120000 });// Espera de 10 segundos (en milisegundos)
    const html = response.data;
    
    // Cargar el HTML en Cheerio
    const $ = cheerio.load(html);
    
    const bodyContentWithUnwantedChars = $('body').html();
    // Limpiar el contenido del <body> de los caracteres no deseados (\n, espacios en blanco adicionales)
    const bodyContent = bodyContentWithUnwantedChars.replace(/\n/g, '').trim();  
    
    return {
      body: bodyContent,
      
    };
  } catch (error) {
    console.error(error);
  }
}
  
export const scrapearNOMBREDEPAGE = async (req: Request, resp: Response) => {
  const url: string = encodeURI(req.body.url);    
  try {        
      let links = await scrapeWebPage(url);        
      
      if (!links) {
          return resp.status(402).json({ msg: "Sin resultado" });
      }          
      
      resp.status(200).json(links);

  } catch (error) {
      resp.status(401).json({ err: error });
  }
}