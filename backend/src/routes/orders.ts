import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { Cart } from '../models/Cart';
import { Order } from '../models/Order';
import { createPaymentUrl, verifyCallback } from '../services/vnpay';

const router = Router();

router.post('/checkout', requireAuth, async (req: AuthRequest, res: Response) => {
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const cart = await Cart.findOne({ user: req.userId });
  if (!cart || cart.items.length === 0) return res.status(400).json({ error: 'Cart is empty' });
  const total = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const order = new Order({
    user: req.userId,
    items: cart.items.map((i) => ({ product: i.product, qty: i.qty, price: i.price, name: i.name })),
    total,
    status: 'pending',
    paymentMethod: 'vnpay',
  });
  await order.save();
  const txnRef = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  order.paymentRef = txnRef;
  await order.save();
  const orderInfo = `Order ${order.id}`;
  const paymentUrl = createPaymentUrl(txnRef, total, ip, orderInfo);
  res.json({ orderId: order.id, paymentUrl });
});

router.get('/vnpay/callback', async (req: AuthRequest, res: Response) => {
  const query = req.query as Record<string, string>;
  const valid = verifyCallback(query);
  if (!valid) return res.status(400).json({ error: 'Invalid signature' });
  const { vnp_ResponseCode, vnp_TxnRef } = query;
  const order = await Order.findOne({ paymentRef: vnp_TxnRef });
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (vnp_ResponseCode === '00') {
    order.status = 'paid';
    await order.save();
    await Cart.findOneAndUpdate({ user: order.user }, { items: [] });
    return res.json({ status: 'paid', orderId: order.id });
  } else {
    order.status = 'canceled';
    await order.save();
    return res.json({ status: 'canceled', orderId: order.id });
  }
});

export default router;
