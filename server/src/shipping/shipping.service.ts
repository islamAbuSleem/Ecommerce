import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type ShippingRates = { rates?: unknown[] };
type ShippingTracking = { status?: unknown };

@Injectable()
export class ShippingService {
  constructor(private readonly config: ConfigService) {}

  apiKey(): string | null {
    return this.config.get<string>('SHIPPING_API_KEY') ?? null;
  }

  isConfigured(): boolean {
    return !!this.apiKey();
  }

  private apiUrl(): string {
    return this.config.get<string>('SHIPPING_API_URL') ?? '';
  }

  async getRates(origin: string, destination: string) {
    const key = this.apiKey();
    if (!key) {
      throw new BadRequestException(
        'Shipping is not configured. Add SHIPPING_API_KEY to enable rates.',
      );
    }
    const res = await fetch(`${this.apiUrl()}/rates`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ origin, destination }),
    });
    if (!res.ok) {
      throw new InternalServerErrorException('Could not fetch shipping rates.');
    }
    return (await res.json()) as ShippingRates;
  }

  async track(trackingNumber: string) {
    const key = this.apiKey();
    if (!key) {
      throw new BadRequestException('Shipping is not configured.');
    }
    const res = await fetch(`${this.apiUrl()}/track/${trackingNumber}`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (!res.ok) {
      throw new InternalServerErrorException('Could not fetch tracking.');
    }
    return (await res.json()) as ShippingTracking;
  }
}
