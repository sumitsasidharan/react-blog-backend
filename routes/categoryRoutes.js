const router = require('express').Router();
const Category = require('../models/categoryModel');

router.post('/', async (req, res) => {
   const newCat = new Category(req.body);

   try {
      await newCat.save();
      res.status(200).json(newCat);
   } catch (err) {
      console.log(err);
      res.status(500).json(err);
   }
});

router.get('/', async (req, res) => {
   try {
      const cats = await Category.find();
      res.status(200).json({
         status: 'success',
         results: cats.length,
         cats,
      });
   } catch (err) {
      console.log(err);
      res.status(500).json(err);
   }
});

module.exports = router;
