import mongoose, { Schema } from "mongoose";
import { IUserDocument } from "./user";

export interface IProperty extends mongoose.Document {
    title: string;
    ownerid: string,
    owner: Object,
    category: string;
    description: string;
    images: Array < string > ;
    location: string,
    status: boolean,
    reviewes: Array<IReview>,
    rating: number,    
    cost : ICost,
    likedBy: Array < string > ,
    createdAt: Date;
}

export interface IReview {
    user: any,
    message: string,
    rating: number,        
}

export interface ICost {
    bill: {
        type: Number,
        required: true,
    }
    per: {
        type: string,
        required: true,
    },
}

const PropertySchema = new mongoose.Schema({
    title: {
        type: String,
        text: true,
        required: true,
        minlength: 5,
        maxlength: 250
    },    
    description: {
        type: String,
        text: true,
        required: true,
        minlength: 5,
        maxlength: 2048
    },
    ownerid: {
        type: String,
        required: true,
    },
    owner: Object,
    cost : {
        type: Object,
        required: true,
    },
    category: {
        type: String,
        text: true,
        required: true,
        minlength: 5,
        maxlength: 50,
    },    
    images: {
        type: Array,
    },
    location: {
        text: true,
        type: String,
    },
    status: {
        type: Boolean,
        required: true,
        default: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    reviewes: {
        type: Array,
        default: [],
    },
    likedBy: Array,    
}, {
    timestamps: {
        createdAt: 'createdAt',        
    }
});


PropertySchema.index({title: "text",location: "text",category: "text",description: "text"});

const user = mongoose.model < IProperty > ("Property", PropertySchema);

export default user;