const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'variables.env'});
const { validationResult } = require('express-validator');

exports.autenticarUsuario = async (req, res, next)=> {

     //Mostrar mensajes de error de express validator
     const errores = validationResult(req);
     if (!errores.isEmpty()) {
         return res.status(400).json({ errores: errores.array() });
     }

    //Buscar si el usuario existe
    const {email, password} = req.body;
    const usuario = await Usuario.findOne({email});
    
    if(!usuario) {
        res.status(401).json({msg: 'El usuario no existe'});
        return next();S
    }

    //Verificar el password y autenticar el usuario 
    if(bcrypt.compareSync(password, usuario.password)){
        //Crear JWT
        const token = jwt.sign({
            id: usuario._id,
            email: usuario.email,
            nombre: usuario.nombre,
        }, process.env.SECRETA, {
            expiresIn: '4h'
        });

        res.json({token});

    }else {
        res.status(401).json({msg: 'Password incorrecto'});
        return next();
    }

}

exports.usuarioAuntenticado = (req, res, next) => {
    res.json({usuario: req.usuario});
}