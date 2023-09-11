import axios from 'axios';
import { Router } from "express";
import { getUrlWeb, scrapeSite, scrapeAsincrono } from "../controllers/scraping.controller";
import { scrapearPuntaCana } from '../controllers/punta-cana.controller';
import { scrapearRemax, migrarRemax } from '../controllers/remax.controller';
import { scrapearPerezRealState } from '../controllers/perez-real-state.controller';
const router:Router = Router();

class HealthChecker {
  static async check() {
    const healthChecker = new HealthChecker();
    const testConec = await healthChecker.testConnection();
    return {
      uptime: process.uptime(),
      response: process.hrtime(),
      message: 'OK',
      Axios: testConec,
      timestamp: Date.now(),
    };
  }

  async testConnection() {
    let message: any;
    let isError = false;
    try {
      await axios.get('https://www.google.com');
      message = 'Conexión establecida!';
    } catch (err) {
      message = err;
      isError = true;
    }
    console.log(message);

    return {
      status: isError ? 'Error' : 'OK',  message,
    };
  }
}

router.get('/', async (_req, res, _next) => {
    try {
      res.send(await HealthChecker.check());
    } catch (error) {
      res.status(503).send(error);
    }
});
router.post('/scraping/get/links', getUrlWeb);
router.post('/scraping/site',scrapeAsincrono );
router.post('/scraping/web', scrapeSite );
router.post('/scraping/puntacana', scrapearPuntaCana );
router.post('/scraping/remax', scrapearRemax );
router.post('/scraping/perezrealstate', scrapearPerezRealState );

export default router;