const express = require('express');
const mongoose = require('mongoose');
const app = express();
const dotenv = require('dotenv');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const postRouter = require('./routes/postRoutes');
const catRouter = require('./routes/categoryRoutes');

dotenv.config();
app.use(express.json());
app.use(cors());
app.use('/images', express.static(path.join(__dirname, '/images')));

/* CODE TO STORE IMAGE FILES ON DISK / SERVER    */
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, 'images');
   },
   filename: (req, file, cb) => {
      cb(null, req.body.name);
   },
});

const upload = multer({ storage: storage });
app.post('/api/upload', upload.single('file'), (req, res) => {
   res.status(200).json('File has been uploaded');
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/categories', catRouter);

const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT || 5000;

mongoose
   .connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true,
   })
   .then(() => {
      console.log('Database connected successfully!');
      app.listen(PORT, console.log(`Server listening on port: ${PORT}`));
   })
   .catch((err) => console.log(err.message));
