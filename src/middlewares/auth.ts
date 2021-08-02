import {
    Router,
    NextFunction
} from "express";
import {
    get
} from "lodash";
import jwt from "jsonwebtoken";
import ErrorMessage from "../models/errorMessage";
import express, {
    Request,
    Response
} from 'express';

export default function (req: Request, res: Response, next: NextFunction) {    
    let token = get(req, "headers.authorization", "");
    try {
        token = token.split(" ")[1];    
        if (!token) return res.status(404).send(new ErrorMessage('User not found'));
        const decoded = jwt.verify(token, process.env.jwtPrivateKey as string);        
        // @ts-ignore
        req.user = decoded;
        next();
    } catch (ex) {
        res.sendStatus(400).send('Invalid token.');
    }    
}