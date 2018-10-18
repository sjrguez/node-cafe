// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;




// ============================
//  Entornoo
// ============================

process.env.NODE_ENV = process.env.NODE_ENV || "dev"



// ============================
//  Entornoo
// ============================

let urlDB


if (process.env.NODE_ENV == "dev") {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = 'mongodb://cafe-user:123456s@ds121456.mlab.com:21456/cafe'
}


process.env.URLDB = urlDB