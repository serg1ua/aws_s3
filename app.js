const path = require('path');
const express = require('express');
const app = express();
const logger = require('morgan');
const fileUpload = require('express-fileupload');
const expressEdge = require('express-edge');
const edge = require('edge.js');
require('dotenv').config();
const log4js = require('log4js');
const log = log4js.getLogger();
log.level = 'debug';

const PORT = process.env.PORT || 3000;

const indexRouter = require('./routes');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', edge);

app.use(logger('dev'));
app.use(expressEdge);
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

app.use('/', indexRouter);

app.use(function (req, res, next) {
  res.status(404).render('error', {
    error: {
      message: "This page does not exist"
    }
  });
});

app.listen(PORT, () => {
  log.info('Your app is listening on port ' + PORT);
});