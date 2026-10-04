import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL as string,
  }),
});

const img = (slug: string) => {
  const map: Record<string, string> = {
    'aria-headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
    'pulse-speaker': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop',
    'volt-dock': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=600&fit=crop',
    'ergo-stand': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=600&fit=crop',
    'lumen-lamp': 'https://images.unsplash.com/photo-1507473885765-e6ed057f492c?w=600&h=600&fit=crop',
    'felt-pad': 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=600&fit=crop',
    'stoneware-mugs': 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&h=600&fit=crop',
    'woven-wall': 'https://images.unsplash.com/photo-1578500492678-6d75d8b6c6d1?w=600&h=600&fit=crop',
    'beeswax-trio': 'https://images.unsplash.com/photo-1602028915047-37269d2a61f5?w=600&h=600&fit=crop',
    'leather-wallet': 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop',
    'leather-organizer': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop',
    'leather-belt': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop',
    'oak-stool': 'https://images.unsplash.com/photo-1503607882651-9c6b37b1b4e5?w=600&h=600&fit=crop',
    'walnut-board': 'https://images.unsplash.com/photo-1604941930269-1c8b79e3a9c7?w=600&h=600&fit=crop',
    'cedar-planter': 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&h=600&fit=crop',
    'brass-hoops': 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&h=600&fit=crop',
    'signet-ring': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop',
    'stone-pendant': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop',
  };
  return map[slug] ?? `https://picsum.photos/seed/${slug}/600/600`;
};

const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_FULL_NAME = 'Store Admin';
/**
 * Development-only fallback so the review workflow is testable on a fresh
 * checkout. `ADMIN_SEED_PASSWORD` overrides it. This value is intentionally
 * obvious and is only ever written to a local/dev database.
 */
const DEFAULT_DEV_ADMIN_PASSWORD = 'dev-admin-not-for-production';

async function seedAdmin() {
  const password = process.env.ADMIN_SEED_PASSWORD;
  if (!password) {
    console.warn(
      `[seed] ADMIN_SEED_PASSWORD is not set — seeding ${ADMIN_EMAIL} with a development-only password. Do not run this against a real environment.`,
    );
  }
  const passwordHash = await bcrypt.hash(
    password ?? DEFAULT_DEV_ADMIN_PASSWORD,
    10,
  );

  // Upsert, like every other seed row: re-running never wipes and never
  // downgrades an admin that was already created. The password hash IS
  // refreshed so a dev admin with a lost or stale password can be recovered by
  // re-seeding; admins are local-only fixtures and never real accounts.
  return await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { fullName: ADMIN_FULL_NAME, role: 'admin', passwordHash },
    create: {
      email: ADMIN_EMAIL,
      fullName: ADMIN_FULL_NAME,
      passwordHash,
      role: 'admin',
    },
  });
}

