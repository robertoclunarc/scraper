import { Router } from "express";
import { getUrlWeb, scrapearPuntaCana, scrapeSite, scrapeAsincrono, scrapearRemax } from "../controllers/scraping.controller";
const router:Router = Router();

router.post('/scraping/get/links', getUrlWeb);
router.post('/scraping/site',scrapeAsincrono );
router.post('/scraping/web', scrapeSite );
router.post('/scraping/puntacana', scrapearPuntaCana );
router.post('/scraping/remax/', scrapearRemax );

export default router;