import React from 'react';
import { Landmark } from "lucide-react";

const LoadingScreen = () => {
  return (
    // Am schimbat bg-white/95 in bg-white pentru opacitate totala
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-all duration-500">
      
      <div className="relative flex items-center justify-center mb-8">
        <div className="w-24 h-24 rounded-full border-[6px] border-blue-100 border-t-blue-600 border-r-blue-600 animate-spin [animation-duration:1500ms] ease-in-out absolute"></div>
        
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center shadow-sm relative z-10">
           <Landmark className="w-8 h-8 text-blue-700 animate-pulse [animation-duration:2000ms]" />
        </div>
        
        <div className="absolute w-20 h-20 bg-blue-600/10 rounded-full animate-ping opacity-20 [animation-duration:2000ms]"></div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight uppercase italic">
          Primăria Comunei Almăj
        </h2>
        <div className="flex items-center justify-center gap-2 text-sm text-slate-500 font-medium uppercase tracking-wider animate-pulse">
          <span className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-blue-700 rounded-full animate-bounce [animation-delay:-300ms]"></span>
            <span className="w-1.5 h-1.5 bg-blue-700 rounded-full animate-bounce [animation-delay:-150ms]"></span>
            <span className="w-1.5 h-1.5 bg-blue-700 rounded-full animate-bounce"></span>
          </span>
        </div>
      </div>

      <div className="absolute bottom-12 flex flex-col items-center">
        <div className="w-12 h-[2px] bg-blue-100 mb-3"></div>
        <p className="text-[10px] uppercase tracking-[0.4em] font-black italic text-slate-400">
           PORTAL DIGITAL • 2025
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;