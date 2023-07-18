import { Request,  Response  } from 'express';
const cheerio = require('cheerio');
const axios = require('axios');
import  { scrapeIt, scrapeWebsite, scrapeAsync } from '../middlewares/';

/*async function scrapeIt (url, opts) {
  const res = await req(url)
  let scrapedData = scrapeIt.scrapeHTML(res.$, opts)
  return Object.assign(res, {
      data: scrapedData,
      body: res.data
  })
}*/

async function searchWebPages(query: string) {
  
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

async function scrapeWebPage(query: string) {    
    try {
      console.log(query);
      let links: any = await searchWebPages(query);
       
      // Obtener el HTML de la página web
      console.log(links[0]);
      const response = await axios.get('https://www.conlallave.com/casas-en-venta.html');
      const html = response.data;
      
      // Cargar el HTML en Cheerio
      const $ = cheerio.load(html);
      console.log($);
      // Encontrar los elementos que deseas extraer
      const title = $('title').text();
      const paragraph = $('p').first().text();
      console.log('Título:', title);
      console.log('Párrafo:', paragraph);
      // Imprimir los resultados
      return ({titulo: title, parrafo: paragraph});
      
    } catch (error) {
      console.error(error);
    }
}

export const scrapearWeb = async (req: Request, resp: Response) => {
    const query: string = encodeURI(req.body.query);
    try {        
        let links: any = await scrapeWebPage(query);        
        if (links.length==0) {
            return resp.status(402).json({ msg: "Sin resultado" });
        }
        resp.status(200).json(links);

    } catch (error) {
        resp.status(401).json({ err: error });
    }
}

export const scrapearIt = async (req: Request, resp: Response) => {
  const query: string = encodeURI(req.body.query);
  try {        
      let links: any = await scrapeWebsite();
      if (links.length==0) {
          return resp.status(402).json({ msg: "Sin resultado" });
      }
      resp.status(200).json(links);

  } catch (error) {
      resp.status(401).json({ err: error });
  }
}