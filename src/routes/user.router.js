import express from 'express'


const router = express.Router()

import usuario from '../models/User.js'


import passport from 'passport'

const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');


module.exports = router;


router.post('/register', passport.authenticate('register', { failureRedirect: '/failregister' }), async (req, res) => {
    res.send({ status: "success", message: "usuario registrado" })
})

router.get('failregister', async (req, res) => {
    console.log("Falla de registro")
    res.send({ error: "Falló" })
})

router.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), async (req, res) => {
    if (!req.user) return res.status(400).send({ status: "error", error: "Credencial invalida" })
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    }

    res.send({ status: "success", payload: req.user })

})

router.get("/faillogin", (req, res) => {
    res.send({ error: "Login fallido" })
})


export default router