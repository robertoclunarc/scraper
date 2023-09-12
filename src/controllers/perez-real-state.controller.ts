import { Request,  Response  } from 'express';
const cheerio = require('cheerio');
import axios from 'axios';
import { IRealState } from 'interfaces/bienes-raices.interface';

async function getPropertyPerezRealState(url: string){
  let property: IRealState ={}
  try {    
    let resp = await axios.get(`${url}`, { timeout: 120000 });    
    let _html = resp.data;    
    let $page = cheerio.load(_html);
    
    const bodyContentWithUnwantedChars = $page('body').html();
      // Limpiar el contenido del <body> de los caracteres no deseados (\n, espacios en blanco adicionales)
    let bodyContent = bodyContentWithUnwantedChars.replace(/\n/g, '').trim();
    bodyContent = bodyContent.replace(/\t/g, '').replace(/\s+/g, ' '); // y con esto quitos los carateres \t

    const title = $page('div.page-title h1').text().trim();
    
    let price: string = "";
    let iso: string="";
    let id: string="";    
    let tipoPropiedad: string="";
    let dormitorio: number=0;
    let banos: number=0;
    let superficie: string="";
    let parking: number=0;
    let status_condition: string = "";
    const propertyDetailsList = $page('div.detail-wrap ul.list-2-cols li');
    let details: any[] = [];
    propertyDetailsList.each((index: number, element: cheerio.Element) => {
        const label = $page(element).find('strong').text().trim();
        const value = $page(element).find('span').first().text().trim();
        details.push({ label:label, value: value });
    });
    
    for await (let det of details){
      switch (det.label) {          
        case 'Type de propriété:':
          tipoPropiedad = det.value != undefined ? det.value : "ANY";
          break;
        case 'Prix:':        
          price = det.value.split(" ")[1] != undefined ? det.value.split(" ")[1] : "";
          break;
        case 'Chambres:':        
          dormitorio = det.value != undefined ? det.value : "";
          break;     
        case 'Salle de bain:':        
          banos = det.value != undefined ? det.value : "";
          break;
        case 'Surface de la propriété:':        
          superficie = det.value != undefined ? det.value : "";
          break;
        case 'Parking:':        
          parking = det.value != undefined ? det.value : "";
          break;
        case 'Statut de la propriété:':        
            status_condition = det.value != undefined ? det.value : "";
          break;
        case 'ID de la propriété:':        
          id = det.value != undefined ? det.value : "0";
        break;   
        default:
          console.log(`Si te interesa, dispones del valor: ${det.label}.`);
      }        
    }
    
    if (price!==""){
      const currencySymbol = price.match(/[^\d.,]+/);
      if (currencySymbol && currencySymbol.length > 0) {
        iso =currencySymbol[0];      
      }
    }
    const detail = $page('div.block-content-wrap').html().replace(/\n/g, '').trim();
    const locationsString: string = $page('address.item-address').first().text().trim();
    
    const asesor = $page('.agent-name').first().text().trim();
    let agentPhones: any = $page('.agent-phone').map((index: number, element: cheerio.Element) => $page(element).text().trim()).get();
    agentPhones= agentPhones.join(", ");
    const agentPhotoUrl = $page('.agent-image img').attr('data-src');

    const photos = $page('#property-gallery-js div[data-thumb] img')
    .map((index: number, element: cheerio.Element) => {
        const large = $page(element).attr('data-src') || $page(element).attr('src');
        return { large };
    })
    .get();
    
    const srcVideo = $page('div.block-video-wrap iframe').attr('data-src');

    const detailCity = $page('li.detail-city span').text();
    
    const detailArea = $page('li.detail-area span').text();
    const mapIframeSrc = $page('div.property-address-wrap.property-section-wrap a.btn-primary.btn-slim').attr('href');
    
    property = {      
      photo: photos, 
      property: {
        title: title,
        details: detail,
        parent_id: id,
        price: price,
        type_of_property: tipoPropiedad !=="" ? tipoPropiedad : 'ANY' ,
        bedrooms: dormitorio,
        bathrooms: banos,
        mts_terrain: superficie,
        parking_spaces: parking,
        type_of_business:'Venta',
        status_condition: status_condition,
        url: url,
        address: locationsString,
        url_map: mapIframeSrc,
      },
      agents: [{ name: asesor, phone_number: agentPhones, photo_url: agentPhotoUrl}],
      city: {name:detailCity },
      sector: {name: detailArea},
      videos: [{video_url: srcVideo}],
      currency:{ iso: iso!=="" ? iso: "USD", symbol: "$" },
    };
    
    return property;
  } catch (error) {
    console.log(error);
    return property;
  }  
}
async function scrapeWebPage(url: string) {    
  try {    
    const response = await axios.get(`${url}`, { timeout: 120000 });// Espera de 10 segundos (en milisegundos)
    const html = response.data;      
    // Cargar el HTML en Cheerio
    const $ = cheerio.load(html);
    
    // Array para almacenar los enlaces
    const links: string[] = [];
    // Itera a través de los elementos <h2> con la clase "item-title"
    $('h2.item-title a').each((index: number, element: cheerio.Element) => {
          const link = $(element).attr('href'); // Obtén el atributo "href"
          links.push(link);
      });
    
    return {
      //body: bodyContent,
      data: links,
    };
  } catch (error) {
    console.error(error);
  }
}
  
export const scrapearPerezRealState = async (req: Request, resp: Response) => {
  const url: string = encodeURI(req.body.url);    
  try {        
    let links = await scrapeWebPage(url);
    if (!links) {
        return resp.status(402).json({ msg: "Sin resultado" });
    }         
    console.log(`nro. de elemetos a scrapear perezrealstate: ${links.data.length}`);
    let ArrayProperty = await Promise.all(links.data.map(async (lk: string) => {              
        const data = await getPropertyPerezRealState(lk);              
        return {
          property: data.property,
          photo: data.photo,
          agents: data.agents,
          city: data.city,
          sector: data.sector,
          videos: data.videos,
          currency: data.currency,
        };            
    }));
    //ArrayProperty = ArrayProperty.filter(pro => {pro.property!==undefined});
    resp.status(200).json(ArrayProperty);
  } catch (error) {
    resp.status(401).json({ err: error });
  }
}