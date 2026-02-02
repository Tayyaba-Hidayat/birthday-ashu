
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
        particleCount: 180,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#ffffff', '#1e40af', '#10b981']
      });
      
      const interval = setInterval(() => {
        confettiTrigger({
          particleCount: 40,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#fbbf24', '#1e40af']
        });
        confettiTrigger({
          particleCount: 40,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ffffff', '#10b981']
        });
      }, 4500);
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
    <div className="h-screen w-full bg-[#020617] flex items-center justify-center overflow-hidden relative selection:bg-yellow-500/30">
      {/* Step 1: Dark Entry */}
      {step === 'DOOR' && (
        <div className="text-center p-6 animate-in fade-in zoom-in duration-1000">
          <div className="mb-10 relative group">
             <div className="absolute inset-0 bg-blue-600/10 blur-[80px] rounded-full group-hover:bg-blue-600/20 transition-all duration-1000" />
             <div className="relative w-28 h-28 mx-auto bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-5xl group-hover:scale-110 transition-transform">🔒</span>
             </div>
          </div>
          <h2 className="text-3xl font-mystery font-bold text-white mb-4 tracking-widest uppercase">
            Restricted Entry
          </h2>
          <p className="text-slate-500 mb-12 text-sm uppercase tracking-[0.2em]">Authorized Personnel Only</p>
          <div className="flex flex-col gap-4 max-w-xs mx-auto">
            <button 
              onClick={() => setStep('HORROR')}
              className="px-8 py-4 bg-white text-black font-black rounded-xl shadow-2xl transition-all active:scale-95 text-lg tracking-widest hover:bg-slate-200"
            >
              UNLOCK SECRETS
            </button>
            <button 
              onMouseEnter={moveNoButton}
              style={{ transform: `translate(${noButtonPos.x}px, ${noButtonPos.y}px)` }}
              className="px-8 py-2 text-slate-700 text-xs hover:text-slate-500 transition-all duration-75"
            >
              I am afraid
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Warning Message */}
      {step === 'HORROR' && (
        <div className="text-center p-6 animate-in slide-in-from-bottom duration-700">
          <div className="text-5xl mb-6 opacity-80">🔱</div>
          <h2 className="text-2xl font-mystery font-bold text-red-700 mb-4 tracking-widest uppercase italic">
            "Darkness Awaits..."
          </h2>
          <p className="text-slate-400 mb-12 text-lg max-w-sm mx-auto leading-relaxed font-light">
            Once you cross this threshold, the shadows of the past will vanish. Ready to meet the Legend?
          </p>
          <button 
            onClick={() => setStep('IDENTITY')}
            className="px-10 py-4 border border-red-900/50 bg-red-950/20 text-red-500 font-bold rounded-lg transition-all active:scale-95 text-sm uppercase tracking-[0.4em] hover:bg-red-900 hover:text-white"
          >
            DEFY THE ODDS
          </button>
        </div>
      )}

      {/* Step 3: Identity Check */}
      {step === 'IDENTITY' && (
        <div className="text-center p-6 animate-in fade-in duration-1000">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5">
            <span className="text-3xl">🪪</span>
          </div>
          <h2 className="text-xl font-bold text-slate-300 mb-4">Verification Successful</h2>
          <p className="text-slate-400 text-lg mb-12 font-light">
            Target identified as: <span className="text-blue-400 font-bold tracking-tight">The Birthday King</span>
            <br/>
            <span className="text-xs opacity-40 italic mt-3 block uppercase tracking-widest">Initialization sequence complete...</span>
          </p>
          <button 
            onClick={handleReveal}
            className="px-12 py-4 bg-gradient-to-br from-blue-600 to-indigo-900 text-white font-bold rounded-xl shadow-2xl shadow-blue-900/20 text-lg tracking-widest"
          >
            ENTER REALM
          </button>
        </div>
      )}

      {/* Step 4: Doors */}
      {isDoorOpen && step !== 'REVEAL' && step !== 'GIFT' && (
        <div className="absolute inset-0 z-50 flex pointer-events-none">
          <div className="door-left flex-1 border-r border-white/5 flex items-center justify-end pr-8">
             <div className="w-1.5 h-32 bg-yellow-600/20 rounded-full" />
          </div>
          <div className="door-right flex-1 border-l border-white/5 flex items-center justify-start pl-8">
             <div className="w-1.5 h-32 bg-yellow-600/20 rounded-full" />
          </div>
        </div>
      )}

      {/* Step 5: Beautiful Reveal (Male/Premium Theme) */}
      {step === 'REVEAL' && (
        <div className={`h-full w-full animated-reveal-bg flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-1000 ${isDoorOpen ? 'door-open' : ''}`}>
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="absolute float-anim text-yellow-500" style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                fontSize: `${Math.random() * 3 + 1}rem`,
                opacity: 0.3
              }}>✦</div>
            ))}
          </div>

          <div className="relative z-10 space-y-10 max-w-3xl">
            <div className="space-y-4">
              <p className="text-yellow-500 font-mystery tracking-[0.6em] text-sm uppercase opacity-80">The Legend Turns a Year Older</p>
              <h1 className="text-6xl md:text-9xl font-celebration text-white drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)]">
                Happy Birthday
              </h1>
              <h2 className="text-4xl md:text-6xl font-serif-bold text-white tracking-widest uppercase opacity-90">
                CHAMPION
              </h2>
            </div>

            <div className="glass-card p-12 rounded-[2rem] border-white/5">
              <p className="font-poem text-3xl md:text-5xl text-blue-100 leading-relaxed drop-shadow-lg">
                "May your strength be like the mountains tall,<br/>
                Rising high above it all.<br/>
                With a heart of gold and a spirit free,<br/>
                The best is yet for the world to see."
              </p>
            </div>

            <button 
              onClick={() => setStep('GIFT')}
              className="mt-8 px-14 py-5 bg-white text-slate-900 rounded-full font-black text-xl shadow-[0_20px_60px_rgba(255,255,255,0.15)] hover:shadow-[0_20px_60px_rgba(255,255,255,0.25)] transition-all active:scale-95 flex items-center gap-4 mx-auto border-t border-white"
            >
              <span>CLAIM REWARD</span>
              <span className="text-2xl">📦</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 6: The Joke/Gift */}
      {step === 'GIFT' && (
        <div className="h-full w-full bg-[#020617] flex items-center justify-center p-6 animate-in zoom-in duration-500">
          <div className="bg-slate-900 p-12 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/5 max-w-md w-full text-center relative overflow-hidden group">
             <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-all duration-1000" />
             
             <div className="w-20 h-20 bg-yellow-500 text-black rounded-2xl flex items-center justify-center mx-auto mb-8 -rotate-6 shadow-xl shadow-yellow-500/10">
                <span className="text-4xl">😎</span>
             </div>
             
             <h3 className="text-3xl font-mystery font-bold text-white mb-6 tracking-wider">REWARD GRANTED</h3>
             
             <div className="p-10 bg-black/40 rounded-3xl mb-12 border border-white/5 relative">
               <p className="text-4xl font-black text-yellow-500 mb-6 italic tracking-tighter">
                 "Shakal dekhi hai apni?"
               </p>
               <div className="w-10 h-0.5 bg-white/10 mx-auto mb-6" />
               <p className="text-slate-400 text-lg font-medium leading-relaxed italic">
                 Hahahaha! Mazak kar rahi hoon Bhai!<br/>You are actually the smartest and coolest person I know.
               </p>
             </div>
             
             <div className="space-y-2">
               <p className="text-slate-500 text-[10px] uppercase tracking-[0.5em] font-bold">Authenticated By</p>
               <p className="text-5xl font-celebration text-white drop-shadow-md">Tayyaba</p>
             </div>

             <button 
               onClick={() => setStep('REVEAL')}
               className="mt-12 text-blue-500 hover:text-white text-xs font-bold transition-all uppercase tracking-[0.3em]"
             >
               Back to Kingdom
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
