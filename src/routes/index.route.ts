import { Router } from "express";
import { getUrlWeb, scrapearWeb } from "../controllers/scraping.controller";
const router:Router = Router();

router.post('/get/links', getUrlWeb);
router.post('/scraping',scrapearWeb );

export default router;