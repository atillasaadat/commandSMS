var express = require('express'),
  session = require('express-session'),
  path = require('path'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  favicon = require('serve-favicon'),
  config = require('./config/default'),
  hbs = require('hbs');

var app = express(),
  server = require('http').createServer(app);

app.set('port', config['server'].port);
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon('./public/images/favicon.png'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs')
app.set('view options', {
  layout: '/layouts/default.hbs'
});

// var models = require('./models');
// var SequelizeStore = require('connect-session-sequelize')(session.Store);
// app.use(session({
//   secret: 'someCoolSecret',
//   store: new SequelizeStore({
//     db: models.sequelize,
//     checkExpirationInterval: 15 * 60 * 1000,
//     expiration: 24 * 60 * 60 * 1000 * 365
//   }),
//   cookie: { maxAge: 24 * 60 * 60 * 1000 * 365 },
//   resave: false,
//   saveUninitialized: true
// }));

var index = require('./routes/index.js');
app.use('/', index);

server.listen(app.get('port'), function() {
  console.log('Web app is operating on port ' + app.get('port'));
});
