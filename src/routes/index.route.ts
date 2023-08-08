import { Router } from "express";
import { getUrlWeb, scrapearWeb, scrapeSite, scrapeAsincrono, getInfoFromAPI } from "../controllers/scraping.controller";
const router:Router = Router();

router.post('/scraping/get/links', getUrlWeb);
router.post('/scraping/site',scrapeAsincrono );
router.post('/scraping/web', scrapeSite );
router.post('/scraping/puntacana', scrapearWeb );
router.post('/scraping/remax/', getInfoFromAPI );

export default router;