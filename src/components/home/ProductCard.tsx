import Image from "next/image"

interface ProductCardProps {
  id: number
  name: string
  description: string
  price: number
  imageUrl?: string
}

export default function ProductCard({
  id,
  name,
  description,
  price,
  imageUrl
}: ProductCardProps) {
  // Fallback para imagen por defecto
  const validImageUrl =
    imageUrl && imageUrl.startsWith("/")
      ? `http://127.0.0.1:8000${imageUrl}`
      : imageUrl || "/default-placeholder.png"

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative w-full h-64">
        <Image
          src={validImageUrl}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        <p className="mt-2 text-green-700 font-bold">${price}</p>
      </div>
    </div>
  )
}
