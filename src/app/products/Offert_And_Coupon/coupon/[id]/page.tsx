// src/app/products/[id]/offers/page.tsx
"use client";

import { useParams } from "next/navigation";
import CreateCouponForm from "@/components/products/OffertsCoupons/NewCoupon";
export default function OffersPage() {
  const { id } = useParams(); // id del producto en la URL
  const productId = Number(id);

  return (
    <div className="p-6 space-y-8">
      <CreateCouponForm productId={productId} />
    </div>
  );
}