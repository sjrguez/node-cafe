// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;




// ============================
//  Entornoo
// ============================

process.env.NODE_ENV = process.env.NODE_ENV || "dev"

// ============================
//  Vencimiento del Token
// ============================

//60 segundos
//60 minutos
//24 horas
//30 dias


process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30

// ============================
//  SEED de autentificacion
// ============================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'


// ============================
//  Base de datos
// ============================

let urlDB


if (process.env.NODE_ENV == "dev") {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URI
}


process.env.URLDB = urlDB


// ============================
//  Google Client_ID
// ============================


process.env.CLIENT_ID = process.env.CLIENT_ID || '909365025463-gnr3crbfd1lc640k4fa4fp36klojc02j.apps.googleusercontent.com'