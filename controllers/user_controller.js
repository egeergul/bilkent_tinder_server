import jwt from "jsonwebtoken";
import { getToken } from "../helpers/api_helpers.js";
import User from "../models/user_model.js"

// This function is called with the endpoint '/user/other' 
// and required a userId in its body
export const getOtherUser = async (req, res) => {
    const {userId} = req.body;

    try  {
        var user = await User.findById(userId);
        return res.status(200).json(user)
    } catch (err) {
        res.status(500).json({message: `Item from user id ${userId} not found.`});
    }
}

// This function is called with the endpoint '/user/me' 
// and it returns the user that is logged in (decides the
// logged in user by looking at the bearer token)
export const getLoggedInUser = async (req, res) => {
    const token = getToken(req);

    const jwt_secret = process.env.JWT_SECRET || "test";  
    const decodedData = jwt.verify( token, jwt_secret);

    try  {
        var user = await User.findById(decodedData.id);
        return res.status(200).json(user)
    } catch (err) {
        res.status(500).json({error: `Item from user id ${decodedData.id} not found.`});
    }
}
