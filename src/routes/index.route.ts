import { Router } from "express";
import { getUrlWeb, scrapeSite, scrapeAsincrono } from "../controllers/scraping.controller";
import { scrapearPuntaCana } from '../controllers/punta-cana.controller';
import { scrapearRemax, migrarRemax } from '../controllers/remax.controller';
import { scrapearPerezRealState } from '../controllers/perez-real-state.controller';
const router:Router = Router();

class HealthChecker {
    static check() {
     return {
        uptime: process.uptime(),
        response: process.hrtime(),
        message: 'OK',
        timestamp: Date.now()
      };
    }
}

router.get('/', async (_req, res, _next) => {
    try {
      res.send(HealthChecker.check());
    } catch (error) {
      res.status(503).send(error);
    }
});
router.post('/scraping/get/links', getUrlWeb);
router.post('/scraping/site',scrapeAsincrono );
router.post('/scraping/web', scrapeSite );
router.post('/scraping/puntacana', scrapearPuntaCana );
router.post('/scraping/remax', scrapearRemax );
router.post('/scraping/migrar/remax', migrarRemax);
router.post('/scraping/perezrealstate', scrapearPerezRealState );

export default router;