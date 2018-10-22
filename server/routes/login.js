const express = require('express');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken')


const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);



let Usuario = require("../models/usuarios")
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

// Configuracion de google


async function verify(token) {


    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload()
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.img,
        google: true
    }

}

app.post("/google", async(req, res) => {

    let token = req.body
    let googleUser = await verify(token.idtoken)
        .catch(error => {
            return res.status(403).json({
                ok: false,
                error
            })
        })

    Usuario.findOne({ email: googleUser.email }, (error, usuarioDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            })
        }
        if (usuarioDB) {
            if (!usuarioDB.google) {
                return res.status(500).json({
                    ok: false,
                    error: {
                        message: "Debe autentificarse normal"
                    }
                })
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB,
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })

                return res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })

            }
        } else {
            // Si no existe el usuario
            let usuario = new Usuario({
                nombre: googleUser.nombre,
                email: googleUser.email,
                img: googleUser.img,
                google: true,
                password: ":)",
            })

            usuario.save((error, usuarioSave) => {

                if (error) {
                    return res.status(500).json({
                        ok: false,
                        error
                    })
                }

                let token = jwt.sign({
                    usuario: usuarioSave,
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })

                return res.status(200).json({
                    ok: true,
                    usuario: usuarioSave,
                    token
                })
            })
        }


    })

})









module.exports = app