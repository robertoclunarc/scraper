import { Request,  Response  } from 'express';
const cheerio = require('cheerio');
import axios from 'axios';
import { IPhoto, IRealState, Iimprovements } from 'interfaces/bienes-raices.interface';

async function getPropertyEncuentra24(url: string) {    
    try { 
        let realState: IRealState={};   
        const response = await axios.get(`${url}`, { timeout: 120000 });// Espera de 10 segundos (en milisegundos)
        const html = response.data;
        
        // Cargar el HTML en Cheerio
        const $ = cheerio.load(html);
        
        const bodyContentWithUnwantedChars = $('body').html();
        // Limpiar el contenido del <body> de los caracteres no deseados (\n, espacios en blanco adicionales)
        const bodyContent = bodyContentWithUnwantedChars.replace(/\n/g, '').trim();
        const productTitle = $('h1.product-title').text().replace(/\n/g, '').trim();
        const price = $('div.offer-price').text().replace(/\n/g, '').trim();
        //console.log(`${productTitle}/${price}: ${url}`);
        if (productTitle){
            let simboloMonetario = price.match(/[^\d.,]+/)[0] ? price.match(/[^\d.,]+/)[0]: "Ref";
            const userAvatar = $('div.user-info img.user-avatar').attr('src');
            const userName = $('div.user-info span.user-name').text();
            let telefonoAgent = $('span.phone.icon.icon-call.phone-confirmed').text().match(/\d/g);
            if (telefonoAgent){
                telefonoAgent = telefonoAgent.slice(0, 11).join("");
            }
            const imageLinks: IPhoto[] = [];
            $('div.photo-slider a').each((index: number, element: cheerio.Element) => {
                const href = $(element).attr('href');
                imageLinks.push({ large: href, small:href });
            });
            const infoArray: Iimprovements[] = [];
            let bathroom: string="0";
            let bedrooms: string="0";
            let parking: number=0;
            let address: string="";
            let city: string="";
            let sector: string="";
            let typeProperty: string="";
            $('div.col-800 ul li').each((index: number, element: cheerio.Element) => {
                const infoName = $(element).find('.info-name').text();
                const infoValue = $(element).find('.info-value').text();
                if (infoName!==""){
                    if(infoName.trim()=="Categoria:"){
                        typeProperty=infoValue.trim();
                    }
                    if(infoName.trim()=="Baños:"){
                        bathroom=infoValue.trim();
                    }
                    if(infoName.trim()=="Recámaras:"){
                        bedrooms=infoValue.trim();
                    }
                    if(infoName.trim()=="Parking:"){
                        parking=parseInt(infoValue);
                    }
                    if(infoName.trim()=="Localización:"){
                        address=infoValue.trim();
                        city=infoValue.trim();
                    }
                    if(infoName.trim()=="Dirección exacta:"){
                        address+=". "+infoValue.trim();
                        sector=infoValue.trim();
                    }
                    const infoObject = {
                        name: infoName.trim(),
                        value: infoValue.trim(),
                    };
                    infoArray.push(infoObject);
                }
            });
            $('div.col-800 ul.product-features li').each((index: number, element: cheerio.Element) => {
                const featureName = 'Beneficio';
                const featureValue = $(element).text().trim();
                const featureObject = {
                name: featureName,
                value: featureValue,
                };
                infoArray.push(featureObject);
            });
            const adIdElement = $('span.ad-id').text();
            const parent_id = adIdElement.replace('ID.: ', '').trim();
            // Extraer el resto del contenido
            const detailsElement = $('div.col-800 > p').html();
            const details = detailsElement ? detailsElement.trim() : '';
            realState={
                property: {
                    parent_id: parent_id,
                    title: productTitle,
                    details: details,
                    price: price,
                    url: url,
                    bathrooms: bathroom,
                    bedrooms: bedrooms,
                    parking_spaces: parking,
                    address: address,
                    type_of_property: typeProperty,
                },
                city: {name: city},
                sector: {name: sector},
                improvements: infoArray,
                photo: imageLinks,
                agents: [{name: userName, photo_url: userAvatar, phone_number: telefonoAgent }],
                currency: {symbol: simboloMonetario, iso: "Ref"}
            };
        }
        return realState;    
    } catch (error) {
      console.error(error);
    }
}

