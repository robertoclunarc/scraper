import { Request,  Response  } from 'express';
const cheerio = require('cheerio');
import axios from 'axios';
import { IAgent, IProperty, ISector, IVideo, Icity } from 'interfaces/bienes-raices.interface';

async function getPropertyPerezRealState(url: string){
    const uri: string =  url;
    let resp = await axios.get(`${uri}`, { timeout: 120000 });
    let _html = resp.data;    
    let $page = cheerio.load(_html);
    
    const bodyContentWithUnwantedChars = $page('body').html();
      // Limpiar el contenido del <body> de los caracteres no deseados (\n, espacios en blanco adicionales)
    let bodyContent = bodyContentWithUnwantedChars.replace(/\n/g, '').trim();
    bodyContent = bodyContent.replace(/\t/g, '').replace(/\s+/g, ' '); // y con esto quitos los carateres \t

    const title = $page('div.page-title h1').text().trim();
    //const liElement = $page('ul.item-price-wrap li.item-price');
    let price: string = "";//liElement.text().trim();
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
              tipoPropiedad = det.value;
              break;
            case 'Prix:':        
              price=  det.value.split(" ")[1];
              break;
            case 'Chambres:':        
              dormitorio=  det.value;
              break;     
            case 'Salle de bain:':        
              banos=  det.value;
              break;
            case 'Surface de la propriété:':        
              superficie=  det.value;
              break;
            case 'Parking:':        
              parking=  det.value;
              break;
            case 'Statut de la propriété:':        
                status_condition=  det.value;
              break;  
            default:
              console.log(`Sorry, we are out of ${det.label}.`);
          }
        
    }

    const detail = $page('div.block-content-wrap').html().replace(/\n/g, '').trim();
    const locationsString: string = $page('address.item-address').first().text().trim();

    const asesor = $page('.agent-name').first().text().trim();
    let agentPhones: any = $page('.agent-phone').map((index: number, element: cheerio.Element) => $page(element).text().trim()).get();
    agentPhones= agentPhones.join(", ");
    const agentPhotoUrl = $page('.agent-image img').attr('data-src');

    const photos = $page('#property-gallery-js div[data-thumb] img')
    .map((index: number, element: cheerio.Element) => $page(element).attr('data-src') || $page(element).attr('src'))
    .get();
    
    const srcVideo = $page('div.block-video-wrap iframe').attr('data-src');

    const detailCity = $page('li.detail-city span').text();
    const detailArea = $page('li.detail-area span').text();
    const mapIframeSrc = $page('div.property-address-wrap.property-section-wrap a.btn-primary.btn-slim').attr('href');
    
    return {      
      body: bodyContent,
      photos: photos, 
      property: {
        titte: title,
        details: detail,
        //parent_id: id,
        price: price,
        type_of_property: tipoPropiedad,
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
      agent: { name: asesor, phone_number: agentPhones, photo_url: agentPhotoUrl},
      city: {name:detailCity },
      sector: {name: detailArea},
      video: {video_url: srcVideo}
    };
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
          
          let property: {scraping?: any, property?: IProperty, photos?: string[], agent?: IAgent, city?:Icity, sector?: ISector, video?: IVideo};
          let ArrayProperty: {scraping?: any, property?: IProperty, photos?: string[], agent?: IAgent, city?:Icity, sector?: ISector, video?: IVideo}[]=[];
          let index: number=0;
          console.log(`nro. de elemetos a scrapear perezrealstate: ${links.data.length}`)
          for await (let lk of links.data){
            let property={};
            if (index===1){
                property = await getPropertyPerezRealState(lk);
                ArrayProperty.push(property);
            }
            index++;
          }
          
          resp.status(200).json(ArrayProperty);
  
      } catch (error) {
          resp.status(401).json({ err: error });
      }
  }