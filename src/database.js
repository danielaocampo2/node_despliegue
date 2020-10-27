const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config({ path: '../variable.env' });
console.log("miraaa " + process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })
    .then(db => console.log('Database is Connected'))
    .catch(err => console.log(err));