async function scrapeWebPage(url: string, inicio?: number, fin?: number) {    
    try {    
        const response = await axios.get(`${url}`, { timeout: 120000 });// Espera de 12 segundos (en milisegundos)
        const html = response.data;
        
        // Cargar el HTML en Cheerio
        const $listing = cheerio.load(html);
        
        const bodyContentWithUnwantedChars = $listing('body').html();
        // Limpiar el contenido del <body> de los caracteres no deseados (\n, espacios en blanco adicionales)
        //const bodyContent = bodyContentWithUnwantedChars.replace(/\n/g, '').trim();  
        const nroPage = $listing('div.ann-listing__resultinfo-item').text();
        const totalAnuncios = nroPage.match(/Encontramos (\d+) anuncios/);
        const anunciosPorPag = nroPage.match(/(\d+) a (\d+) anuncios/);        
        let cantidadTotalAnuncios: number;
        let numeroPorPagina: number;
        if (totalAnuncios && anunciosPorPag) {
            cantidadTotalAnuncios = parseInt(totalAnuncios[1]);
            numeroPorPagina = parseInt(anunciosPorPag[2]);            
        } else {
            return({totalAnuncios: 0, linkAnuncios:[] });
        }
        
        //////////raspar link por pagina////////////////////////
        let linsksPag1: string[] = [];
        $listing('a.ann-ad-tile__title').each((index: number, element: cheerio.Element) => {
            const hrefs = $listing(element).attr('href');
            if (hrefs) {                
                linsksPag1.push(`https://www.encuentra24.com${hrefs}`);
            }
        });
        let linsksRestantes: string[]=[];
        if (inicio && fin){
            linsksRestantes = await scrapeEncuentra24Pages(url,cantidadTotalAnuncios,numeroPorPagina,inicio,fin);
        }
        else{
            linsksRestantes = await scrapeEncuentra24Pages(url, cantidadTotalAnuncios,numeroPorPagina);
        }
        if (inicio===1 && fin && fin>inicio){
            linsksPag1 = linsksPag1.concat(linsksRestantes);
        }
        else{
            linsksPag1 = linsksRestantes;
        }
        ///////////////////////////////////////////////////////
        return {
            totalAnuncios: cantidadTotalAnuncios,
            anuciosPorPagina: numeroPorPagina,
            anunciosConfirmados: linsksPag1.length,
            linkAnuncios: linsksPag1,            
        };
    } catch (error) {
        console.error(error);
    }
}

async function scrapeEncuentra24Pages(uriOrigin: string, cantidadTotalAnuncios: number, numeroPorPagina: number, inicio?: number, fin?: number) {
    const paginados: number = inicio && fin ? fin : Math.floor(cantidadTotalAnuncios / numeroPorPagina);
    
    let i: number = inicio && fin ? inicio : 2
    const requests = [];
  
    for ( i ; i <= paginados; i++) {
      //const sigPag = `https://www.encuentra24.com/dominicana-es/searchresult/all.${i}?q=notcat.anuncios-casificados-musica-moda-arte,autos,anuncios-casificados-mascotas-animales,anuncios-casificados-negocios-servicios,electronica,anuncios-casificados-muebles-hogar-y-jardin,anuncios-casificados-construccion-y-mantenimiento,anuncios-casificados-cursos-clases-seminarios,salud-belleza,anuncios-clasificados-deportes-y-ocio,anuncios-casificados-mercancia-mayorista,anuncios-clasificados-juguetes-ninos,anuncios-casificados-yates-barcos,empleos|f_currency.DOP`;
      const sigPag = uriOrigin.replace(/all.1/g, `all.${i}`);
      requests.push(axios.get(sigPag, { timeout: 120000 }));
      //console.log(sigPag);
    }
  
    const responses = await Promise.all(requests);
  
    const linsks: string[] = [];
  
    responses.forEach((xresponse) => {
      const xhtml = xresponse.data;
      const $xlisting = cheerio.load(xhtml);
  
      $xlisting('a.ann-ad-tile__title').each((index: number, element: cheerio.Element) => {
        const xhrefs = $xlisting(element).attr('href');
        if (xhrefs) {
          linsks.push(`https://www.encuentra24.com${xhrefs}`);
        }
      });
    });
  
    return linsks;
}
  
export const scrapearEncuentra24 = async (req: Request, resp: Response) => {
    const url: string = encodeURI(req.body.url); 

    try {        
        let links = await scrapeWebPage(url,req.body.inicio,req.body.fin);
        
        if (!links) {
            return resp.status(402).json({ msg: "Sin resultado" });
        }
        
        let arrayEncuentra24: IRealState[]=[];
        
        //propertyEnc24 = await getPropertyEncuentra24(links.linkAnuncios[13]);
        arrayEncuentra24 = await Promise.all(links?.linkAnuncios.map(async (pta: string) => {
            //console.log(pta);
            const data = await getPropertyEncuentra24(pta);            
            return {
                property: data?.property,
                photo: data?.photo,
                agents: data?.agents,
                improvements: data?.improvements,
                city: data?.city,
                sector: data?.sector,
                currency: data?.currency,
            };               
        }));
        console.log(`encuentre24 tiene: ${arrayEncuentra24.length} elementos.`);
        resp.status(200).json(arrayEncuentra24);

    } catch (error) {
        resp.status(401).json({ err: error });
    }
}