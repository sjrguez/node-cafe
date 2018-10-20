const express = require('express');
let Usuario = require("../models/usuarios")
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken')



const app = express();

app.post("/login", (req, res) => {

    let body = req.body


    Usuario.findOne({ email: body.email }, (error, usuarioDB) => {

        if (error) {
            return res.status(500).json({
                ok: false,
                error
            })
        }
        if (!usuarioDB) {
            return res.status(500).json({
                ok: false,
                error: {
                    message: "(Usuario) o contrasena incorrecto"
                }
            })
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(500).json({
                ok: false,
                error: {
                    message: "Usuario o (contrasena) incorrecto"
                }
            })
        }

        let token = jwt.sign({
            usuario: usuarioDB,
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })


        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })

    })


})









module.exports = app