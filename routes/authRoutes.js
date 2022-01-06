const router = require('express').Router();
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {
   const { username, email, password } = req.body;
   try {
      // First create/generate the salt , then hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
         username,
         email,
         password: hashedPassword,
      });

      await newUser.save();
      res.status(200).json(newUser);
   } catch (err) {
      console.log(err.message);
      res.status(500).json(err);
   }
});

router.post('/login', async (req, res) => {
   // const { username, password } = req.body;

   try {
      const user = await User.findOne({ username: req.body.username });
      !user && res.status(400).json('Wrong username or password');

      const validated = await bcrypt.compare(req.body.password, user.password);
      !validated && res.status(400).json('Wrong username or password');

      const { password, ...others } = user._doc;
      res.status(200).json(others);
   } catch (err) {
      console.log(err.message);
      res.status(500).json(err.message);
   }
});

module.exports = router;
