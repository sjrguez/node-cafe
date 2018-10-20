const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require("underscore")


let Usuario = require("../models/usuarios")
const { verificarToken, verificarAdmin_Role } = require("../middlewares/autenticacion")


app.get('/usuario', verificarToken, (req, res) => {


    let desde = req.query.desde || 0
    desde = Number(desde)

    let limite = req.query.limite || 5
    limite = Number(limite)
    Usuario.find({ estado: true }, "nombre email role google estado img")
        .skip(desde)
        .limit(limite)
        .exec((error, usuarioDB) => {
            if (error) {
                res.status(400).json({
                    ok: false,
                    error
                })
            }

            Usuario.count({ estado: true }, (error, conteo) => {
                res.status(200).json({
                    ok: true,
                    cuantos: conteo,
                    usuarios: usuarioDB
                })
            })
        })
});



app.post('/usuario', [verificarToken, verificarAdmin_Role], (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })
    usuario.save((error, usuarioDB) => {

        if (error) {
            res.status(400).json({
                ok: false,
                error
            })
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioDB
        })
    })
});

app.put('/usuario/:id', [verificarToken, verificarAdmin_Role], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado'])


    Usuario.findByIdAndUpdate(id, body, { new: true }, (error, usuarioDB) => {

        if (error) {
            res.status(400).json({
                ok: false,
                error
            })
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioDB
        });

    })

});

app.delete('/usuario/:id', [verificarToken, verificarAdmin_Role], (req, res) => {

    let id = req.params.id


    // Usuario.findByIdAndRemove(id, (error, usuarioBorrado) => {
    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (error, usuarioBorrado) => {
        if (error) {
            res.status(400).json({
                ok: false,
                error
            })
        }

        if (!usuarioBorrado) {
            res.status(400).json({
                ok: false,
                error: {
                    mensaje: "Usuario no encontrado"
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    })


});



module.exports = app