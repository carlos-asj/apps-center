import express from "express";
const router = express.Router();
import Users from "../../infra/models/user/Users.js"

router.get('/', async (req, res) => {
    try {
        const allUsers = await Users.find();
        res.json(allUsers)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
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

export default router;