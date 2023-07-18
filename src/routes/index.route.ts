import { Router } from "express";
import { getUrlWeb, scrapearWeb, scrapearIt } from "../controllers/scraping.controller";
const router:Router = Router();

router.post('/scraping/get/links', getUrlWeb);
router.post('/scraping/web',scrapearWeb );
router.post('/scraping/it', scrapearIt );

export default router;