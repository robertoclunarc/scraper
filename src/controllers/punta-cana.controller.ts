import { Request,  Response  } from 'express';
const cheerio = require('cheerio');
import axios from 'axios';
import {  IPuntaCana } from '../interfaces/punta-cana.interface'
import { IProperty, IAgent } from '../interfaces/bienes-raices.interface'

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
  const viviendas = propertyListings.map(async (listing) => {
    const $listing = cheerio.load(listing);

    const img = $listing('div.photo img').attr('src');    
    const name = $listing('div.description h4.name a').text();    
    const price = $listing('div.description span.listing-type-price').text().trim();
    //const location = $listing('div.description p').text().trim();
    const measure = $listing('div.description ul.info li').text().trim();
    const url: string  = "https://www.puntacanasolutions.com" + $listing('div.photo a').attr('href');
    
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

    const vivienda: IPuntaCana = {
      img: img,
      name: name,
      price: price,
      measure: measure,
      location: location,
      adviser: adviser,
      url: url,
    };

    return vivienda;
  });
  return viviendas;
}

async function getPropertyPuntaCana(url: string){
  const uri: string =  url;
  let resp = await axios.get(`${uri}`, { timeout: 120000 });
  let _html = resp.data;    
  let $page = cheerio.load(_html);
  let photos: string[] = [];  
  $page('img.rsImg').each((index: number, element: cheerio.Element) => {
    const imageUrl = $page(element).attr('src'); // Obtener el atributo src
    if (imageUrl) {
      photos.push(imageUrl);
    }
  });
  const details = $page('div#summary table tbody')
    .children('tr')
    .map((index: number, element: cheerio.Element) => {
      const label = $page(element).children('td').eq(0).text().trim();
      const value = $page(element).children('td').eq(1).text().trim();
      return { label, value };
    })
  const detail = $page('div.info').text().trim();
  const title = $page('div.col-sm-8 h1.title').text().trim();

  let id: string="";
  let price: string="";
  let tipoPropiedad: string="";
  let dormitorio: number=0;
  let banos: number=0;
  let superficie: string="";
  let parking: number=0;

  let asesor: string="";

  for await (let det of details){   
    switch (det.label) {
      case 'ID:':
        id = det.value;
        break;
      case 'Tipo:':
        tipoPropiedad = det.value;
        break;
      case 'Precio de venta:':        
        price=  det.value;
        break;
      case 'Dormitorios:':        
        dormitorio=  det.value;
        break;     
      case 'Baños:':        
        banos=  det.value;
        break;
      case 'Superficie total:' || 'Terreno:':        
        superficie=  det.value;
        break;
      case 'Estacionamientos:':        
        parking=  det.value;
        break;
      case 'Asesor:':        
        asesor=  det.value;
        break;  
      default:
        console.log(`Sorry, we are out of ${det.label}.`);
    }
  }

  const locationLinks = $page('h2.location a');
  const locationTexts = locationLinks.map((index: number, element: cheerio.Element) => {
    return $page(element).text().trim();
  }).get();
  const locationsString: string = locationTexts.join(', ');

  // Obtener la URL del iframe de Google Maps
  const mapIframeSrc = $page('div.map-container iframe').attr('src');
  // Extraer las coordenadas de la URL del iframe
  const coordinatesRegex = /q=([-+]?\d+\.\d+),([-+]?\d+\.\d+)/;
  const matches = mapIframeSrc.match(coordinatesRegex);
  let latitude: any;
  let longitude: any;
  
  if (matches && matches.length === 3) {
    latitude = parseFloat(matches[1]);
    longitude = parseFloat(matches[2]);
  }  
  
  return {
    photos: photos, 
    property: {
      titte: title,
      details: detail,
      parent_id: id,
      price: price,
      type_of_property: tipoPropiedad,
      bedrooms: dormitorio,
      bathrooms: banos,
      mts_terrain: superficie,
      parking_spaces: parking,
      type_of_business:'Venta',
      address: locationsString,
      latitude: latitude?.toString(),
      longitude: longitude?.toString(),
      url_map: mapIframeSrc,
      url: url,
    },
    agent: { name: asesor},
    body: $page('div.col-md-8').html()
  };
}

async function scrapeWebPage(url: string) {    
  try {    
    const response = await axios.get(`${url}`, { timeout: 120000 });// Espera de 10 segundos (en milisegundos)
    const html = response.data;
    
    // Cargar el HTML en Cheerio
    const $ = cheerio.load(html);

    // Obtener el número de la última página del paginador
    let nroPag = await getNumPages($);
    
    const bodyContentWithUnwantedChars = $('body').html();
    // Limpiar el contenido del <body> de los caracteres no deseados (\n, espacios en blanco adicionales)
    const bodyContent = bodyContentWithUnwantedChars.replace(/\n/g, '').trim();
    let viviendasPromises: any[]=[];
    let homes : any[];
    for (let i = 1; i<= nroPag; i++){
      homes =[];
      let uri: string  = `${url}?page=${i}`;
      let resp = await axios.get(`${uri}`, { timeout: 120000 });
      let _html = resp.data;    
      let $page = cheerio.load(_html);
      homes = await getViviendas($page);
      
      viviendasPromises = viviendasPromises.concat(homes);
    } 
    const allViviendas = await Promise.all(viviendasPromises);
    const viviendas = allViviendas.reduce((accumulator, current) => accumulator.concat(current), []);
    
    console.log(`Nro. de elementos: ${viviendas.length}`)
    return {
      body: bodyContent,
      viviendas: viviendas,
    };
  } catch (error) {
    console.error(error);
  }
}

export const scrapearPuntaCana = async (req: Request, resp: Response) => {
    const url: string = encodeURI(req.body.url);    
    try {        
        let links = await scrapeWebPage(url);        
        
        if (!links) {
            return resp.status(402).json({ msg: "Sin resultado" });
        }
        let arrayPuntaCana: {scraping?: any, data?: IPuntaCana, property?: IProperty, photos?: string[], agent?: IAgent}[]=[];
        let puntaCana: {scraping?: any, data?: IPuntaCana, property?: IProperty, photos?: string[], agent?: IAgent};
        let propertyPuntaCana: {body?: string, property?: IProperty, photos?: string[], agent?: IAgent } = {};
        
        let index: number = 0;//quitar esta linea al terminar
        for await (let pta of links?.viviendas){
          if (index===15 || index===11 || index===12|| index===13){//quitar esta linea al terminar
            puntaCana= {};          
            propertyPuntaCana=await getPropertyPuntaCana(pta.url);            
            puntaCana.scraping=propertyPuntaCana.body;//quitar esta linea al terminar
            puntaCana.data=pta;
            puntaCana.property=propertyPuntaCana.property;
            puntaCana.photos = propertyPuntaCana.photos;
            puntaCana.agent = propertyPuntaCana.agent;
            arrayPuntaCana.push(puntaCana);  
          }//quitar esta linea al terminar
          index++;//quitar esta linea al terminar
        }
        
        resp.status(200).json(arrayPuntaCana);

    } catch (error) {
        resp.status(401).json({ err: error });
    }
}

