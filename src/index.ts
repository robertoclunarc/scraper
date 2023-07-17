import express, { Application} from 'express';
import cors from 'cors';
import indexRoutes from './routes/index.route';

class Server {
    public app: Application;
    constructor(){
        this.app = express();
        this.config();
        this.routes();
    }

    config(): void {
        this.app.set('port',process.env.PORT || 3500);        
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
    }

    routes(): void{
        this.app.use(indexRoutes);
    }

    start(): void{
        this.app.listen(this.app.get('port'), () => {
            console.log('server on port: ', this.app.get('port'));                 
        })
    }
}

const server = new Server();
server.start();