import mongoose, { mongo, Schema } from "mongoose";

export interface IAdDocument extends mongoose.Document {
    propertyId: string;
    startDate: Date;
    endDate: Date;
}

const AdSchema = new mongoose.Schema({
    propertyId: {
        type: Schema.Types.ObjectId,
        refs: 'Property',
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    }
});

const ad = mongoose.model<IAdDocument>("Ad", AdSchema);

export default ad;