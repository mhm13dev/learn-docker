const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, process.env.FILE) });
const express = require('express');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
});

const User = mongoose.model('User', userSchema);

const app = express();

app.use(express.json());

app.get('/', async function (req, res) {
  try {
    const allUsers = await User.find({});

    return res.json({ message: 'Hello from learn-docker!', users: allUsers });
  } catch (error) {
    return res.status(500).json({
      message: err.message,
      err,
    });
  }
});

app.get('/:name/:age', async function (req, res) {
  try {
    const newUser = await User.create({
      name: req.params.name,
      age: req.params.age,
    });

    return res.status(201).json({
      message: 'User created',
      user: newUser,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      err,
    });
  }
});

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true }).catch((err) => {
  /** handle initial connection error */
  console.log('Initial Error');
  console.log(err);
});

mongoose.connection.on('error', (err) => {
  console.log(err);
});

mongoose.connection.once('open', (err) => {
  console.log('Connected to DB!');
  app.listen(process.env.PORT, function () {
    console.log('Server is listening on: http://localhost:' + process.env.PORT);
  });
});
