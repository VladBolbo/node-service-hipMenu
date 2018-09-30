import { Request, Response } from 'express';
import * as express from 'express';
import { ControllerRestaurant } from '../controller/controller';

export class Routes {

    public controller: ControllerRestaurant =  new ControllerRestaurant();

    public routes(app: express.Application): void {

        // Restaurant 
        app.get('/restaurant/', async (req: Request, res: Response) => {
            try{
                const result = await this.controller.readAll();
                res.json(result);
            } catch(err) {
                res.send(err.message);
            }
        });

        app.get('/restaurant/:id', async (req: Request, res: Response) => {
            try{
                const result = await this.controller.read(req.params.id);
                res.json(result);
            } catch(err) {
                res.send(err.message);
            }
        });

        app.post('/restaurant/', async (req: Request, res: Response) => {
            try {
                const result = await this.controller.create(req.body);
                res.status(200).json(result);
            } catch(err) {
                res.send(err.message);
            }
            
        });

        app.put('/restaurant/:id', async (req: Request, res: Response) => {
            try {
                const result = await this.controller.update(req.params.id, req.body);
                return res.status(200).json(result);                    
            } catch(err) {
                res.send(err.message);
            }
        });

        app.delete('/restaurant/:id', async (req: Request, res: Response) => {
            try {
                const result = await this.controller.delete(req.params.id);
                return res.status(200).json(result);                    
            } catch(err) {
                res.send(err.message);
            }
        });

        // Menus
        app.get('/res-menu/:id', async (req: Request, res: Response) => {
            try {
                const result = await this.controller.readMenu(req.params.id);
                return res.status(200).json(result); 
            } catch(err) {
                res.send(err.message);
            }
        });

        app.get('/res-menu/', async (req: Request, res: Response) => {
            try {
                const result = await this.controller.readAllMenus();
                return res.status(200).json(result); 
            } catch(err) {
                res.send(err.message);
            }
        });

   }
}

