import mongoose from "mongoose";

export interface IUserDocument extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;

}

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 2048
    },
    isAdmin: {
        type: Boolean,
        required: true,
    },
    profileImage: {
        type: String,       
        default : "http://localhost:5000/profile.jpeg" 
    }
});


const user = mongoose.model<IUserDocument>("User", UserSchema);

export default user;