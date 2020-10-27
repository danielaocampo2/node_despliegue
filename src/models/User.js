// Estructura de la base de datos 
const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    id_user:{
        type:String,
        required: true,
        unique: true
    },
    email:{
        type:String,
        unique:true,
        required: true
    },
    password:{
        type:String,
        required:true
    },
    last_login_date:{
        type:Date,
        default: Date.now()
    },
    role:{
        type:String,
        default:"regular",
        enum:[
            "regular",
            "admin",
        ]
        }
    
}, {
    timestamps: true // lo de la fecha de creacion
});

// este metodo ejecuta un hook antes de un metodo
userSchema.pre('save', function (next) {
    bcrypt.genSalt(10).then(salts => {
        //me encriptara una cadena de caracteres, me devuelve una promesa con el hash , y ese hash lo guardo
        bcrypt.hash(this.password, salts).then(hash => {
            this.password = hash;
            next();
        }).catch(error => next(error));
    }).catch(error => next(error));
});




module.exports = model('User', userSchema);