async function main() {
  // Dev admin for the seller approval workflow (no sellerStatus — admins are
  // not reviewed).
  await seedAdmin();

  // Upsert seed sellers (never wipe users).
  const sellersData = [
    {
      email: 'seller.audio@example.com',
      fullName: 'Ava Reyes',
      role: 'seller' as const,
      sellerStatus: 'approved' as const,
    },
    {
      email: 'seller.desk@example.com',
      fullName: 'Ben Carter',
      role: 'seller' as const,
      sellerStatus: 'approved' as const,
    },
    {
      email: 'seller.craft@example.com',
      fullName: 'Clara Haddad',
      role: 'seller' as const,
      sellerStatus: 'approved' as const,
    },
  ];

  const sellers: { id: string; email: string }[] = [];
  for (const s of sellersData) {
    sellers.push(
      await prisma.user.upsert({
        where: { email: s.email },
        update: { fullName: s.fullName, role: s.role, sellerStatus: s.sellerStatus },
        create: s,
      }),
    );
  }
  const byEmail = Object.fromEntries(sellers.map((s) => [s.email, s.id]));

  const productsData = [
    {
      slug: 'aria-wireless-headphones',
      name: 'Aria Wireless Headphones',
      description: 'Over-ear wireless headphones with noise cancellation and 30-hour battery.',
      price: 149.99,
      images: [img('aria-headphones')],
      stock: 24,
      status: 'active' as const,
      category: 'Desk Tech',
      ratingAvg: 4.7,
      ratingCount: 132,
      freeShipping: true,
      sellerId: byEmail['seller.audio@example.com'],
    },
    {
      slug: 'pulse-bluetooth-speaker',
      name: 'Pulse Bluetooth Speaker',
      description: 'Compact portable speaker with deep bass and 12-hour playtime.',
      price: 59.0,
      images: [img('pulse-speaker')],
      stock: 40,
      status: 'active' as const,
      category: 'Desk Tech',
      ratingAvg: 4.3,
      ratingCount: 89,
      freeShipping: true,
      sellerId: byEmail['seller.audio@example.com'],
    },
    {
      slug: 'volt-usb-c-docking-station',
      name: 'Volt USB-C Docking Station',
      description: '7-in-1 USB-C dock with 4K HDMI, ethernet, and fast charging.',
      price: 89.95,
      images: [img('volt-dock')],
      stock: 15,
      status: 'active' as const,
      category: 'Desk Tech',
      ratingAvg: 4.1,
      ratingCount: 47,
      freeShipping: false,
      sellerId: byEmail['seller.audio@example.com'],
    },
    {
      slug: 'ergo-laptop-stand',
      name: 'Ergo Laptop Stand',
      description: 'Aluminum adjustable laptop stand for better desk posture.',
      price: 34.5,
      images: [img('ergo-stand')],
      stock: 60,
      status: 'active' as const,
      category: 'Desk Tech',
      ratingAvg: 4.5,
      ratingCount: 210,
      freeShipping: true,
      sellerId: byEmail['seller.desk@example.com'],
    },
    {
      slug: 'lumen-desk-lamp',
      name: 'Lumen Desk Lamp',
      description: 'Dimmable LED desk lamp with warm-to-cool color control.',
      price: 42.0,
      images: [img('lumen-lamp')],
      stock: 33,
      status: 'active' as const,
      category: 'Desk Tech',
      ratingAvg: 4.6,
      ratingCount: 118,
      freeShipping: true,
      sellerId: byEmail['seller.desk@example.com'],
    },
    {
      slug: 'felt-desk-pad-xl',
      name: 'Felt Desk Pad XL',
      description: 'Extra-large wool felt desk pad with stitched edges.',
      price: 29.99,
      images: [img('felt-pad')],
      stock: 0,
      status: 'active' as const,
      category: 'Woven Textile',
      ratingAvg: 3.9,
      ratingCount: 25,
      freeShipping: false,
      sellerId: byEmail['seller.desk@example.com'],
    },
    {
      slug: 'stoneware-mug-set',
      name: 'Stoneware Mug Set',
      description: 'Set of two handmade stoneware mugs with matte glaze.',
      price: 38.0,
      images: [img('stoneware-mugs')],
      stock: 18,
      status: 'active' as const,
      category: 'Ceramics',
      ratingAvg: 4.8,
      ratingCount: 64,
      freeShipping: true,
      sellerId: byEmail['seller.craft@example.com'],
    },
    {
      slug: 'woven-wall-hanging',
      name: 'Woven Wall Hanging',
      description: 'Handwoven cotton wall tapestry in natural earth tones.',
      price: 54.5,
      images: [img('woven-wall')],
      stock: 9,
      status: 'active' as const,
      category: 'Woven Textile',
      ratingAvg: 4.4,
      ratingCount: 31,
      freeShipping: false,
      sellerId: byEmail['seller.craft@example.com'],
    },
    {
      slug: 'beeswax-candle-trio',
      name: 'Beeswax Candle Trio',
      description: 'Three hand-poured beeswax candles with cotton wicks.',
      price: 24.0,
      images: [img('beeswax-trio')],
      stock: 50,
      status: 'active' as const,
      category: 'Ceramics',
      ratingAvg: 4.2,
      ratingCount: 73,
      freeShipping: true,
      sellerId: byEmail['seller.craft@example.com'],
    },
    {
      slug: 'full-grain-leather-wallet',
      name: 'Full-Grain Leather Wallet',
      description: 'Minimalist full-grain leather bifold wallet, hand-stitched.',
      price: 65.0,
      images: [img('leather-wallet')],
      stock: 27,
      status: 'active' as const,
      category: 'Leather Goods',
      ratingAvg: 4.9,
      ratingCount: 156,
      freeShipping: true,
      sellerId: byEmail['seller.craft@example.com'],
    },
    {
      slug: 'leather-desk-organizer',
      name: 'Leather Desk Organizer',
      description: 'Handcrafted leather valet tray and desk organizer.',
      price: 48.75,
      images: [img('leather-organizer')],
      stock: 12,
      status: 'active' as const,
      category: 'Leather Goods',
      ratingAvg: 4.0,
      ratingCount: 19,
      freeShipping: false,
      sellerId: byEmail['seller.craft@example.com'],
    },
    {
      slug: 'braided-leather-belt',
      name: 'Braided Leather Belt',
      description: 'Hand-braided leather belt with solid brass buckle.',
      price: 72.0,
      images: [img('leather-belt')],
      stock: 7,
      status: 'active' as const,
      category: 'Leather Goods',
      ratingAvg: 4.6,
      ratingCount: 42,
      freeShipping: true,
      sellerId: byEmail['seller.craft@example.com'],
    },
    {
      slug: 'white-oak-stool',
      name: 'White Oak Stool',
      description: 'Hand-joined white oak stool with wedged tenon legs.',
      price: 129.0,
      images: [img('white-oak-stool')],
      stock: 11,
      status: 'active' as const,
      category: 'Studio Wood',
      ratingAvg: 4.8,
      ratingCount: 37,
      freeShipping: true,
      sellerId: byEmail['seller.desk@example.com'],
    },
    {
      slug: 'walnut-serving-board',
      name: 'Walnut Serving Board',
      description: 'Oiled black walnut serving board with juice groove.',
      price: 58.5,
      images: [img('walnut-board')],
      stock: 22,
      status: 'active' as const,
      category: 'Studio Wood',
      ratingAvg: 4.7,
      ratingCount: 51,
      freeShipping: false,
      sellerId: byEmail['seller.craft@example.com'],
    },
    {
      slug: 'cedar-planter-box',
      name: 'Cedar Planter Box',
      description: 'Dovetailed cedar planter box for herbs and greens.',
      price: 44.0,
      images: [img('cedar-planter')],
      stock: 16,
      status: 'active' as const,
      category: 'Studio Wood',
      ratingAvg: 4.5,
      ratingCount: 28,
      freeShipping: true,
      sellerId: byEmail['seller.craft@example.com'],
    },
    {
      slug: 'hammered-brass-hoops',
      name: 'Hammered Brass Hoops',
      description: 'Hand-hammered brass hoop earrings, studio cast.',
      price: 68.0,
      images: [img('brass-hoops')],
      stock: 19,
      status: 'active' as const,
      category: 'Fine Jewelry',
      ratingAvg: 4.9,
      ratingCount: 63,
      freeShipping: true,
      sellerId: byEmail['seller.craft@example.com'],
    },
    {
      slug: 'sterling-signet-ring',
      name: 'Sterling Signet Ring',
      description: 'Cast sterling silver signet ring with brushed finish.',
      price: 95.0,
      images: [img('signet-ring')],
      stock: 8,
      status: 'active' as const,
      category: 'Fine Jewelry',
      ratingAvg: 4.6,
      ratingCount: 29,
      freeShipping: true,
      sellerId: byEmail['seller.craft@example.com'],
    },
    {
      slug: 'river-stone-pendant',
      name: 'River Stone Pendant',
      description: 'Polished river stone pendant on waxed cotton cord.',
      price: 42.5,
      images: [img('stone-pendant')],
      stock: 25,
      status: 'active' as const,
      category: 'Fine Jewelry',
      ratingAvg: 4.4,
      ratingCount: 18,
      freeShipping: false,
      sellerId: byEmail['seller.desk@example.com'],
    },
  ];

  // Upsert products by slug (never wipe; re-runs change nothing).
  for (const p of productsData) {
    const { slug, sellerId, ...mutable } = p;
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: mutable,
      create: { ...p },
    });
  }

  const [userCount, productCount] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
  ]);
  console.log(`Seed complete: ${sellers.length} sellers upserted, users=${userCount}, products=${productCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
