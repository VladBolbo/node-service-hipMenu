import { NextFunction, Request, Response } from 'express';

export const errorMiddleware = function(err: Error, req: Request, res: Response, next: NextFunction): void {
    if(err){
        res.status(500).send(err.stack);
        //next(err);
    } 
  };

