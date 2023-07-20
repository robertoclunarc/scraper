import { Router } from "express";
import { getUrlWeb, scrapearWeb, scrapeSite, scrapeAsincrono } from "../controllers/scraping.controller";
const router:Router = Router();

router.post('/scraping/get/links', getUrlWeb);
router.post('/scraping/site',scrapeAsincrono );
router.post('/scraping/web', scrapeSite );
router.post('/scraping/url', scrapearWeb );

export default router;