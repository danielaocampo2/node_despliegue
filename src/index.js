const express = require('express');
const app = express();

require('dotenv').config({ path: '../variable.env' });

const cors = require('cors');
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;
require('./database');
app.use(cors()); // agrega cabecera a la petecion para poder ser pasados a esta peticion
app.use(express.json()); // convierte los datos que recibe el js a un formato que pueda modificar
app.use('/api', require('./routes/index'));
//app.set('port',process.env.PORT || 3000);
app.listen(port, host, () => {
    console.log('El servidor esta funcionando');
}); // 3000
//console.log('server on port', 3000);