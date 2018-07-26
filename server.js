const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const apiRoutes = require('./src/routes');
const welcomeMessage = require('./src/resources/welcome');

const app = express();

const port = process.env.PORT;

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));

// use morgan to log requests to the console
app.use(morgan('dev'));

app.get('/', (req, res) => res.json({message: welcomeMessage}));
app.use('/api/', apiRoutes);

app.listen(port);
console.log(`App Runs on ${port}`);
