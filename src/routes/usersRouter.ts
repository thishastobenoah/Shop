import express from 'express';
import { ObjectId } from 'mongodb';
import { User } from '../models/User';
import { getClient } from '../db';

const usersRouter = express.Router();
const db = getClient();

usersRouter.post('/', async (req, res) => {
  try {
    const { displayName, darkTheme, photoURL } = req.body;

    const user: User = {
      displayName,
      darkTheme,
      photoURL,
    };

    const client = await db;
    await client
      .db('shop_db')
      .collection('users')
      .insertOne(user);

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

usersRouter.get('/:id', async (req, res) => {
  try {
    const client = await db;
    const user = await client
      .db('shop_db')
      .collection('users')
      .findOne({ _id: new ObjectId(req.params.id) });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

usersRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { displayName, darkTheme, photoURL } = req.body;

    const client = await db;
    const result = await client
      .db('shop_db')
      .collection('users')
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { displayName, darkTheme, photoURL } }
      );

    if (result.modifiedCount > 0) {
      const updatedUser = await client
        .db('shop_db')
        .collection('users')
        .findOne({ _id: new ObjectId(id) });
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

usersRouter.delete('/:id', async (req, res) => {
  try {
    const client = await db;
    const result = await client
      .db('shop_db')
      .collection('users')
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default usersRouter;
