import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL as string,
  }),
});

const img = (slug: string) => `https://picsum.photos/seed/${slug}/600/600`;

async function main() {
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
      category: 'Tech & Audio',
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
      category: 'Tech & Audio',
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
      category: 'Tech & Audio',
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
      category: 'Desk Setup',
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
      category: 'Desk Setup',
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
      category: 'Desk Setup',
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
      category: 'Handmade Home',
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
      category: 'Handmade Home',
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
      category: 'Handmade Home',
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
      category: 'Leathercraft',
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
      category: 'Leathercraft',
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
      category: 'Leathercraft',
      ratingAvg: 4.6,
      ratingCount: 42,
      freeShipping: true,
      sellerId: byEmail['seller.craft@example.com'],
    },
  ];

  // Upsert products by slug (never wipe; re-runs change nothing).
  for (const p of productsData) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: { ...p },
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
