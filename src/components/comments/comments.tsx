// src/components/comments/comments.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Send, Trash2, Edit2, Check, X } from "lucide-react";
import api from "@/lib/axios"; // cliente Axios configurado para autenticación y baseURL
import { toast } from "sonner"; // notificaciones al usuario

/**
 * Tipado de un comentario
 */
interface Comment {
  id: number;
  comment: string;
  user?: {
    id: number;
    username: string;
    profile_image?: string;
  };
}

/**
 * Props que recibe el componente:
 * - productId: id del producto al que pertenecen los comentarios
 */
interface ComentsProductProps {
  productId: number;
}

/**
 * Componente ComentsProduct
 * ----------------------------------------------------------------
 * - Lista, crea, edita y elimina comentarios asociados a un producto.
 * - Se conecta con el backend (endpoints de comentarios).
 * - Maneja estados de carga y edición en línea.
 */
const ComentsProduct: React.FC<ComentsProductProps> = ({ productId }) => {
  // Estado que guarda todos los comentarios del producto
  const [comments, setComments] = useState<Comment[]>([]);
  // Estado para el texto de un nuevo comentario
  const [newComment, setNewComment] = useState("");
  // Estado para indicar cuando hay una petición en curso
  const [loading, setLoading] = useState(false);
  // Estados para manejar edición de un comentario
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  /**
   * getFullImageUrl
   * ----------------------------------------------------------------
   * Recibe la ruta de una imagen y devuelve la URL completa.
   * Útil para casos donde el backend no devuelve la ruta absoluta.
   */
  const getFullImageUrl = (path: string) =>
    path?.startsWith("http") ? path : `http://127.0.0.1:8000${path}`;

  /**
   * fetchComments
   * ----------------------------------------------------------------
   * Obtiene todos los comentarios de un producto desde el backend.
   */
  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/comments/product-comments/${productId}/`
      );
      setComments(res.data);
    } catch (error: any) {
      console.error("❌ Error cargando comentarios:", error);
      toast.error("No se pudieron cargar los comentarios. Intenta recargar la página.");
    }
  };

  // Cargar comentarios al montar el componente o cuando cambie el productId
  useEffect(() => {
    if (productId) fetchComments();
  }, [productId]);

  /**
   * handleAddComment
   * ----------------------------------------------------------------
   * Crea un nuevo comentario asociado al producto actual.
   */
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setLoading(true);

      await api.post("/comments/new-comment/", {
        product: productId,
        comment: newComment,
      });

      setNewComment("");
      toast.success("Comentario agregado 🌱");
      fetchComments(); // recargar lista
    } catch (error: any) {
      console.error("❌ Error agregando comentario:", error.response?.data || error);
      toast.error("No se pudo agregar el comentario. Verifica tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * handleEditComment
   * ----------------------------------------------------------------
   * Activa el modo edición para un comentario.
   */
  const handleEditComment = (commentId: number, currentText: string) => {
    setEditingId(commentId);
    setEditingText(currentText);
  };

  /**
   * handleSaveEdit
   * ----------------------------------------------------------------
   * Guarda los cambios realizados a un comentario en edición.
   */
  const handleSaveEdit = async (commentId: number) => {
    if (!editingText.trim()) return;

    try {
      await api.put(`/comments/edit-comment/${commentId}/`, {
        comment: editingText,
      });
      toast.success("Comentario actualizado ✨");
      setEditingId(null);
      setEditingText("");
      fetchComments(); // recargar lista
    } catch (error: any) {
      console.error("❌ Error editando comentario:", error.response?.data || error);
      toast.error("No se pudo actualizar el comentario. Intenta de nuevo.");
    }
  };

  /**
   * handleCancelEdit
   * ----------------------------------------------------------------
   * Cancela el modo edición y limpia estados.
   */
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  /**
   * handleDeleteComment
   * ----------------------------------------------------------------
   * Elimina un comentario del backend y lo quita del estado local.
   */
  const handleDeleteComment = async (commentId: number) => {
    try {
      await api.delete(`/comments/delete-comment/${commentId}/`);
      toast.success("Comentario eliminado 🗑️");
      // eliminar de la lista sin recargar todo
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (error: any) {
      console.error("❌ Error eliminando comentario:", error.response?.data || error);
      toast.error("No se pudo eliminar el comentario. Intenta nuevamente.");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4 text-green-700">
        Opiniones de otros usuarios 🌱
      </h2>

      {/* Lista de comentarios */}
      {comments.length > 0 ? (
        <ul className="space-y-4">
          {comments.map((c) => (
            <li
              key={c.id}
              className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl border hover:shadow-md transition"
            >
              {/* Avatar del usuario */}
              {c.user?.profile_image ? (
                <img
                  src={getFullImageUrl(c.user.profile_image)}
                  alt={c.user.username}
                  className="w-10 h-10 rounded-full border-2 border-green-400 object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                  {c.user?.username?.charAt(0).toUpperCase() ?? "U"}
                </div>
              )}

              {/* Contenido del comentario */}
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">
                    {c.user?.username || "Usuario"}
                  </span>
                  {/* ⚠️ Fecha simulada (puedes reemplazar con la del backend si está disponible) */}
                  <span className="text-xs text-gray-500">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>

                {/* Modo edición o texto normal */}
                {editingId === c.id ? (
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="flex-1 px-3 py-1 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      onClick={() => handleSaveEdit(c.id)}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-xl transition"
                      title="Guardar"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-2 text-red-500 hover:bg-red-100 rounded-xl transition"
                      title="Cancelar"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-700 mt-1">{c.comment}</p>
                )}
              </div>

              {/* Acciones: editar y eliminar */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDeleteComment(c.id)}
                  className="p-2 rounded-full text-red-500 hover:bg-red-100 transition"
                  title="Eliminar"
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={() => handleEditComment(c.id, c.comment)}
                  className="p-2 rounded-full text-blue-500 hover:bg-blue-100 transition"
                  title="Editar"
                >
                  <Edit2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic text-sm">
          Aún no hay comentarios. ¡Sé el primero en opinar! ✨
        </p>
      )}

      {/* Formulario para nuevo comentario */}
      <form
        onSubmit={handleAddComment}
        className="mt-6 flex items-center space-x-2"
      >
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escribe tu comentario..."
          className="flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition disabled:opacity-50"
        >
          <Send size={16} />
          <span>{loading ? "Enviando..." : "Enviar"}</span>
        </button>
      </form>
    </div>
  );
};

export default ComentsProduct;
