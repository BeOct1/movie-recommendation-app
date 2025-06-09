const express = require('express');
const { client } = require('../server');
const auth = require('../middleware/auth');
const { ObjectId } = require('mongodb');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const usersCol = client.db().collection('users');
    const user = await usersCol.findOne({ _id: ObjectId(req.user.userId) }, { projection: { password: 0 } });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

router.put('/', auth, async (req, res) => {
  try {
    const { username, email } = req.body;
    const usersCol = client.db().collection('users');
    await usersCol.updateOne(
      { _id: ObjectId(req.user.userId) },
      { $set: { username, email } }
    );
    const user = await usersCol.findOne({ _id: ObjectId(req.user.userId) }, { projection: { password: 0 } });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router;