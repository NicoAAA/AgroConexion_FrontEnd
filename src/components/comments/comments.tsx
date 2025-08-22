import { useEffect, useState } from "react"
import {Comment} from '@/types/comments.type'
import axios from "axios"
import { useParams } from 'next/navigation';
import Image from "next/image";
import { responseCookiesToRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
const ComentsProduct = () => {
    const [comments, setComments] = useState<Comment[]>([])
    const product = useParams();
    const product_id = Number(product.id)
    console.log(product_id.valueOf)
    useEffect(()=>{
        const GetCommment = async() => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/comments/product-comments/${product_id}/`)
                console.log("Comentarios API:", response.data);
                setComments(response.data)
                
            } catch (error: any) {
                if (error.response?.data){
                    const apiErrors = error.response.data
                    console.log(apiErrors)
                    if (apiErrors.message){
                        return(
                            <div>
                                <h2>Este producto no tiene comentarios</h2>
                            </div>
                        )
                    }
                }
            }
        }
        GetCommment()
    },[product_id])
    return (
  <div className="space-y-6">
    {comments.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg 
            className="w-8 h-8 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
            />
          </svg>
        </div>
        <p className="text-gray-500 font-medium">No hay comentarios aún</p>
        <p className="text-gray-400 text-sm mt-1">Sé el primero en comentar</p>
      </div>
    ) : (
      <div className="space-y-4">
        {comments.map((com) => (
          <div
            key={com.id}
            className="group relative bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200"
          >
            {/* Header con usuario */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <Image
                  className="rounded-full border-2 border-gray-100 shadow-sm"
                  width={48}
                  height={48}
                  src={`http://127.0.0.1:8000${com.user.profile_image}`}
                  alt={com.user.username}
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors">
                  {com.user.username}
                </h4>
              </div>
            </div>

            {/* Contenido del comentario */}
            <div className="mb-4">
              <p className="text-gray-700 leading-relaxed">
                {com.comment}
              </p>
            </div>

            {/* Imágenes del comentario */}
            {com.images.length > 0 && (
              <div className="mb-4">
                <div className={`grid gap-2 ${
                  com.images.length === 1 ? 'grid-cols-1' : 
                  com.images.length === 2 ? 'grid-cols-2' :
                  com.images.length === 3 ? 'grid-cols-3' :
                  'grid-cols-2'
                }`}>
                  {com.images.slice(0, 4).map((img, index) => (
                    <div 
                      key={img.id}
                      className="relative group/img cursor-pointer overflow-hidden rounded-xl"
                    >
                      <Image
                        className="w-full h-32 object-cover transition-transform duration-300 group-hover/img:scale-105"
                        width={200}
                        height={128}
                        src={`http://127.0.0.1:8000${img.image}`}
                        alt="Imagen comentario"
                      />
                      {/* Overlay para más imágenes */}
                      {index === 3 && com.images.length > 4 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            +{com.images.length - 4}
                          </span>
                        </div>
                      )}
                      {/* Overlay hover */}
                      <div className="absolute inset-0 bg-black opacity-0 group-hover/img:opacity-20 transition-opacity duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);
}

export default ComentsProduct