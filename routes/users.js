var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('passportapp', ['users']);
var bcrypt = require('bcryptjs');
var passport = require('passport');
var Localstrategy = require('passport-local').Strategy;


//login page - get
router.get('/login', function(req,res){
	res.render('login');

});

// Rregister page - get
router.get('/register', function(req,res){
	res.render('register');

});

router.post('/register', function(req,res){
	//console.log('Adding user....');
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	//validation
	req.checkBody('name', 'Name field is Required').notEmpty();
	req.checkBody('email', 'Email field is required').notEmpty();
	req.checkBody('email', 'Please use a valid email address').isEmail();
	req.checkBody('username', 'Username field is required').notEmpty();
	req.checkBody('password', 'Password field is required').notEmpty();
	req.checkBody('password2', 'Password donot match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		console.log('Form has errors...');
		res.render('register', {
			errors: errors,
			name : name,
			email: email,
			username: username,
			password: password,
			password2: password2
		});
	}else{
		//console.log('success...');

		var newUser = {
			name: name,
			email: email,
			username: username,
			password:password
		}

		bcrypt.genSalt(10,function(err,salt){
			bcrypt.hash(newUser.password,salt,function(err,hash){
				newUser.password = hash;

				db.users.insert(newUser,function(err,doc){
			if(err){
				res.send(err);
			}else{
				console.log('User Added....');

				req.flash('success', 'u are a user now');

				res.location('/');
				res.redirect('/');
			}
		});

			});
		});

		
	}
   

});

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
db.users.findOne({_id : mongojs.ObjectId(id)},function(err,user){
	done(err,user);
});
});

passport.use(new Localstrategy(
	function(username,password,done){
		console.log('ok');
		db.users.findOne({username:username},function(err,user){
			if(err){
				console.log('one');
				return done(err); }
			if(!user){console.log(username);
			    return	done(null,false,{message:'incorrect username'});
			}

			bcrypt.compare(password,user.password,function(err,isMatch){
				if(err){
					console.log('three');
					return done(err);
				}
				if(isMatch){return done(null,user);}else{
					console.log('four');
					return done(null,false,{message: 'Incorrect Password'});
				}
			} );
		});
	}
	));


router.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/users/login',
                                   failureFlash: 'Invalid Username or Password'}),
  function(req,res){
  	console.log('Auth successful');
  	res.redirect('/');

  }
);

router.get('/logout',function(req,res){
	req.logout();
	req.flash('success','You have been logged out');
	res.redirect('/users/login');
});

module.exports = router;