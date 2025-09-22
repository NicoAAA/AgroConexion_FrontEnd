"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  Loader2,
  TicketPercent,
  Calendar,
  CreditCard,
  Copy,
} from "lucide-react";
import toast from "react-hot-toast";
interface Coupon {
  id: number;
  coupon: {
    id: number;
    description: string;
    percentage: string;
    min_purchase_amount: string;
    start_date: string;
    end_date: string;
    active: boolean;
    code: string;
    seller: number;
    product: number;
  };
  used: boolean;
  assigned_at: string;
}

export default function UserCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await api.get("/offers_and_coupons/user/coupons/");
        setCoupons(res.data);
      } catch (error) {
        toast.error("❌ Error cargando los cupones");
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
      </div>
    );
  }

  if (coupons.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        🎟️ No tienes cupones disponibles.
      </div>
    );
  }
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    // Aquí podrías agregar un toast o notificación
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header mejorado */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
              <TicketPercent className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Mis Cupones
            </h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Aprovecha tus descuentos disponibles y ahorra en tu próxima compra
          </p>
        </div>

        {/* Grid responsivo mejorado */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {coupons.map((item) => {
            const { coupon, used } = item;
            const expired = new Date(coupon.end_date) < new Date();
            const isDisabled = used || expired;

            return (
              <div
                key={item.id}
                className={`relative overflow-hidden rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl group ${
                  isDisabled
                    ? "bg-gray-100 border-2 border-gray-200"
                    : "bg-white border-2 border-transparent hover:border-purple-200 hover:-translate-y-1"
                }`}
              >
                {/* Decoración superior */}
                <div
                  className={`h-2 ${
                    isDisabled
                      ? "bg-gray-300"
                      : "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"
                  }`}
                />

                <div className="p-6">
                  {/* Header del cupón */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-xl ${
                          isDisabled
                            ? "bg-gray-200"
                            : "bg-gradient-to-r from-purple-100 to-pink-100"
                        }`}
                      >
                        <TicketPercent
                          className={`w-5 h-5 ${
                            isDisabled ? "text-gray-400" : "text-purple-600"
                          }`}
                        />
                      </div>
                      <div>
                        <h3
                          className={`font-bold text-sm sm:text-base leading-tight ${
                            isDisabled ? "text-gray-500" : "text-gray-800"
                          }`}
                        >
                          {coupon.description || "Cupón especial"}
                        </h3>
                      </div>
                    </div>

                    {/* Badge de estado */}
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        used
                          ? "bg-red-100 text-red-600"
                          : expired
                          ? "bg-gray-200 text-gray-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {used ? "Usado" : expired ? "Expirado" : "Disponible"}
                    </div>
                  </div>

                  {/* Descuento destacado */}
                  <div className="text-center mb-6">
                    <div
                      className={`inline-block ${
                        isDisabled
                          ? "text-gray-400"
                          : "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"
                      }`}
                    >
                      <span className="text-4xl sm:text-5xl font-bold">
                        {coupon.percentage}%
                      </span>
                      <p className="text-sm font-medium mt-1 text-gray-600">
                        de descuento
                      </p>
                    </div>
                  </div>

                  {/* Detalles del cupón */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <CreditCard
                        className={`w-4 h-4 ${
                          isDisabled ? "text-gray-400" : "text-gray-600"
                        }`}
                      />
                      <span
                        className={
                          isDisabled ? "text-gray-500" : "text-gray-700"
                        }
                      >
                        Compra mínima:{" "}
                        <strong>
                          $
                          {Number(coupon.min_purchase_amount).toLocaleString(
                            "es-CO"
                          )}
                        </strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar
                        className={`w-4 h-4 ${
                          expired
                            ? "text-red-500"
                            : isDisabled
                            ? "text-gray-400"
                            : "text-gray-600"
                        }`}
                      />
                      <span
                        className={
                          expired
                            ? "text-red-600"
                            : isDisabled
                            ? "text-gray-500"
                            : "text-gray-700"
                        }
                      >
                        Válido hasta:{" "}
                        {new Date(coupon.end_date).toLocaleDateString("es-CO")}
                      </span>
                    </div>
                  </div>

                  {/* Código del cupón */}
                  <div
                    className={`p-3 rounded-xl border-2 border-dashed ${
                      isDisabled
                        ? "bg-gray-50 border-gray-300"
                        : "bg-purple-50 border-purple-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Código:</p>
                        <code
                          className={`font-mono font-bold text-lg ${
                            isDisabled ? "text-gray-500" : "text-purple-700"
                          }`}
                        >
                          {coupon.code}
                        </code>
                      </div>
                      {!isDisabled && (
                        <button
                          onClick={() => copyToClipboard(coupon.code)}
                          className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200 text-purple-600 hover:text-purple-700"
                          title="Copiar código"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Overlay para cupones deshabilitados */}
                  {isDisabled && (
                    <div className="absolute inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center">
                      <div className="text-center">
                        <div
                          className={`w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center ${
                            used ? "bg-red-500" : "bg-gray-500"
                          }`}
                        >
                          <span className="text-white font-bold text-lg">
                            {used ? "✕" : "⏰"}
                          </span>
                        </div>
                        <p className="text-gray-600 font-medium">
                          {used ? "Cupón Utilizado" : "Cupón Expirado"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Estado vacío (opcional) */}
        {coupons.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <TicketPercent className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No tienes cupones disponibles
            </h3>
            <p className="text-gray-600">
              Los cupones aparecerán aquí cuando estén disponibles
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
