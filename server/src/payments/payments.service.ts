import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';

type StripeWebhookEvent = {
  type: string;
  data: { object: { metadata?: { orderId?: string } } };
};

@Injectable()
export class PaymentsService {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  stripeKey(): string | null {
    return this.config.get<string>('STRIPE_SECRET_KEY') ?? null;
  }

  isConfigured(): boolean {
    return !!this.stripeKey();
  }

  async createCheckoutSession(userId: string, orderId: string) {
    const key = this.stripeKey();
    if (!key) {
      throw new BadRequestException(
        'Stripe is not configured. Add STRIPE_SECRET_KEY to enable checkout.',
      );
    }
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
    });
    if (!order) throw new BadRequestException('Order not found');

    const base =
      this.config.get<string>('CLIENT_URL') ?? 'http://localhost:3001';
    const body = new URLSearchParams({
      'payment_method_types[]': 'card',
      'line_items[0][price_data][currency]': 'usd',
      'line_items[0][price_data][product_data][name]': `Order ${order.id.slice(0, 8)}`,
      'line_items[0][price_data][unit_amount]': String(
        Math.round(order.total * 100),
      ),
      'line_items[0][quantity]': '1',
      mode: 'payment',
      success_url: `${base}/orders/${order.id}?paid=1`,
      cancel_url: `${base}/cart`,
      'metadata[orderId]': order.id,
    });

    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });
    if (!res.ok) {
      throw new InternalServerErrorException(
        'Could not create a Stripe checkout session.',
      );
    }
    const session = (await res.json()) as { url: string };
    return { url: session.url };
  }

  verifyWebhookSignature(
    payload: string,
    signature: string | null,
    secret: string | null,
  ): boolean {
    if (!signature || !secret) return false;
    const parts = signature.split(',').map((part) => part.split('='));
    const timestamp = parts.find(([k]) => k === '0' || k === 't')?.[1];
    const v1 = parts.find(([k]) => k === '1' || k === 'v1')?.[1];
    if (!timestamp || !v1) return false;
    const expectedSig = createHmac('sha256', secret)
      .update(`${timestamp}.${payload}`)
      .digest('hex');
    const a = Buffer.from(expectedSig);
    const b = Buffer.from(v1);
    return a.length === b.length && timingSafeEqual(a, b);
  }

  async handleWebhook(payload: string, signature: string | null) {
    const secret = this.config.get<string>('STRIPE_WEBHOOK_SECRET') ?? null;
    if (!secret) {
      throw new BadRequestException('Stripe webhook is not configured.');
    }
    if (!this.verifyWebhookSignature(payload, signature, secret)) {
      throw new BadRequestException('Invalid webhook signature.');
    }
    const event = JSON.parse(payload) as StripeWebhookEvent;
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;
      if (orderId) {
        const order = await this.prisma.order.findUnique({
          where: { id: orderId },
        });
        if (order) {
          await this.prisma.order.update({
            where: { id: orderId },
            data: { status: 'paid' },
          });
        }
      }
    }
    return { received: true };
  }
}
