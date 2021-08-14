import mongoose from "mongoose";
import User from "../models/user";
import ErrorMessage from "../models/errorMessage";
import {
    Request,
    Response
} from "express";

import config from "config";
import _ from "lodash";
import bcrypt from "bcrypt";
import {
    generateAuthToken
} from "../utils/authUtils";



const myInfo = async (req: any, res: Response) => {    
    const user = await User.findById(req.user.id).select('-password');    
    if (!user) return res.status(404).send(new ErrorMessage('User not found'));
    res.status(200).send(user);    
}

const createUser = async (req: Request, res: Response) => {
    let user = await User.findOne({
        email: req.body.email
    });
    if (user) return res.status(400).send(new ErrorMessage('User already registered.'));
    try{
        user = new User(_.pick(req.body, ['name', 'email', 'password']));
        user.isAdmin = false;
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
    }
    catch(e){
        // @ts-ignore
        return res.status(400).send(e.message);
    }

    const token = generateAuthToken(user._id, user.isAdmin);
    res.send(_.pick(user, ['_id', 'name', 'email']));
}

const updateUser = async (req: any, res: Response) => {
    let user = await User.findById(req.user.id);
    if (!user) return res.status(400).send(new ErrorMessage("User doesn't exist"));
    try {
        if (req.body.isAdmin) {
            return res.status(403).send(new ErrorMessage("This operation requires higher privelege"));
        }
        const updatedUser = await User.findOneAndUpdate({"email": user.email}, req.body, {new: true});
        return res.status(200).send(updatedUser);
    } 
    catch(e) {
        // @ts-ignore
        return res.status(400).send(e.message);
    }

}

const UserController = {
    myInfo,
    createUser,
    updateUser,
}

export default UserController;