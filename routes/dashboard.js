const express = require('express');
const {check, validationResult} = require('express-validator/check');
const sanitizeBody = require('express-validator/filter');
const router = express.Router();

// Display the dashboard page
router.get('/', (req, res) => {
  res.render('dashboard/index');
});

router.get('/edit', (req, res) => {
  res.render('dashboard/edit');
});

router.post('/edit', [
  // Name cannot be blank
  check('firstName', 'First name is required').not().isEmpty(),
  check('lastName', 'last name is required').not().isEmpty(),
  // Username cannot be blank
  check('displayName', 'Username is required').not().isEmpty(),
  // Email must be vaild
  check('email', 'Email is required').not().isEmpty().isEmail()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).jsonp(errors.array());
  }
  try {
    Object.assign(req.user.profile, req.body)

    await req.user.update()
  } catch (error) {
    console.log(error);
  }
  res.status(200).render('dashboard/index');
});

module.exports = router;