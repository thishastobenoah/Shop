import express from 'express';
import { ObjectId } from 'mongodb';
import { Product } from '../models/Product';
import { getClient } from '../db';

const productsRouter = express.Router();
const db = getClient();

productsRouter.post('/', async (req, res) => {
  try {
    const { name, price, photoURL } = req.body;

    const product: Product = {
      name,
      price: parseFloat(price),
      photoURL,
    };

    const client = await db;
    await client
      .db('shop_db')
      .collection('products')
      .insertOne(product);

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

productsRouter.get('/', async (req, res) => {
  try {
    const { maxPrice, includes, limit } = req.query;
    let query: any = {};
    
    if (maxPrice) {
      query.price = { $lte: parseFloat(maxPrice as string) };
    }

    if (includes) {
      query.name = { $regex: includes as string, $options: 'i' };
    }

    const client = await db;
    const products = await client
      .db('shop_db')
      .collection('products')
      .find(query)
      .limit(parseInt(limit as string || '0'))
      .toArray();

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

productsRouter.get('/:id', async (req, res) => {
  try {
    const client = await db;
    const product = await client
      .db('shop_db')
      .collection('products')
      .findOne({ _id: new ObjectId(req.params.id) });

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

productsRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, photoURL } = req.body;

    const client = await db;
    const result = await client
      .db('shop_db')
      .collection('products')
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { name, price: parseFloat(price), photoURL } }
      );

    if (result.modifiedCount > 0) {
      const updatedProduct = await client
        .db('shop_db')
        .collection('products')
        .findOne({ _id: new ObjectId(id) });
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

productsRouter.delete('/:id', async (req, res) => {
  try {
    const client = await db;
    const result = await client
      .db('shop_db')
      .collection('products')
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ error:'Internal Server Error' });
  }
});

export default productsRouter;
