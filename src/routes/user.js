import express from "express";
const userRoutes = express.Router();
import Users from "../infra/models/user/Users.js";
import mongoose from "mongoose";
import { userValidation } from "../infra/validator/userValidator.js";
import { createUserController } from "../infra/services/controllers/userController.js";

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
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid user ID format'});
        }
        const user = await Users.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

userRoutes.post('/', userValidation, createUserController);

export default userRoutes;