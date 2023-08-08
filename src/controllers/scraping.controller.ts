import { Request,  Response  } from 'express';
const cheerio = require('cheerio');
import axios from 'axios';
//import axiosRetry from 'retry-axios';
import  { scrapeIt, scrapeWebsite, scrapeAsync, } from '../middlewares/scrapeIt';
import { IRemax } from '../interfaces'

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

async function getNumPages($: cheerio.Root){  
  const lastPageNumber: number[]=[];
  $('div.pagination ul li a').each((index: number, element: cheerio.Element) => {
    const text = $(element).text().trim();    
    const pag = parseInt(text);
    if (typeof(pag)=='number'&& pag>=1) {
      lastPageNumber.push(pag);
    }        
  });
  let nroPag = 1;
  if (lastPageNumber.length){
    nroPag = Math.max(...lastPageNumber)
  }
  // Imprimir el número de la última página
  return(nroPag);
}

async function getViviendas($: cheerio.Root) {
 
  const propertyListings: string[] = [];
  $('li.property-listing.clearfix').each((index: number, element: cheerio.Element) => {
    const propertyContentWithUnwantedChars = $(element).html();
    if (propertyContentWithUnwantedChars) {
        const propertyContent = propertyContentWithUnwantedChars.replace(/\n/g, '').trim();
        propertyListings.push(propertyContent);
    }
  });        

  // Crear el arreglo de objetos "viviendas"
  const viviendas = propertyListings.map((listing) => {
    const $listing = cheerio.load(listing);

    const img = $listing('div.photo img').attr('src');
    const name = $listing('div.description h4.name a').text();
    const price = $listing('div.description span.listing-type-price').text().trim();
    //const location = $listing('div.description p').text().trim();
    const measure = $listing('div.description ul.info li').text().trim();

    // Obtener el valor de la propiedad location o adviser dependiendo del contexto
    let location = '';
    let adviser = '';
    $listing('div.description p').each((index: number, element: cheerio.Element) => {
        const text = $(element).text().trim();
        if (text.startsWith('Asesor:')) {
            adviser = text.replace('Asesor:', '').trim();
        } else {
            location = text;
        }
    });

    return {
        img: img,
        name: name,
        price: price,
        measure: measure,
        location: location,
        adviser: adviser,
    };
  });
  return viviendas;
}

async function scrapeWebPage(url: string) {    
  try {    
    const response = await axios.get(`${url}`);
    const html = response.data;
    
    // Cargar el HTML en Cheerio
    const $ = cheerio.load(html);

    // Obtener el número de la última página del paginador
    let nroPag = await getNumPages($);
    console.log(nroPag);
    
    const bodyContentWithUnwantedChars = $('body').html();
    // Limpiar el contenido del <body> de los caracteres no deseados (\n, espacios en blanco adicionales)
    const bodyContent = bodyContentWithUnwantedChars.replace(/\n/g, '').trim();
    let viviendas: any[]=[];
    let homes : any[];
    for (let i = 1; i<= nroPag; i++){
      homes =[];
      let uri: string  = `${url}?page=${i}`;
      let resp = await axios.get(`${uri}`);
      let _html = resp.data;    
      let $page = cheerio.load(_html);
      homes = await getViviendas($page);
      viviendas = viviendas.concat(homes);
    }    
    
    console.log(`Nro. de elementos: ${viviendas.length}`)
    return({
      body: bodyContent,
      viviendas
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

export const getInfoFromAPI = async (req: Request, resp: Response) => {
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
