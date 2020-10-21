var express = require('express');
var router = express.Router();

router.get('/',ensureAuth, function(req,res){
	res.render('index');

});

function ensureAuth(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/users/login');
}

module.exports = router;