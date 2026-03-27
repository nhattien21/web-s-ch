import { Router, Request, Response } from 'express';
import { Product } from '../models/Product';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const { q, category, brand, minPrice, maxPrice, sort, page = '1', limit = '12' } = req.query as Record<string, string>;
  const filter: Record<string, unknown> = { isActive: true };
  if (q) filter.$text = { $search: q };
  if (category) filter.category = category;
  if (brand) filter.brand = brand;
  if (minPrice || maxPrice) {
    const price: Record<string, number> = {};
    if (minPrice) price.$gte = Number(minPrice);
    if (maxPrice) price.$lte = Number(maxPrice);
    filter.price = price;
  }
  const sortObj: Record<string, 1 | -1> = {};
  if (sort === 'price_asc') sortObj.price = 1;
  if (sort === 'price_desc') sortObj.price = -1;
  if (sort === 'newest') sortObj.createdAt = -1;
  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 12;
  const skip = (pageNum - 1) * limitNum;
  const [items, total] = await Promise.all([
    Product.find(filter).sort(sortObj).skip(skip).limit(limitNum),
    Product.countDocuments(filter),
  ]);
  res.json({ items, total, page: pageNum, pages: Math.ceil(total / limitNum) });
});

router.get('/:id', async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  if (!product || !product.isActive) return res.status(404).json({ error: 'Not found' });
  res.json(product);
});

export default router;
