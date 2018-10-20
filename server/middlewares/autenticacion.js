const jwt = require('jsonwebtoken')


// ==========================
// Verificar Token
// ==========================

let verificarToken = (req, res, next) => {

    let token = req.get("token")


    jwt.verify(token, process.env.SEED, (error, decoded) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            })
        }

        req.usuario = decoded.usuario
        next()
    })

}



// ==========================
// Verifica AdminROLE
// ==========================


let verificarAdmin_Role = (req, res, next) => {
    let usuario = req.usuario



    // console.log(usuario);

    if (usuario.role == "ADMIN_ROLE") {
        next()
    } else {
        return res.status(400).json({
            ok: false,
            error: {
                message: "Usuario no tiene permiso"
            }
        })
    }



}



module.exports = {
    verificarToken,
    verificarAdmin_Role
}