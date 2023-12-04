const usersService = require('../services/usersService');
const { validationResult } = require('express-validator');

async function getAllUsers(req, res) {
    try {
        const users = await usersService.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error('Error', error);
        res.status(500).json({ error: 'Internal Error' });
    }
}

async function createUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newUser = req.body;
        await usersService.createUser(newUser);
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error para crear el user:', error);
        res.status(500).json({ error: 'Internal Error' });
    }
}

module.exports = {
    getAllUsers,
    createUser,
};
