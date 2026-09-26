import { Button } from "@/components/ui/components/Button";
import { Badge } from "@/components/ui/components/Badge";
import { Card } from "@/components/ui/components/Card";
import { Input } from "@/components/ui/components/Input";
import { SectionHeading } from "@/components/ui/components/SectionHeading";
import { Container } from "@/components/layout/components/Container";
import { ProductCard } from "@/components/products/components/ProductCard";

const mockProduct = {
  id: "1",
  name: "Sample Product",
  price: 29.99,
  image: "",
  sellerName: "Demo Seller",
  status: "active" as const,
  stock: 3,
};

export default function DevPage() {
  return (
    <div className="flex flex-col gap-10 py-10">
      <Container>
        <SectionHeading>Buttons</SectionHeading>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
      </Container>

      <Container>
        <SectionHeading>Badges</SectionHeading>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="success">Success</Badge>
          <Badge tone="accent">Accent</Badge>
          <Badge tone="info">Info</Badge>
          <Badge tone="warning">Warning</Badge>
          <Badge tone="neutral">Neutral</Badge>
        </div>
      </Container>

      <Container>
        <SectionHeading>Inputs</SectionHeading>
        <div className="flex max-w-md flex-col gap-3">
          <Input placeholder="Normal input" />
          <Input placeholder="Disabled" disabled />
        </div>
      </Container>

      <Container>
        <SectionHeading>Card</SectionHeading>
        <Card>
          <p className="text-sm text-text-secondary">
            This is a basic card surface with default padding and border.
          </p>
        </Card>
      </Container>

      <Container>
        <SectionHeading>ProductCard</SectionHeading>
        <div className="max-w-sm">
          <ProductCard product={mockProduct} />
        </div>
      </Container>
    </div>
  );
}
