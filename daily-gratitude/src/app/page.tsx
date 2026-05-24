"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [showPreview, setShowPreview] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-slate-800 font-sans selection:bg-purple-200">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Gratitude.
        </div>
        <div className="space-x-4">
          <Link href="/login" className="text-sm font-medium hover:text-purple-600 transition-colors">
            Log in
          </Link>
          <Link href="/register" className="text-sm font-medium bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 transition-all shadow-md hover:shadow-lg">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center pt-24 pb-16 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-purple-100 mb-8">
          <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
          <span className="text-xs font-semibold text-purple-700 tracking-wide uppercase">Find Peace in Everyday</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight mb-6">
          Cultivate Joy Through <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400">
            Daily Gratitude
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
          Take a moment each day to reflect on the good things. Our journal helps you focus on positivity, shift your mindset, and improve your mental wellbeing.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link href="/register" className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-full hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-1">
            Start Journaling Free
          </Link>
          <button 
            onClick={() => {
              setShowPreview(true);
              setTimeout(() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' }), 50);
            }} 
            className="px-8 py-4 bg-white text-slate-700 font-semibold rounded-full border border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300"
          >
            View Demo
          </button>
        </div>

        {/* Feature Preview or Decorative elements */}
        {showPreview && (
          <div id="demo" className="mt-20 relative w-full scroll-mt-24">
            <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-8 shadow-2xl relative mx-auto max-w-3xl transform rotate-1 scale-[0.98] opacity-70 blur-[2px] hover:blur-none hover:opacity-100 hover:rotate-0 hover:scale-100 transition-all duration-500 ease-out group cursor-default">
               
               {/* Delete Button */}
               <Button 
                 variant="ghost" 
                 size="icon"
                 onClick={() => setShowPreview(false)}
                 className="absolute top-6 right-6 text-slate-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all rounded-full"
                 title="Hapus Jurnal"
               >
                 <Trash2 className="w-5 h-5" />
               </Button>

               <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4 pr-12">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm">
                    ME
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-slate-800">My Journal</div>
                    <div className="text-xs text-slate-500">Today, 10:00 AM</div>
                  </div>
               </div>
               <p className="text-left text-slate-700 leading-relaxed font-medium text-lg">
                  &quot;I am so grateful for the quiet moments this morning with a warm cup of coffee, before the rush of the day started. It helped me center my thoughts.&quot;
               </p>
               <div className="mt-6 flex gap-2">
                 <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">#peaceful</span>
                 <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-semibold">#morning</span>
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
