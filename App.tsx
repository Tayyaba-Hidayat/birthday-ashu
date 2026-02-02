
import React, { useState, useEffect } from 'react';

type Step = 'DOOR' | 'HORROR' | 'IDENTITY' | 'REVEAL' | 'GIFT';

const App: React.FC = () => {
  const [step, setStep] = useState<Step>('DOOR');
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (step === 'REVEAL') {
      // @ts-ignore
      const confettiTrigger = window.confetti || (() => {});
      confettiTrigger({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#f43f5e', '#fbbf24', '#ffffff']
      });
      
      const interval = setInterval(() => {
        confettiTrigger({
          particleCount: 50,
          angle: 60,
          spread: 60,
          origin: { x: 0 },
          colors: ['#6366f1', '#fbbf24']
        });
        confettiTrigger({
          particleCount: 50,
          angle: 120,
          spread: 60,
          origin: { x: 1 },
          colors: ['#f43f5e', '#ffffff']
        });
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [step]);

  const moveNoButton = () => {
    const x = Math.random() * 200 - 100;
    const y = Math.random() * 200 - 100;
    setNoButtonPos({ x, y });
  };

  const handleReveal = () => {
    setIsDoorOpen(true);
    setTimeout(() => {
      setStep('REVEAL');
    }, 1500);
  };

  return (
    <div className="h-screen w-full bg-[#020617] flex items-center justify-center overflow-hidden relative">
      {/* Step 1: Door Challenge */}
      {step === 'DOOR' && (
        <div className="text-center p-6 animate-in fade-in zoom-in duration-700">
          <div className="mb-12 relative">
             <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full scale-150" />
             <div className="relative w-32 h-32 mx-auto bg-slate-900 rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl">
                <span className="text-6xl">🔒</span>
             </div>
          </div>
          <h2 className="text-4xl font-mystery font-bold text-white mb-4 tracking-wider uppercase">
            Locked Chamber
          </h2>
          <p className="text-slate-400 mb-12 text-lg">Do you really want to open the door?</p>
          <div className="flex flex-col gap-5 max-w-xs mx-auto">
            <button 
              onClick={() => setStep('HORROR')}
              className="px-8 py-5 bg-white text-black font-black rounded-2xl shadow-2xl transition-all active:scale-95 text-xl tracking-widest hover:bg-slate-200"
            >
              YES, PROCEED
            </button>
            <button 
              onMouseEnter={moveNoButton}
              style={{ transform: `translate(${noButtonPos.x}px, ${noButtonPos.y}px)` }}
              className="px-8 py-2 text-slate-600 text-sm hover:text-slate-400 transition-all duration-75"
            >
              No, turn back
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Horror Warning */}
      {step === 'HORROR' && (
        <div className="text-center p-6 animate-in slide-in-from-bottom duration-500">
          <div className="text-6xl mb-6">⚠️</div>
          <h2 className="text-3xl font-mystery font-bold text-red-500 mb-6 tracking-tighter uppercase italic">
            "Dark entities reside within..."
          </h2>
          <p className="text-slate-400 mb-12 text-xl max-w-sm mx-auto leading-relaxed">
            Horror beyond your imagination may occur. Still opening?
          </p>
          <button 
            onClick={() => setStep('IDENTITY')}
            className="px-12 py-5 bg-red-600 text-white font-black rounded-xl transition-all active:scale-95 text-xl uppercase tracking-widest shadow-lg shadow-red-600/30"
          >
            I AM READY
          </button>
        </div>
      )}

      {/* Step 3: Identity Verification */}
      {step === 'IDENTITY' && (
        <div className="text-center p-6 animate-in fade-in duration-1000">
          <div className="w-24 h-24 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-indigo-500/30 shadow-inner">
            <span className="text-4xl">👤</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Identity Verification</h2>
          <p className="text-slate-400 text-xl mb-12">
            Are you <span className="text-indigo-400 font-bold underline">Ayesha Zafar</span>? 
            <br/>
            <span className="text-sm opacity-50 italic mt-3 block">Hahahaha... I know everything...</span>
          </p>
          <button 
            onClick={handleReveal}
            className="px-12 py-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 text-xl"
          >
            YES, OPEN IT NOW
          </button>
        </div>
      )}

      {/* Step 4: Physical Door Transition */}
      {isDoorOpen && step !== 'REVEAL' && step !== 'GIFT' && (
        <div className="absolute inset-0 z-50 flex pointer-events-none">
          <div className="door-left flex-1 bg-[#020617] border-r border-white/5 flex items-center justify-end pr-8">
             <div className="w-1.5 h-32 bg-yellow-600/40 rounded-full" />
          </div>
          <div className="door-right flex-1 bg-[#020617] border-l border-white/5 flex items-center justify-start pl-8">
             <div className="w-1.5 h-32 bg-yellow-600/40 rounded-full" />
          </div>
        </div>
      )}

      {/* Step 5: Beautiful Continuous Color Reveal Screen */}
      {step === 'REVEAL' && (
        <div className={`h-full w-full animated-reveal-bg flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-1000 ${isDoorOpen ? 'door-open' : ''}`}>
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="absolute floating" style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                fontSize: `${Math.random() * 2 + 1}rem`
              }}>✨</div>
            ))}
          </div>

          <div className="relative z-10 space-y-8 max-w-2xl">
            <div className="space-y-2">
              <h1 className="text-7xl md:text-9xl font-celebration text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                Happy Birthday
              </h1>
              <h2 className="text-5xl md:text-7xl font-serif-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-tighter">
                AYESHA ZAFAR
              </h2>
            </div>

            <div className="glass-card p-10 rounded-[2.5rem] transform hover:scale-[1.02] transition-transform duration-500">
              <p className="font-poem text-3xl md:text-5xl text-white leading-snug drop-shadow-md">
                "May your path be paved with gold,<br/>
                With stories of joy yet to be told.<br/>
                A year older, a year much wiser,<br/>
                The world's biggest joy, our little surpriser."
              </p>
            </div>

            <button 
              onClick={() => setStep('GIFT')}
              className="mt-8 px-12 py-6 bg-white text-indigo-900 rounded-full font-black text-2xl shadow-2xl hover:bg-slate-100 transition-all active:scale-95 flex items-center gap-4 mx-auto"
            >
              <span>UNBOX THE GIFT</span>
              <span className="animate-bounce">🎁</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 6: Final Message Card */}
      {step === 'GIFT' && (
        <div className="h-full w-full bg-[#020617] flex items-center justify-center p-6 animate-in zoom-in fade-in duration-500">
          <div className="bg-white/95 p-10 rounded-[3.5rem] shadow-[0_20px_100px_rgba(99,102,241,0.3)] border border-white/20 max-w-sm w-full text-center relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-50 rounded-full opacity-50" />
             
             <div className="w-24 h-24 bg-indigo-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-3 shadow-xl">
                <span className="text-5xl">😜</span>
             </div>
             
             <h3 className="text-4xl font-serif-bold text-slate-900 mb-6">SURPRISE!</h3>
             
             <div className="p-8 bg-slate-50 rounded-3xl mb-10 border border-slate-100 relative">
               <p className="text-3xl font-bold text-indigo-600 mb-4 italic">
                 "Shakal dekhi hai apni?"
               </p>
               <div className="w-12 h-1 bg-indigo-200 mx-auto mb-4" />
               <p className="text-slate-500 text-lg font-medium leading-relaxed">
                 Hahaha! Just kidding Ayesha.<br/>You are truly wonderful!
               </p>
             </div>
             
             <div className="space-y-2 pb-4">
               <p className="text-slate-400 text-xs uppercase tracking-[0.4em] font-bold">Best Wishes From</p>
               <p className="text-5xl font-celebration text-indigo-600">Tayyaba</p>
             </div>

             <button 
               onClick={() => setStep('REVEAL')}
               className="mt-8 text-indigo-400 hover:text-indigo-600 font-bold transition-colors uppercase tracking-widest text-xs"
             >
               ← Back to celebration
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
