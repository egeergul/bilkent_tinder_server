import jwt from "jsonwebtoken";
import { getToken, isReqBodyEmpty } from "../helpers/api_helpers.js";
import User from "../models/user_model.js"



/**
 * @param {*} req
 * @param {*} res 
 * @returns if the request body is empty, returns the logged in user by looking at the
 * Bearer Token; if the request body contains a user id, returns it instead
 */
export const getUser = async (req, res) => {
    let userId;
    if( !isReqBodyEmpty(req)) {
        // Return a user whose userId is specified in the req.body 
        userId = req.body.userId;
    } else {
        // Return the logged in user (looks at the Bearer Token)
        const token = getToken(req);
        const jwt_secret = process.env.JWT_SECRET || "test";  
        const decodedData = jwt.verify( token, jwt_secret);
        userId = decodedData.id;
    }
   
    try  {
        var user = await User.findById(userId);
        return res.status(200).json(user)
    } catch (err) {
        res.status(500).json({error: `Item from user id ${userId} not found.`});
    }
}
