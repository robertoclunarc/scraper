import { Request,  Response  } from 'express';
const cheerio = require('cheerio');
import axios from 'axios';
//import axiosRetry from 'retry-axios';
import  { scrapeIt, scrapeWebsite, scrapeAsync } from '../middlewares/scrapeIt';

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

async function scrapeWebPage(url: string) {    
    try {      
      
      const response = await axios.get(`${url}`);
      const html = response.data;
      
      // Cargar el HTML en Cheerio
      const $ = cheerio.load(html);
      console.log($);
      // Encontrar los elementos que deseas extraer
      const title = $('title').text();
      const paragraph = $('p').first().text();
      const contains = $('contains').text();
      const load = $('load').text();
      const xml = $('xml').text();
      const text = $('text').text();
      const parseHTML = $('parseHTML').text();
      const htmlx = $('html').text();
      // Imprimir los resultados
      return ({
        titulo: title, 
        parrafo: paragraph, 
        contenido: contains,
        carga: load,
        xml: xml,
        texto: text,
        phtml: parseHTML,
        hipertexto: htmlx,
      });
      
    } catch (error) {
      console.error(error);
    }
}

export const scrapearWeb = async (req: Request, resp: Response) => {
    const url: string = encodeURI(req.body.url);
    try {        
        let links: any = await scrapeWebPage(url);        
        if (links.length==0) {
            return resp.status(402).json({ msg: "Sin resultado" });
        }
        resp.status(200).json(links);

    } catch (error) {
        resp.status(401).json({ err: error });
    }
}

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
  const query: string = encodeURI(req.body.query);
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
