const express = require('express');
const proxy = require('express-http-proxy');

const app = express();
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
app.use('/api', proxy('https://meps-cors.herokuapp.com/'));

let server = app.listen(5000, () => console.log(`Server Listening on port ${5000}!`));

server.addListener('error', (error) => console.log(error.message))