import User from "../models/user_model.js"

export const getUser = async (req, res) => {
    const {userId} = req.body;

    try  {
        var user = await User.findById(userId);
        return res.status(200).json(user)
    } catch (err) {
        res.status(500).json({message: `Item from user id ${userId} not found.`});
    }
}
