import { Router } from "express";
import { getUrlWeb, scrapeSite, scrapeAsincrono } from "../controllers/scraping.controller";
import { scrapearPuntaCana } from '../controllers/punta-cana.controller';
import { scrapearRemax } from '../controllers/remax.controller';
const router:Router = Router();

router.post('/scraping/get/links', getUrlWeb);
router.post('/scraping/site',scrapeAsincrono );
router.post('/scraping/web', scrapeSite );
router.post('/scraping/puntacana', scrapearPuntaCana );
router.post('/scraping/remax/', scrapearRemax );

export default router;