let mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;
let rolesValidator = {
    values: ["ADMIN_ROLE", "USER_ROLE"],
    messaje: "{value} no es un rol valido"
}

let usuarioSchema = new Schema({
    nombre: { type: String, required: [true, "El nombre es necesario"] },
    email: { type: String, unique: true, required: [true, "El correo es requerido"] },
    password: { type: String, required: [true, "El password es necesario"] },
    img: { type: String },
    role: { type: String, default: "USER_ROLE", enum: rolesValidator },
    estado: { type: Boolean, default: true },
    google: { type: Boolean, default: false }
})

usuarioSchema.methods.toJSON = function() {
    user = this
    userObj = user.toObject();
    delete userObj.password
    return userObj
}
usuarioSchema.plugin(uniqueValidator, { messaje: '{PATH} debe ser unico' })

module.exports = mongoose.model("Usuario", usuarioSchema)