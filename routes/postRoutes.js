const router = require('express').Router();
const User = require('../models/userModel');
const Post = require('../models/postModel');

// CREATE POST
router.post('/', async (req, res) => {
   const newPost = new Post(req.body);
   try {
      await newPost.save();
      res.status(200).json(newPost);
   } catch (err) {
      console.log(err);
      res.status(500).json(err);
   }
});

// READ / GET POST
router.get('/:id', async (req, res) => {
   try {
      const post = await Post.findById(req.params.id);
      res.status(200).json(post);
   } catch (err) {
      console.log(err);
      res.status(500).json(err);
   }
});

// UPDATE POST
router.put('/:id', async (req, res) => {
   try {
      const post = await Post.findById(req.params.id);

      if (post.username === req.body.username) {
         const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            {
               $set: req.body,
            },
            { new: true }
         );

         res.status(200).json(updatedPost);
      } else {
         res.status(401).json('You are not authorised to update this post');
      }
   } catch (err) {
      console.log(err);
      res.status(500).json(err);
   }
});

// DELETE POST
router.delete('/:id', async (req, res) => {
   try {
      const post = await Post.findById(req.params.id);

      if (post.username === req.body.username) {
         await post.remove();

         res.status(200).json('Post deleted Successfully!');
      } else {
         res.status(401).json('You are not authorised to delete this post');
      }
   } catch (err) {
      console.log(err);
      res.status(500).json(err);
   }
});

// GET ALL POSTS
router.get('/', async (req, res) => {
   const username = req.query.user;
   const catName = req.query.cat;

   let posts;
   try {
      if (username) {
         posts = await Post.find({ username });
      } else if (catName) {
         posts = await Post.find({
            categories: {
               $in: [catName],
            },
         });
      } else {
         posts = await Post.find();
      }

      res.status(200).json({
         status: 'success',
         results: posts.length,
         posts,
      });
   } catch (err) {
      console.log(err);
      res.status(500).json(err);
   }
});

module.exports = router;
