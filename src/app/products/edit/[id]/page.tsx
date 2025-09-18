import { use } from "react";
import EditProduct from '@/components/products/EditProduct'
export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // ✅ unwrap con React.use()
  return <EditProduct productId={Number(id)} />;
}

