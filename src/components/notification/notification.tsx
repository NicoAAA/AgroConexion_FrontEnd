'use client'
import axios, { AxiosError } from "axios"
import { useState, useEffect, useRef } from "react"
import { Bell, Trash2 } from "lucide-react"
import Image from "next/image"

type NotificationData = Record<string, any>

type Notification = {
  id: number
  type: string
  title?: string
  message: string
  image?: string
  data: NotificationData
  read?: boolean
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [error, setError] = useState("")
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null

  // Cargar notificaciones iniciales
  useEffect(() => {
    const GetNotifications = async () => {
      setLoading(true)
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/notifications/list", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setNotifications(response.data)
      } catch (err) {
        const error = err as AxiosError
        if (error.response?.status === 401) {
          setError("No autorizado. Por favor inicia sesión nuevamente.")
        } else {
          setError("Error al cargar notificaciones.")
        }
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      GetNotifications()
    } else {
      setLoading(false)
    }
  }, [token])

  // WebSocket para notificaciones en tiempo real
    useEffect(() => {
    if (!token) return

    const socket = new WebSocket(`ws://127.0.0.1:8000/ws/notificaciones/?token=${token}`)

    socket.onopen = () => {
        console.log("🔌 WebSocket conectado")
    }

    socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log(data)
          const notif = data.data
          console.log(notif)
          setNotifications(prev => [notif, ...prev])
        } catch (err) {
          console.error("❌ Error al parsear mensaje:", err)
        }
    }

    socket.onerror = (error) => {
        console.error("❌ Error en WebSocket:", error)
    }

    socket.onclose = (event) => {
        console.log("🔌 WebSocket desconectado", event.reason)
    }

    return () => {
        socket.close()
    }
    }, [token])


  const getFullImageUrl = (path: string) =>
    path.startsWith('http') ? path : `http://127.0.0.1:8000${path}`

  const unreadCount = notifications.length

  const deleteNotification = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/notifications/delete/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setNotifications(prev => prev.filter(n => n.id !== id))
    } catch (err) {
      console.error("Error al eliminar notificación", err)
    }
  }

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Botón */}
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition flex items-center gap-2 shadow-md"
        type="button"
      >
        <div className="relative">
          <Bell className="text-xl" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        Notificaciones
        <svg
          className={`w-4 h-4 transform transition-transform ${open ? "rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-3 w-[24rem] bg-white rounded-2xl shadow-2xl border-2 border-green-300 z-20 animate-fade-slide">
          <div className="p-4 max-h-[28rem] overflow-y-auto 
            scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-green-100 
            hover:scrollbar-thumb-green-500 rounded-b-2xl"
          >
            {!token ? (
              <p className="text-gray-600 text-center py-6">
                🔒 Inicia sesión para ver tus notificaciones
              </p>
            ) : loading ? (
              <p className="text-gray-600 text-center py-6 animate-pulse">
                ⏳ Cargando notificaciones...
              </p>
            ) : error ? (
              <p className="text-red-500 text-center py-6">{error}</p>
            ) : notifications.length === 0 ? (
              <p className="text-gray-500 text-center py-6">📭 No tienes notificaciones aún</p>
            ) : (
              <ul className="space-y-3">
                {notifications.map((n) => (
                  <li key={n?.id} className="border border-green-300 rounded-2xl hover:bg-green-200 ">
                    <div className="flex items-start gap-3 justify-between">
                      <div className="flex gap-3">
                        {n?.image && (
                          <Image
                            src={getFullImageUrl(n.image)}
                            alt={`${n.title}`}
                            width={40}
                            height={50}
                            className="rounded-l-2xl"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-green-700">{n?.title || "Notificación"}</p>
                          <p className="text-sm text-gray-700">{n?.message}</p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNotification(n?.id)
                        }}
                        className="text-red-500 hover:text-red-700 mr-2 mt-5"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Notifications
