const { Router } = require('express');
const bcrypt = require('bcrypt');
const router = Router(); // objeto para poder definir  url
const User = require('../models/User'); // modelo usuario
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => res.send('Hello word'));
router.post('/signup', (req, res) => {

    let newuser = new User(req.body);
    //guardo con el metodo save el nuevo usuario
    
    

    newuser.save().then(user =>{
        payload = { //se debe meter fecha de entrega
            email: user.email,
            name: user.name,
            _id: user._id
        }


        const token = jwt.sign(payload, 'secretkey'); // aca se deberia de poner la duración del token y demas
        res.status(201).send({user , token})

    } ).catch(error => res.status(500).send({message: "User alredy in db",error}));

});

router.post('/signin', (req, res) => {

    let email = req.body.email;
    let password = req.body.password;

    User.findOne({ email }).then(user => { // se puede solo username
        if (!user) res.status(404).send({ message: "El email no existe" });
        console.log(user);
        //si existe, hago mi logica de login
        bcrypt.compare(password, user.password)
            .then(match => {
                if (match) {
                    payload = { //se debe meter fecha de entrega
                        _id: user._id,
                        email: user.email,
                        name: user.name
                    }
                    //acceso con web token npm i jsonwebtoken
                    jwt.sign(payload,'secretkey' , function (error, token) {
                        if (error) {
                            res.status(500).send({ error });
                        } else {
                            res.status(200).send({ message: "accedido", token });
                        }
                    });

                } else {
                    res.status(200).send({ message: "Password mala" });//no doy acceso
                }

            }).catch(error => { //se le envia tambien el status para mejorar practicas
                console.log(error);
                res.status(500).send({ error });
            });
    }).catch(error => { //este error no es si no existe el username en la db
        console.log(error);
        res.status(500).send({ error });
    });

});

    

router.get('/tasks', (req, res) => {
    res.json([{
            _id: 1, // datos publicos 
            name: 'Task one',
            description: 'lorem ipsum',
            date: "2020-10-25T01:43:19.346Z"
        },
        {
            _id: 2,
            name: 'Task two',
            description: 'lorem ipsum',
            date: "2020-10-25T01:43:19.346Z"
        },
        {
            _id: 3,
            name: 'Task three',
            description: 'lorem ipsum',
            date: "2020-10-25T01:43:19.346Z"
        }
    ]);
});

router.get('/private-tasks', verifyToken, (req, res) => {
    res.json([{
            _id: 1, // datos publicos 
            name: 'Task one',
            description: 'lorem ipsum',
            date: "2020-10-25T01:43:19.346Z"
        },
        {
            _id: 2,
            name: 'Task two',
            description: 'lorem ipsum',
            date: "2020-10-25T01:43:19.346Z"
        },
        {
            _id: 3,
            name: 'Task three',
            description: 'lorem ipsum',
            date: "2020-10-25T01:43:19.346Z"
        }
    ]);

});

router.get('/profile', verifyToken, (req, res) => {
    res.send(req.userId);
});

module.exports = router;
// funcion que se encarga de verificar que esta logeado
function verifyToken(req, res, next) {
    //console.log(req.headers.authorization);
    if (!req.headers.authorization) {
        return res.status(401).send('anuthorize Request');
    }
    const token = req.headers.authorization.split(' ')[1]; // para separar el token de bearer, toma solo el token
    if (token === 'null') {
        return res.status(401).send('Unthorize Request');
    }
    const payload = jwt.verify(token, 'secretkey'); // como el id del usuario
    req.userId = payload._id;
    next();
}