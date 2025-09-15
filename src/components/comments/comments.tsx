// src/components/comments/comments.tsx
"use client";

import { useEffect, useState } from "react";
import { Send, Trash2, Edit2, Check, X } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface CommentImage {
  id: number;
  image: string;
}

interface Comment {
  id: number;
  comment: string;
  images: CommentImage[];
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
  const auth = useAuth();
  const currentUser = (auth as any)?.user;

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [newImages, setNewImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [editingImages, setEditingImages] = useState<File[]>([]);
  const [deleteImages, setDeleteImages] = useState<number[]>([]);

  const getFullImageUrl = (path: string) =>
    path?.startsWith("http") ? path : `http://127.0.0.1:8000${path}`;

  const fetchComments = async () => {
    try {
      const res = await api.get(
        `/comments/product-comments/${productId}/`
      );
      setComments(res.data);
    } catch {
      toast.error("No se pudieron cargar los comentarios.");
    }
  };

  useEffect(() => {
    if (productId) fetchComments();
  }, [productId]);

  /** Crear comentario */
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() && newImages.length === 0) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("product", String(productId));
      formData.append("comment", newComment);
      newImages.forEach((file) => formData.append("images", file));

      await api.post("/comments/new-comment/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNewComment("");
      setNewImages([]);
      toast.success("Comentario agregado 🌱");
      fetchComments();
    } catch {
      toast.error("No se pudo agregar el comentario.");
    } finally {
      setLoading(false);
    }
  };

  /** Editar comentario */
  const handleEditComment = (commentId: number, currentText: string) => {
    setEditingId(commentId);
    setEditingText(currentText);
    setEditingImages([]);
    setDeleteImages([]);
  };

  const handleSaveEdit = async (commentId: number) => {
    if (!editingText.trim() && editingImages.length === 0 && deleteImages.length === 0) {
      setEditingId(null);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("comment", editingText);
      editingImages.forEach((file) => formData.append("images", file));
      deleteImages.forEach((id) => formData.append("delete_images", String(id)));

      await api.put(`/comments/edit-comment/${commentId}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Comentario actualizado ✨");
      setEditingId(null);
      setEditingText("");
      setEditingImages([]);
      setDeleteImages([]);
      fetchComments();
    } catch {
      toast.error("No se pudo actualizar el comentario.");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText("");
    setEditingImages([]);
    setDeleteImages([]);
  };

  /** Eliminar comentario */
  const handleDeleteComment = async (commentId: number) => {
    try {
      await api.delete(`/comments/delete-comment/${commentId}/`);
      toast.success("Comentario eliminado 🗑️");
      setComments(comments.filter((c) => c.id !== commentId));
    } catch {
      toast.error("No se pudo eliminar el comentario.");
    }
  };

  /** Manejar selección de nuevas imágenes */
  const handleNewImagesChange = (files: FileList | null, isEditing = false) => {
    if (!files) return;
    const fileArray = Array.from(files);
    if (isEditing) {
      setEditingImages([...editingImages, ...fileArray]);
    } else {
      setNewImages([...newImages, ...fileArray]);
    }
  };

  /** Eliminar imagen seleccionada antes de enviar (nueva) */
  const handleRemoveNewImage = (index: number, isEditing = false) => {
    if (isEditing) {
      setEditingImages(editingImages.filter((_, i) => i !== index));
    } else {
      setNewImages(newImages.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-6 border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-green-700">Opiniones de usuarios 🌿</h2>

      {/* Lista de comentarios */}
      {comments.length > 0 ? (
        <ul className="space-y-6">
          {comments.map((c) => (
            <li key={c.id} className="p-5 bg-gray-50 rounded-2xl border hover:shadow transition">
              <div className="flex items-start space-x-4">
                {/* Avatar */}
                {c.user?.profile_image ? (
                  <img
                    src={getFullImageUrl(c.user.profile_image)}
                    alt={c.user.username}
                    className="w-12 h-12 rounded-full border-2 border-green-400 object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-lg">
                    {c.user?.username?.charAt(0).toUpperCase() ?? "U"}
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-gray-800">{c.user?.username || "Usuario"}</span>
                    <span className="text-xs text-gray-500">{new Date().toLocaleDateString()}</span>
                  </div>

                  {/* Modo edición */}
                  {editingId === c.id ? (
                    <>
                      <textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm mb-2"
                      />

                      {/* Imágenes existentes con opción de borrar */}
                      <div className="flex flex-wrap gap-2 mb-2">
                        {c.images.map((img) => (
                          <div key={img.id} className="relative">
                            <img
                              src={getFullImageUrl(img.image)}
                              alt="comment-img"
                              className="w-20 h-20 rounded-lg object-cover border"
                            />
                            <button
                              type="button"
                              onClick={() => setDeleteImages([...deleteImages, img.id])}
                              className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                              title="Eliminar imagen"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Previsualización nuevas imágenes */}
                      {editingImages.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {editingImages.map((file, i) => (
                            <div key={i} className="relative">
                              <img
                                src={URL.createObjectURL(file)}
                                alt="new-img"
                                className="w-20 h-20 rounded-lg object-cover border"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveNewImage(i, true)}
                                className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                                title="Eliminar"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Agregar nuevas imágenes */}
                      <input
                        type="file"
                        multiple
                        onChange={(e) => handleNewImagesChange(e.target.files, true)}
                        className="text-sm text-gray-600 mb-2"
                      />

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(c.id)}
                          className="px-3 py-1 text-white bg-green-600 rounded-lg hover:bg-green-700"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1 text-white bg-gray-500 rounded-lg hover:bg-gray-600"
                        >
                          Cancelar
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-700 mb-2">{c.comment}</p>
                      {c.images.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {c.images.map((img) => (
                            <img
                              key={img.id}
                              src={getFullImageUrl(img.image)}
                              alt="comment-img"
                              className="w-24 h-24 rounded-lg object-cover border"
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Acciones solo creador */}
              {c.user?.id === currentUser?.id && editingId !== c.id && (
                <div className="flex space-x-2 mt-3 justify-end">
                  <button
                    onClick={() => handleDeleteComment(c.id)}
                    className="p-2 rounded-full text-red-500 hover:bg-red-100 transition"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={() => handleEditComment(c.id, c.comment)}
                    className="p-2 rounded-full text-blue-500 hover:bg-blue-100 transition"
                    title="Editar"
                  >
                    <Edit2 size={18} />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic text-sm">Aún no hay comentarios. ¡Sé el primero en opinar! ✨</p>
      )}

      {/* Formulario nuevo comentario */}
      <form onSubmit={handleAddComment} className="mt-6 space-y-3">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escribe tu comentario..."
          className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
        />

        {/* Previsualización nuevas imágenes */}
        {newImages.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {newImages.map((file, i) => (
              <div key={i} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt="new-img"
                  className="w-20 h-20 rounded-lg object-cover border"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveNewImage(i)}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                  title="Eliminar"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          type="file"
          multiple
          onChange={(e) => handleNewImagesChange(e.target.files)}
          className="text-sm text-gray-600"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl flex items-center space-x-2 transition disabled:opacity-50"
        >
          <Send size={18} />
          <span>{loading ? "Enviando..." : "Enviar"}</span>
        </button>
      </form>
    </div>
  );
};

export default ComentsProduct;
