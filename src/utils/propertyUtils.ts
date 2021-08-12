import { IReview } from "../models/property";
import User from "../models/user";


async function AddUserIntoToReview (review: IReview){
    const user = await User.findById(review.user);
    if(!user){
        throw new Error("not deleted message when deleting user account");
    }
    review.user = user;
    return review;
}

export async function fillUsersInReviewes(reviewes : Array<IReview>){
    return Promise.all(reviewes.map(review => AddUserIntoToReview(review)))
};