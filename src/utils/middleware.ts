import { NextFunction, Request, Response } from 'express';
import * as crypto from 'crypto';

class Crypto {

    public encryptMD5(text: string): string {
        return crypto.createHash('md5').update(text).digest("hex");
    }

    public encryptSHA1(text: string): string {
        return crypto.createHash('sha1').update(text).digest("hex");
    }
}

export const encryptMiddleware =  function encrypt(req: Request, res: Response, next: NextFunction): void {
    const cript: Crypto = new Crypto();
    if(req.body.owner) {
        req.body.owner = cript.encryptMD5(req.body.name);
    }
    next();
}

