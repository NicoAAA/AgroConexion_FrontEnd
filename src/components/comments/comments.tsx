"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Send, Trash2, Edit2, Check, X } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";

interface Comment {
  id: number;
  comment: string;
  user?: {
    id: number;
    username: string;
    profile_image?: string;
  };
}

interface ComentsProductProps {
  productId: number;
}

const ComentsProduct: React.FC<ComentsProductProps> = ({ productId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  const getFullImageUrl = (path: string) =>
    path?.startsWith("http") ? path : `http://127.0.0.1:8000${path}`;

  // Obtener comentarios
  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/comments/product-comments/${productId}/`
      );
      setComments(res.data);
    } catch (error: any) {
      console.error("Error cargando comentarios:", error);
      toast.error("No se pudieron cargar los comentarios. Intenta recargar la página.");
    }
  };

  useEffect(() => {
    if (productId) fetchComments();
  }, [productId]);

  // Crear nuevo comentario
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
      fetchComments();
    } catch (error: any) {
      console.error("Error agregando comentario:", error.response?.data || error);
      toast.error("No se pudo agregar el comentario. Verifica tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  // Editar comentario
  const handleEditComment = (commentId: number, currentText: string) => {
    setEditingId(commentId);
    setEditingText(currentText);
  };

  const handleSaveEdit = async (commentId: number) => {
    if (!editingText.trim()) return;

    try {
      await api.put(`/comments/edit-comment/${commentId}/`, {
        comment: editingText,
      });
      toast.success("Comentario actualizado ✨");
      setEditingId(null);
      setEditingText("");
      fetchComments();
    } catch (error: any) {
      console.error("Error editando comentario:", error.response?.data || error);
      toast.error("No se pudo actualizar el comentario. Intenta de nuevo.");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  // Eliminar comentario
  const handleDeleteComment = async (commentId: number) => {
    try {
      await api.delete(`/comments/delete-comment/${commentId}/`);
      toast.success("Comentario eliminado 🗑️");
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (error: any) {
      console.error("Error eliminando comentario:", error.response?.data || error);
      toast.error("No se pudo eliminar el comentario. Intenta nuevamente.");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4 text-green-700">
        Opiniones de otros usuarios 🌱
      </h2>

      {comments.length > 0 ? (
        <ul className="space-y-4">
          {comments.map((c) => (
            <li
              key={c.id}
              className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl border hover:shadow-md transition"
            >
              {/* Avatar */}
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

              {/* Contenido */}
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">
                    {c.user?.username || "Usuario"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>

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

              {/* Acciones */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDeleteComment(c.id)}
                  className="p-2 rounded-full text-red-500 hover:bg-red-100 transition"
                  title="Eliminar"
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={() =>
                    handleEditComment(c.id, c.comment)
                  }
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

      {/* Formulario nuevo comentario */}
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
