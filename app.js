const express = require('express')
const server = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const fetch = require('node-fetch')
require('dotenv/config')

server.listen(5000,()=> console.log('servidor iniciado...'))

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
server.put('/diasferiados/:id',(req,res)=>{
    const{id} = req.params
    const {motivo,tipo,info} = req.body
    console.log(motivo,tipo,info)
    Feriados.findOne({_id: id}).then((resultado)=>{
        resultado.motivo= motivo
        resultado.tipo = tipo
        resultado.info = info
        resultado.save()
        res.json(resultado)
    })
})

server.delete('/diasferiados/:id',(req,res)=>{
    const {id} = req.params
    Feriados.deleteOne({_id: id}).then((resultado)=>{
        res.status(204).json()
    })
})

//Errores genericos de Express
server.use((err,req,res,next)=>{
    if(!err) return next();
    console.log('Error, algo salio mal', err);
    res.status(500).send('Error');
})