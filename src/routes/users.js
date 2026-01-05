import express from "express";
const userRoutes = express.Router();
import Users from "../infra/models/user/Users.js"

userRoutes.get('/', async (req, res) => {
    try {
        const allUsers = await Users.find();
        res.json(allUsers)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

userRoutes.get('/:id', async (req, res) => {
    try {
        const user = await Users.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default userRoutes;