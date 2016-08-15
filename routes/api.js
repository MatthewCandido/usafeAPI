var express = require('express');
var router 	= express.Router();

router.get('/', function(req, res) {
    res.json({ message: 'USafe API' });   
});
          
router.get('/', function(req, res) {
    res.json({usafe : 'user'});
});

router.get('/createUser', function(req, res) {
    res.json({ message: "User created!" });
});

router.put('/updateUser/:user_id', function(req, res) {
    res.json({ message: "User updated!" });
});

module.exports = router;
