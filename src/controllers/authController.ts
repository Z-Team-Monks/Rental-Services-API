import mongoose from "mongoose";
import User from "../models/user";
import ErrorMessage from "../models/errorMessage";
import {
    Request,
    Response
} from "express";
import bcrypt from "bcrypt";
import {
    generateAuthToken
} from "../utils/authUtils";

const getToken = async (req : Request, res: Response) => {
    let user = await User.findOne({
        email: req.body.email
    });
    if (!user) return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password.');
    const token = generateAuthToken(user.id, user.isAdmin);
    res.send(token);
}

const AuthController = {
    getToken,
}

export default AuthController;