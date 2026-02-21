'use client'

import { useState } from 'react'
import QRGenerator from '@/components/QRGenerator'
import DesignUploader from '@/components/DesignUploader'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'simple' | 'design'>('simple')

  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Tab Switcher */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1 flex gap-1">
            <button
              onClick={() => setActiveTab('simple')}
              className={`px-7 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'simple'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              Simple QR
            </button>
            <button
              onClick={() => setActiveTab('design')}
              className={`px-7 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'design'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              With Design
            </button>
          </div>
        </div>

        {activeTab === 'simple' ? <QRGenerator /> : <DesignUploader />}

        {/* Credit */}
        <div className="flex justify-center mt-10">
          <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-full px-4 py-2 shadow-sm">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-[9px] font-bold">P</span>
            </div>
            <span className="text-xs text-gray-400">Made by</span>
            <span className="text-xs font-semibold text-gray-700">Paker Asakura</span>
          </div>
        </div>

      </div>
    </main>
  )
}
