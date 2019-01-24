import { Request, Response } from 'express';
import * as express from 'express';
import { RestaurantController } from '../controllers/restaurant-controller'
import { MenuController } from '../controllers/menu-controller';
import { Crypto } from '../helpers/hash';
var User = require('../auth-system/models/user');

interface ILooseObject {
    [key: string]: any
}

export class Routes {

    public controllerRestaurant: RestaurantController =  new RestaurantController();
    public controllerMenu: MenuController =  new MenuController();
    public cript: Crypto = new Crypto();

    public routes(app: express.Application): void {

        var sessionChecker = (req: Request, res: Response, next: express.NextFunction) => {
            if ((<any>req).session.user && req.cookies.user_sid) {
                res.redirect('/dashboard');
            } else {
                next();
            }    
        };

        app.get('/', sessionChecker, (req, res) => {
            res.redirect('/login');
        });
        
        

        app.route('/signup')
            .get(sessionChecker, (req, res) => {
                res.sendFile(__dirname + '/public/signup.html');
            })
            .post((req, res) => {
                User.create({
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password
                })
                .then((user: ILooseObject) => {
                    (<any>req).session.user = user.dataValues;
                    res.redirect('/dashboard');
                })
                .catch((error: Error) => {
                    console.log(error);
                    res.redirect('/signup');
                });
            });
        
        
        app.route('/login')
            .get(sessionChecker, (req, res) => {
                res.sendFile(__dirname + '/public/login.html');
            })
            .post((req, res) => {
                var username = req.body.username,
                    password = req.body.password;
        
                User.findOne({ where: { username: username } }).then(function (user: ILooseObject) {
                    if (!user) {
                        res.redirect('/login');
                    } else if (!user.validPassword(password)) {
                        res.redirect('/login');
                    } else {
                        (<any>req).session.user = user.dataValues;
                        res.redirect('/dashboard');
                    }
                });
            });
        
        
        app.get('/dashboard', (req, res) => {
            if ((<any>req).session.user && req.cookies.user_sid) {
                res.sendFile(__dirname + '/public/dashboard.html');
            } else {
                res.redirect('/login');
            }
        });
        
    
        app.get('/logout', (req, res) => {
            if ((<any>req).session.user && req.cookies.user_sid) {
                res.clearCookie('user_sid');
                res.redirect('/');
            } else {
                res.redirect('/login');
            }
        });

        // Restaurant 

        //DEFAULT ROUTE
        // app.get('/', async (req: Request, res: Response) => {
        //     res.render('index');
        // })

        app.get('/restaurant/', async (req: Request, res: Response) => {
            try{
                const result = await this.controllerRestaurant.readAll();
                
                //result.forEach((element:any) => element.name = this.cript.encryptMD5(element.name));
                res.render('restaurantList', { restaurantList: result});
                //res.json(result);
            } catch(err) {
                res.send(err.message);
            }
        });

        app.get('/restaurant/:id', async (req: Request, res: Response) => {
            try{
                const result = await this.controllerRestaurant.read(req.params.id);
                
                (<any>result).owner = this.cript.encryptMD5(result.owner);
                
                res.json(result);
            } catch(err) {
                res.send(err.message);
            }
        });



        app.post('/restaurant/', async (req: Request, res: Response) => {
            try {
                const result = await this.controllerRestaurant.create(req.body);
             
                (<any>result).owner = this.cript.encryptSHA(result.owner);

                res.status(200).json(result);
            } catch(err) {
                res.send(err.message);
            }
            
        });

        app.put('/restaurant/:id', async (req: Request, res: Response) => {
            try {
                const result = await this.controllerRestaurant.update(req.params.id, req.body);
                return res.status(200).json(result);                    
            } catch(err) {
                res.send(err.message);
            }
        });

        app.delete('/restaurant/:id', async (req: Request, res: Response) => {
            try {
                const result = await this.controllerRestaurant.delete(req.params.id);
                return res.status(200).json(result);                    
            } catch(err) {
                res.send(err.message);
            }
        });

        app.get('/sort-restaurant/', async (req: Request, res: Response) => {
            try {
                const result = await this.controllerRestaurant.sort();
                res.render('restaurantSortList', { restaurantSortList: result});                    
            } catch(err) {
                res.send(err.message);
            }
        });

        app.get('/search-restaurant', async (req: Request, res: Response) => {
            try {
                const name: string = req.query.name;
                const result = await this.controllerRestaurant.searchRestaurant(name);
                //res.render('restaurantList', { restaurantList: result});
                return res.status(200).json(result);
            } catch(err) {
                res.send(err.message);
            }
        });



        // Menus
        app.get('/res-menu/:menuId', async (req: Request, res: Response) => {
            try {
                const result = await this.controllerMenu.readMenu(req.params.menuId);
                return res.status(200).json(result); 
            } catch(err) {
                res.send(err.message);
            }
        });

        app.get('/res-menu/', async (req: Request, res: Response) => {
            try {
                const result = await this.controllerMenu.readAllMenus();
                return res.status(200).json(result); 
            } catch(err) {
                res.send(err.message);
            }
        });

        app.post('/res-menu/:restaurantId', async (req: Request, res: Response) => {
            try {
                const result = await this.controllerMenu.createMenu(req.params.restaurantId, req.body);
                return res.status(200).json(result);
            } catch (err) {
                res.send(err.message);
            }
        });

        app.put('/res-menu/:menuId', async (req: Request, res: Response) => {
            try {
                const result = await this.controllerMenu.updateMenu(req.params.menuId, req.body);
                return res.status(200).json(result);
            } catch (err) {
                res.send(err.message);
            }
        });
        
        app.delete('/res-menu/:menuId', async (req: Request, res: Response) => {
            try {
                const result = await this.controllerMenu.deleteMenu(req.params.menuId);
                return res.status(200).json(result); 
            } catch(err) {
                res.send(err.message);
            }
        });
   }
}

