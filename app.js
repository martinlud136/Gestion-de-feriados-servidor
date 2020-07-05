const express = require('express')
const server = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const fetch = require('node-fetch')
require('dotenv/config')

server.listen(5000,()=> console.log('servidor iniciado...'))

// Replace <password> with the password for the admin user.
// Replace <dbname> with the name of the database that connections will use by default.
// Ensure any option params are URL encoded.

mongoose.connect(process.env.dbConection,
{ useUnifiedTopology: true, useNewUrlParser: true },
()=>console.log('connect to db...'))

server.use(cors())
server.use(bodyParser.json())

const Feriados = mongoose.model('Feriados',{
    "motivo": String,
    "tipo": String,
    "info": String,
    "dia": Number,
    "mes": Number,
    "id": String    
  })

server.get('/usuarios',(req,res)=>{
    Usuario.find().then((resultado)=>{
        res.json(resultado)
    })
})

server.get('/diasferiados',(req,res)=>{

    Feriados.find().then((resultado)=>{

        if(resultado.length === 0){
            fetch("http://nolaborables.com.ar/api/v2/feriados/2020")
        .then(response => response.json())
        .then(data => {
            Feriados.collection.insert(data, function (err, docs) {
                if (err){ 
                    return console.error(err);
                } else {
                  console.log("Multiple documents inserted to Collection");
                  res.json(data)
                }
              });
            })
        }
        res.json(resultado)
    })

})

server.post('/usuarios',(req,res)=>{
    const datos = req.body;

    const nuevoUsuario = new Usuario(datos);
    nuevoUsuario.save({new:true}).then((usuario)=>{
        res.status(201);
        res.json(usuario);
    });

})