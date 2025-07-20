import express from 'express';
import cors from 'cors';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import Stripe from 'stripe';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const PORT = process.env.PORT || 4000;
const app = express();
app.use(cors());
app.use(express.json());

const __dirname = dirname(fileURLToPath(import.meta.url));

const file = join(__dirname, 'data', 'products.json');
const adapter = new JSONFile(file);
const db = new Low(adapter, { products: [] });   
await db.read();

app.get('/api/products', async (req, res) => {
  const { q } = req.query;
  await db.read();
  let products = db.data.products;
  if (q) {
    const query = q.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    );
  }
  res.json(products);
});

const carts = {}; 

app.post('/api/cart', (req, res) => {
  const { sessionId, productId, quantity = 1 } = req.body;
  if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
  carts[sessionId] ||= [];
  const existing = carts[sessionId].find(i => i.productId === productId);
  existing ? (existing.quantity += quantity)
    : carts[sessionId].push({ productId, quantity });
  res.json(carts[sessionId]);
});

app.get('/api/cart/:sessionId', (req, res) =>
  res.json(carts[req.params.sessionId] || [])
);

app.put('/api/cart/:sessionId/:productId', (req, res) => {
  const { sessionId, productId } = req.params;
  const { quantity } = req.body;
  if (!carts[sessionId]) return res.status(404).json({ error: 'cart not found' });
  const item = carts[sessionId].find(i => i.productId === productId);
  if (!item) return res.status(404).json({ error: 'item not found' });
  item.quantity = quantity;
  res.json(carts[sessionId]);
});

app.delete('/api/cart/:sessionId/:productId', (req, res) => {
  const { sessionId, productId } = req.params;
  if (!carts[sessionId]) return res.status(404).json({ error: 'cart not found' });
  carts[sessionId] = carts[sessionId].filter(i => i.productId !== productId);
  res.json(carts[sessionId]);
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_yourkey');

app.post('/api/checkout/create-session', async (req, res) => {
  try {
    const { sessionId } = req.body;
    const cart = carts[sessionId] || [];
    if (!cart.length) return res.status(400).json({ error: 'Cart empty' });

    await db.read();
    const line_items = cart.map(({ productId, quantity }) => {
      const product = db.data.products.find(p => p.id === productId);
      return {
        price_data: {
          currency: 'usd',
          product_data: { name: product.name, description: product.description },
          unit_amount: product.price * 100
        },
        quantity
      };
    });

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: 'http://localhost:5173/success',
      cancel_url: 'http://localhost:5173/cancel'
    });
    res.json({ url: stripeSession.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
