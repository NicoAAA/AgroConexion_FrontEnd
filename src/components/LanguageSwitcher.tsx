'use client'
import React from 'react'
import { useLanguage } from '@/context/LanguageContext'

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setLang('es')}
        className={`px-3 py-1 rounded ${lang === 'es' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
      >
        ES
      </button>
      <button
        onClick={() => setLang('en')}
        className={`px-3 py-1 rounded ${lang === 'en' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
      >
        EN
      </button>
    </div>
  )
}
