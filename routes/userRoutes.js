const router = require('express').Router();
const User = require('../models/userModel');
const Post = require('../models/postModel');
const bcrypt = require('bcrypt');

// Update
router.put('/:id', async (req, res) => {
   if (req.body.userId !== req.params.id) {
      res.status(401).json({ error: 'You are not authorised' });
   }

   if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
   }

   try {
      const updatedUser = await User.findByIdAndUpdate(
         req.params.id,
         {
            $set: req.body,
         },
         { new: true }
      );
      res.status(200).json(updatedUser);
   } catch (err) {
      console.log(err);
      res.status(500).json(err);
   }
});

// DELETE
router.delete('/:id', async (req, res) => {
   if (req.body.userId !== req.params.id) {
      res.status(401).json({ error: 'You are not authorised' });
   }

   try {
      const user = await User.findById(req.params.id);
      if (!user) {
         res.status(404).json('User Not Found');
      }

      await Post.deleteMany({ username: user.username });
   } catch (err) {
      res.status(500).json(err);
   }

   try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json('User has been deleted');
   } catch (err) {
      console.log(err);
      res.status(500).json(err);
   }
});

// GET ALL USERS
router.get('/', async (req, res) => {
   try {
      const users = await User.find({}, '-password');
      res.status(200).json({
         status: 'success',
         results: users.length,
         users,
      });
   } catch (err) {
      console.log(err);
      res.status(500).json(err);
   }
});

// GET ONE USER
router.get('/:id', async (req, res) => {
   try {
      const user = await User.findById(req.params.id, '-password');
      res.status(200).json(user);
   } catch (err) {
      console.log(err);
      res.status(500).json(err);
   }
});

module.exports = router;
