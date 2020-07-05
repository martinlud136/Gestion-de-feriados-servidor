const express = require('express')
const server = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const fetch = require('node-fetch')
const jwt = require('jsonwebtoken')
require('dotenv/config')

const sign = process.env.firma

server.listen(5000,()=> console.log('servidor iniciado...'))

const ferConnect = mongoose.createConnection(process.env.dbConection,
{ useUnifiedTopology: true, useNewUrlParser: true },
()=>console.log('connect to db...'))

const userConnect = mongoose.createConnection(process.env.dbConectionUser,
    { useUnifiedTopology: true, useNewUrlParser: true },
    ()=>console.log('connect to dbUser...'))

server.use(cors())
server.use(bodyParser.json())

const Feriados = ferConnect.model('Feriados',{
    "motivo": String,
    "tipo": String,
    "info": String,
    "dia": Number,
    "mes": Number,
    "id": String    
  })


const Usuarios = userConnect.model('Usuarios',{
    "usuario": String,
    "contrasena": String,
    "es_admin": Boolean
})

// Obtener el listado de feriados anual
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
                  res.json(data)
                }
              });
            })
        }
        res.json(resultado)
    })

})

//obtener un feriado por id
server.get('/diasferiados/:id',(req,res)=>{
    const{id} = req.params

    Feriados.find({_id: id}).then((resultado)=>{
        if(resultado.length === 0 || undefined){
            res.status(404).json({'Error': 'Feriado Inexistente'})
        }
        res.json(resultado)
    })
})
// modificar un feriado
server.put('/diasferiados/:id',validarAdmin,(req,res)=>{
    const{id} = req.params
    const {motivo,tipo,info} = req.body
    Feriados.findOne({_id: id}).then((resultado)=>{
        resultado.motivo= motivo
        resultado.tipo = tipo
        resultado.info = info
        resultado.save()
        res.json(resultado)
    })
})
//Eliminar un feriado
server.delete('/diasferiados/:id',validarAdmin,(req,res)=>{
    const {id} = req.params
    Feriados.deleteOne({_id: id}).then((resultado)=>{
        res.status(204).json()
    })
})

//Crear un feriado
server.post('/diasferiados',validarAdmin, (req,res)=>{
    const datos = req.body;
    const nuevoiferiado = new Feriados(datos);
    nuevoiferiado.save({new:true}).then((feriado)=>{
        res.status(201);
        res.json(feriado);
    });

})

//login admin
server.post('/login', (req,res)=>{
    const {usuario, contrasena} = req.body
    try{
        Usuarios.find({usuario,contrasena}).then((resultado)=>{
            console.log('resultado: ',resultado)
            if(resultado.length === 0 || undefined){
                res.status(404).json({'Error': 'Usuario o contraseña incorrectos'})
            }else{
                let token = jwt.sign({ usuario: resultado[0].usuario, es_admin: resultado[0].es_admin}, sign);
                return res.status(200).json({token})
            }
        })
        }catch(e){
            res.status(500).json({msj: 'Error del servidor'}).end()
        }
})

function validarAdmin(req,res,next) {
    try {

        const token = req.headers.authorization.split(' ')[1];
        let decode = jwt.verify(token, sign);
        if(decode.es_admin === true){
            req.usuario = decode;
            next();
        }else{
            throw "Usuario no autorizado";
        }
    } catch (error) {
        res.status(401).json({msj: 'Error en la autenticación'})
    }
}

//Errores genericos de Express
server.use((err,req,res,next)=>{
    if(!err) return next();
    console.log('Error, algo salio mal', err);
    res.status(500).send('Error');
})