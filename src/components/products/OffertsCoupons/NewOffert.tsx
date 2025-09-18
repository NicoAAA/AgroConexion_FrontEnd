// src/components/offers/CreateOfferForm.tsx
"use client";

import { useState } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { Leaf, Percent, Calendar, FileText, Tag } from 'lucide-react';
interface CreateOfferFormProps {
  productId: number;
}

export default function CreateOfferForm({ productId }: CreateOfferFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    percentage: 0,
    end_date: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/offers_and_coupons/new-offert/", {
        product: productId,
        ...formData,
      });

      toast.success("✅ Oferta creada con éxito");
      setFormData({ title: "", description: "", percentage: 0, end_date: "" });
    } catch (err: any) {
      toast.error("❌ Error al crear la oferta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header con tema campesino */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4 shadow-lg">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-green-800 mb-2">
            Crear Nueva Oferta
          </h1>
          <p className="text-green-600 text-lg">
            Promociona tus productos del campo
          </p>
        </div>

        {/* Formulario principal */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header del formulario */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 sm:px-8 py-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
              <Tag className="w-6 h-6" />
              Detalles de la Oferta
            </h2>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Campo Título */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Tag className="w-4 h-4 text-green-600" />
                Título de la Oferta
              </label>
              <input
                type="text"
                name="title"
                placeholder="Ej: Tomates frescos de la finca"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-gray-800 placeholder-gray-400"
                required
              />
            </div>

            {/* Campo Descripción */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FileText className="w-4 h-4 text-green-600" />
                Descripción del Producto
              </label>
              <textarea
                name="description"
                placeholder="Describe tu producto: origen, calidad, características especiales..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-gray-800 placeholder-gray-400 resize-none"
              />
            </div>

            {/* Grid responsivo para porcentaje y fecha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campo Porcentaje */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Percent className="w-4 h-4 text-green-600" />
                  Descuento (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="percentage"
                    placeholder="15"
                    value={formData.percentage}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-8 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-gray-800 placeholder-gray-400"
                    min={1}
                    max={100}
                    required
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 font-semibold">
                    %
                  </span>
                </div>
              </div>

              {/* Campo Fecha */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Calendar className="w-4 h-4 text-green-600" />
                  Fecha de Vencimiento
                </label>
                <input
                  type="datetime-local"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-gray-800"
                  required
                />
              </div>
            </div>

            {/* Botón de envío */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3 text-lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creando Oferta...
                  </>
                ) : (
                  <>
                    <Leaf className="w-5 h-5" />
                    Crear Oferta Campesina
                  </>
                )}
              </button>
            </div>

            {/* Mensaje informativo */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
              <Leaf className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-green-700">
                <p className="font-semibold mb-1">💡 Consejo para campesinos</p>
                <p>Describe la frescura y origen de tus productos. Los compradores valoran la calidad y la historia detrás de cada cosecha.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
