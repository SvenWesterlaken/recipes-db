const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../auth/auth');

router.get('*', function(request, response) {
  response.status(404);
  response.json({"msg": "Api endpoint not available"});
});

module.exports = router;
