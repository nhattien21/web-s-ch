import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { Cart } from '../models/Cart';
import { Product } from '../models/Product';

const router = Router();

router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  const cart = await Cart.findOne({ user: req.userId });
  res.json(cart || { items: [] });
});

router.post('/add', requireAuth, async (req: AuthRequest, res: Response) => {
  const { productId, qty } = req.body as { productId: string; qty: number };
  if (!productId || !qty || qty < 1) return res.status(400).json({ error: 'Invalid input' });
  const product = await Product.findById(productId);
  if (!product || !product.isActive) return res.status(404).json({ error: 'Product not found' });
  let cart = await Cart.findOne({ user: req.userId });
  if (!cart) {
    cart = new Cart({ user: req.userId, items: [] });
  }
  const existing = cart.items.find((i) => i.product.toString() === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.items.push({ product: product._id, qty, price: product.price, name: product.name });
  }
  await cart.save();
  res.json(cart);
});

router.post('/remove', requireAuth, async (req: AuthRequest, res: Response) => {
  const { productId } = req.body as { productId: string };
  if (!productId) return res.status(400).json({ error: 'Invalid input' });
  const cart = await Cart.findOne({ user: req.userId });
  if (!cart) return res.json({ items: [] });
  cart.items = cart.items.filter((i) => i.product.toString() !== productId);
  await cart.save();
  res.json(cart);
});

router.post('/update', requireAuth, async (req: AuthRequest, res: Response) => {
  const { productId, qty } = req.body as { productId: string; qty: number };
  if (!productId || qty === undefined || qty < 1) return res.status(400).json({ error: 'Invalid input' });
  const cart = await Cart.findOne({ user: req.userId });
  if (!cart) return res.status(404).json({ error: 'Cart not found' });
  const item = cart.items.find((i) => i.product.toString() === productId);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  item.qty = qty;
  await cart.save();
  res.json(cart);
});

export default router;
