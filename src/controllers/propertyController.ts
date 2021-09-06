import mongoose from "mongoose";
import Property, { IProperty, IReview } from "../models/property";
import User, {IUserDocument} from "../models/user";
import ErrorMessage from "../models/errorMessage";
import {
    Request,
    Response
} from "express";

import _, { result } from "lodash";
import {fillOwnersInProperties, fillUsersInReviewes, getOwner} from "../utils/propertyUtils";
import { getImageUrl } from "../utils/uploadUtils";


const getProperty = async (req: any, res: Response) => {    
    const property = await Property.findById(req.params.id);
    if(!property){
        return res.status(404).send(new ErrorMessage('no property with that id'));
    }
    property.reviewes = await fillUsersInReviewes(property.reviewes);
    property.owner = await getOwner(property.ownerid);    
    return res.status(200).send(property);
}


//to be improved by naty with filtering and pagination
const getProperties = async (req: any, res: Response) => {    
    const properties = await Property.find({});
    const filledProperties = await fillOwnersInProperties(properties);
    return res.status(200).send(filledProperties);
}


const searchProperties = async(req: Request, res:Response) => {    
    const limitParam = req.query.limit;

    if(limitParam && isNaN(+limitParam)){
        return res.status(400).send("Invalid value for limit");
    }

    const limit:number = Number(limitParam);
    const keyword = req.query.keyword?.toString();    

    if(!keyword){
        return res.status(200).send([]);
    };

    const results = await Property.find(
        {
            $text: {$search: keyword},                        
        },          
    ).limit(limit);
    return res.status(200).send(results);
}

const addProperty = async (req: any, res: Response) => {    
    const property:  IProperty = new Property(req.body);
    try{
        property.ownerid = req.user.id;
        //@ts-ignore
        property.images = req.files.map(file => getImageUrl(file));            
        await property.save();

        await User.findOneAndUpdate({"email": req.user.email}, { $push: { posts: property.id } }, {new: true});

        return res.status(201).send(property);
    }
    catch(e){
        //@ts-ignore
        return res.status(400).send(new ErrorMessage(e.message));
    }
}

const updateProperty = async (req: any, res: Response) => {    
    try{
        const property = await Property.findById(req.params.id);            
        if(!property){
            return res.status(404).send(new ErrorMessage("property not found"));
        }
        if(property.owner != req.user.id){
            return res.status(403).send(new ErrorMessage("Current user can't update this property"));
        }        
        const newProperty = await Property.findByIdAndUpdate(req.params.id, req.body, {new : true});            
        return res.status(200).send(newProperty);                    
    }
    catch(e){
        //@ts-ignore
        return res.send(400).send(new ErrorMessage(e.message));
    }    
}

const reviewProperty =  async (req: any, res: Response) => {    
    try{        
        let property = await Property.findById(req.params.id);            
        if(!property){
            return res.status(404).send(new ErrorMessage("property not found"));
        }        
        
        let hasUserAlreadyReviewed = property.reviewes.filter(review => review.user == req.user.id);
        
        if(hasUserAlreadyReviewed.length > 0){
            return res.status(400).send(new ErrorMessage("user has already reviewed the property"));
        }

        if(!(req.body.message && req.body.rating)){
            return res.status(400).send(new ErrorMessage("message and rating are required"));
        }

        //updating the rating using the mean method
        const totalRating = property.rating * property.reviewes.length;
        const newRating = (totalRating + req.body.rating) / (property.reviewes.length  + 1);

        const newReview : IReview = {
            user: req.user.id,
            message:req.body.message,
            rating: req.body.rating
        };

        property.reviewes.push(newReview);
        property.rating = newRating;
        await property.save();
        return res.status(200).send(property.reviewes);                                        
    }
    catch(e){
        //@ts-ignore
        return res.status(400).send(new ErrorMessage(e.message));
    }    
}

const likeProperty = async (req: any, res: Response) => {    
    try{
        let property = await Property.findById(req.params.id);            
        if(!property){
            return res.status(404).send(new ErrorMessage("property not found"));
        }                
        //adding the current item to list of properties liked by the user
        let user = await User.findById(req.user.id);
        user?.likedProperties.push(property.id);

        //adding the current user to users who liked the property
        //can be removed later if the number of users only is required
        property.likedBy.push(req.user.id);
        
        await property.save();
        await user?.save();
        return res.status(200).send({
            "likeCount" : property.likedBy.length
        });
    }
    catch(e){
        //@ts-ignore
        return res.status(400).send(new ErrorMessage(e.message));
    }
}



const PropertyController = {
    addProperty,
    updateProperty,
    reviewProperty,
    likeProperty,
    getProperties,
    getProperty,
    searchProperties
}

export default PropertyController;