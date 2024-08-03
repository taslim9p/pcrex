import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";

export const verifyMail = async (req, res) => {
    console.log("hgh");
    try {
        const userId = req.query.id;

        if (!userId) {
            return res.status(400).send({ error: 'User ID is required' });
        }

        const isValidObjectId = mongoose.Types.ObjectId.isValid(userId);
        if (!isValidObjectId) {
            return res.status(400).send({ error: 'Invalid user ID' });
        }

        const updateInfo = await userModel.updateOne(
            { _id: userId },
            { $set: { isVerified: 1 } }
        );

        // Check if any document was matched and modified
        if (updateInfo.matchedCount === 0) {
            return res.status(404).send({ message: 'User not found' });
        }

        if (updateInfo.modifiedCount === 0) {
            return res.status(400).send({ message: 'User already verified or no changes made' });
        }

        res.send({ message: 'Email successfully verified' });
    } catch (error) {
        console.error('Error during email verification:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
};
