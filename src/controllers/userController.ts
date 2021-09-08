import mongoose from "mongoose";
import User, { IUserDocument } from "../models/user";
import Property, { IProperty } from "../models/property";
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
    const user = await User.findById(req.user.id).populate('posts').select('-password');    
    if (!user) return res.status(404).send(new ErrorMessage('User not found'));
    res.status(200).send(_.omit(user,["password"]));    
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
    res.status(201).send(_.omit(user, ['password']));
}

const uploadPhoto = async (req: any, res: Response) => {           
    if(!req.file) return res.status(400).send(new Error("File image is required"));    
    // @ts-ignore 
    const user = await User.findByIdAndUpdate(req.user.id,{
        profileImage: "http://localhost:5000/" + req.file.path.substring(8,req.file.path.length),
    });    
    return res.status(200).send(_.omit(user, ['password','isAdmin']));
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

const getPosts = async (req: any, res: Response) => {    
    const user = await User.findById(req.user.id).select('posts');    
    if (!user) return res.status(404).send(new ErrorMessage('User not found'));
    res.status(200).send(user);    
}

const addWishlist = async (req: any, res: Response) => {
    const { propertyId } = req.body
    if(!propertyId) return res.status(400).send(new ErrorMessage("Posted property identifier is required!"));

    let property = await Property.findById(propertyId);
    if(!property) return res.status(404).send(new ErrorMessage("No property found with given id!"));

    if(property.ownerid != req.user.id) return res.status(400).send(new ErrorMessage("Property does'nt belong to this user!"));

    try {
        const updatedUser = await User.findOneAndUpdate({"email": req.user.email}, { $push: { wishlists: propertyId } }, {new: true});
        return res.status(200).send(updatedUser);
    } 
    catch(e) {
        // @ts-ignore
        return res.status(400).send(e.message);
    }
}

const getWishlists = async (req: any, res: Response) => {    
    const user = await User.findById(req.user.id).select('wishlists');    
    if (!user) return res.status(404).send(new ErrorMessage('User not found'));
    res.status(200).send(user);    
}

const UserController = {
    myInfo,
    createUser,
    updateUser,
    uploadPhoto,
    getPosts,
    addWishlist,
    getWishlists,
}

export default UserController;