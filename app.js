var express = require('express');
var path = require('path');
var expressValidator = require('express-validator');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var flash = require('connect-flash');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

//view Engine

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

//set static folder
app.use(express.static(path.join(__dirname,'public')));
app.use('/css',express.static(__dirname+'/node_modules/bootstrap/dist/css'));
//bodyparser

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

 

 app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  
}));

app.use(passport.initialize());
app.use(passport.session());
//const express = require('express');
//const app = express();

// app.use(express.json());
// app.post('/user', (req, res) => {
//   User.create({
//     username: req.body.username,
//     password: req.body.password
//   }).then(user => res.json(user));
// });

//Express validator Middleware
//app.use(expressValidator());

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
//connect flash middleware

app.get('*',function(req,res,next){
  res.locals.user = req.user||null;
  next();
});

app.use(flash());
app.use(function (req, res, next) {   res.locals.messages = require('express-messages')(req, res);   next(); });

app.use('/',routes);
 app.use('/users',users);
app.listen(3000);
console.log('Server started on port 3000');   //// Misss Sullivan had never heard of of of the vook in which it was polished with the  hkjhkjhkjhkj'jhgkjhkjkj1`