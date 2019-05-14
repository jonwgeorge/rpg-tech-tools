const express = require('express');
const router = express.Router();

// Home page
router.get('/', (req, res) => {
  res.render('index')
});

// Credits page
router.get('/credits', (req, res) => {
  res.render('credits')
});

module.exports = router;