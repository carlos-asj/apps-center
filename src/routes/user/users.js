import express from "express";
const router = express.Router();
import Users from "../../infra/models/user/Users.js"

router.get('/users', (req, res) => {
    res.send('Teste')
});

export default router;