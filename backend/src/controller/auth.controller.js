import { User } from "../models/user.model.js";


export const authCallback = async (req, res, next) => {
    try {
        const { id, firstName, lastName, imageUrl} = req.body;

        const user = await User.findOne({clerkId: id});
        
        if (!user) {
            await User.create({
                clerkId: id,
                fullName: `${firstName} ${lastName}`,
                imageUrl
            });
        }
        
        res.status(200).send('User created or updated successfully');
    } catch (error) {
        console.error("Error in auth callback:", error);
        next(error);
    }
}