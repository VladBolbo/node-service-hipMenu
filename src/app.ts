import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose'
import * as dotenv from 'dotenv';
import * as path from 'path';
import { Routes } from './routes/routes';
import { errorMiddleware } from './middlawares/error-middleware';
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');

dotenv.config();

export class App {
    public app: express.Application;
    public router: Routes =  new Routes();

    constructor() {
        this.app = express();
        this.config();
        this.router.routes(this.app);
        this.configDatabase();
    }

    private config(): void {
        this.app.set('views', path.join(__dirname, 'views'));
        this.app.set('view engine','pug');
        this.app.use(morgan('dev'));
        this.app.use(errorMiddleware);
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(cookieParser());
        this.app.use(session({
            key: 'user_sid',
            secret: 'somerandonstuffs',
            resave: false,
            saveUninitialized: false,
            cookie: {
                expires: 600000
            }
        }));
        this.app.use((req, res, next) => {
            if (req.cookies.user_sid && !(<any>req).session.user) {
                res.clearCookie('user_sid');        
            }
            next();
        });
        // this.app.use(function (req, res, next) {
        //     res.status(404).send("Sorry can't find that!")
        //   });
    }

    public configDatabase() {
        //use promise db
        (<any>mongoose).Promise = global.Promise;
        mongoose.connect(<string>process.env.DB_MONGO, { useNewUrlParser: true }, err => {
            if (err) {
                throw new Error(err.message);
            }
            console.log('Connected to MongoDB...')
        });
    }
}