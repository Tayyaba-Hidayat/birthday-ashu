
import React, { useState, useEffect } from 'react';

type Step = 'DOOR' | 'HORROR' | 'IDENTITY' | 'REVEAL' | 'GIFT';

const App: React.FC = () => {
  const [step, setStep] = useState<Step>('DOOR');
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (step === 'REVEAL') {
      // @ts-ignore
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffffff', '#ff9a9e', '#fad0c4', '#ffd1ff']
      });
      
      const interval = setInterval(() => {
        // @ts-ignore
        confetti({
          particleCount: 40,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ff9a9e', '#a18cd1']
        });
        // @ts-ignore
        confetti({
          particleCount: 40,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#fbc2eb', '#fad0c4']
        });
      }, 3500);
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
    <div className="h-screen w-full bg-slate-950 flex items-center justify-center overflow-hidden relative">
      {/* Step 1: Open the Door */}
      {step === 'DOOR' && (
        <div className="text-center p-6 animate-in fade-in zoom-in duration-700">
          <div className="mb-12">
            <div className="w-32 h-32 mx-auto bg-red-900/20 rounded-full flex items-center justify-center border-2 border-red-500/30 pulse-glow">
              <span className="text-5xl">🚪</span>
            </div>
          </div>
          <h2 className="text-3xl font-mystery font-bold text-red-500 mb-8 tracking-widest uppercase">
            The Chamber of Secrets
          </h2>
          <p className="text-slate-400 mb-12 text-lg">Do you really want to open the door?</p>
          <div className="flex flex-col gap-4 max-w-xs mx-auto">
            <button 
              onClick={() => setStep('HORROR')}
              className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-full shadow-lg shadow-red-600/20 transition-all active:scale-95 text-xl"
            >
              YES, OPEN IT
            </button>
            <button 
              onMouseEnter={moveNoButton}
              style={{ transform: `translate(${noButtonPos.x}px, ${noButtonPos.y}px)` }}
              className="px-8 py-2 text-slate-600 text-sm hover:text-slate-400 transition-all duration-100"
            >
              No, I'm scared
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Horror Warning */}
      {step === 'HORROR' && (
        <div className="text-center p-6 animate-in slide-in-from-bottom duration-500">
          <h2 className="text-4xl font-mystery font-bold text-white mb-6 glitch-text uppercase tracking-tighter">
            WARNING
          </h2>
          <p className="text-red-400 mb-12 text-xl max-w-sm mx-auto leading-relaxed italic">
            "Anything horror can happen... dark entities might be released."
          </p>
          <p className="text-slate-200 font-semibold mb-8">Do you still want to proceed?</p>
          <button 
            onClick={() => setStep('IDENTITY')}
            className="px-12 py-5 bg-transparent border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-black rounded-xl transition-all active:scale-95 text-2xl uppercase tracking-widest"
          >
            I AM NOT AFRAID
          </button>
        </div>
      )}

      {/* Step 3: Identity Check */}
      {step === 'IDENTITY' && (
        <div className="text-center p-6 animate-in fade-in duration-1000">
          <div className="text-6xl mb-8">🕵️‍♀️</div>
          <h2 className="text-2xl font-bold text-indigo-300 mb-2">Identification Required</h2>
          <p className="text-slate-300 text-xl mb-12">
            Are you <span className="text-indigo-400 font-bold underline decoration-indigo-500/50">Ayesha Zafar</span>? 
            <br/>
            <span className="text-sm opacity-60 italic mt-2 block">Hahahaha... I know you...</span>
          </p>
          <p className="text-white font-medium mb-8">Do you want to move further?</p>
          <button 
            onClick={handleReveal}
            className="group relative px-12 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/20 overflow-hidden"
          >
            <span className="relative z-10 text-xl">YES, IT'S ME</span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      )}

      {/* Step 4: The Door Reveal */}
      {isDoorOpen && step !== 'REVEAL' && step !== 'GIFT' && (
        <div className="absolute inset-0 z-50 flex pointer-events-none">
          <div className="door-left flex-1 bg-slate-900 border-r border-slate-800 flex items-center justify-end pr-4 shadow-2xl">
             <div className="w-1 h-32 bg-yellow-600/30 rounded-full" />
          </div>
          <div className="door-right flex-1 bg-slate-900 border-l border-slate-800 flex items-center justify-start pl-4 shadow-2xl">
             <div className="w-1 h-32 bg-yellow-600/30 rounded-full" />
          </div>
        </div>
      )}

      {/* Step 5: Beautiful Birthday Celebration Screen */}
      {step === 'REVEAL' && (
        <div className={`h-full w-full animated-gradient flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-1000 overflow-y-auto ${isDoorOpen ? 'door-open' : ''}`}>
          <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
             {[...Array(30)].map((_, i) => (
               <div key={i} className="absolute float-anim text-3xl" style={{ 
                 left: `${Math.random() * 100}%`, 
                 top: `${Math.random() * 100}%`,
                 animationDelay: `${Math.random() * 5}s`,
                 opacity: 0.6
               }}>✨</div>
             ))}
          </div>
          
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <h1 className="text-6xl md:text-8xl font-celebration text-white mb-2 drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)] animate-bounce">
              Happy Birthday
            </h1>
            <h2 className="text-5xl md:text-7xl font-serif-bold text-slate-800 mb-8 tracking-tight drop-shadow-sm">
              AYESHA!
            </h2>
            
            <div className="bg-white/40 backdrop-blur-md p-8 rounded-3xl border border-white/60 shadow-2xl mb-12 transform hover:scale-[1.02] transition-transform">
              <p className="font-poem text-3xl md:text-4xl text-slate-900 leading-relaxed px-4">
                "May your journey be bright as the morning sun,<br/>
                With laughter and joy that have just begun.<br/>
                A soul so kind, a heart so true,<br/>
                The world is a gift because of you."
              </p>
              <div className="w-16 h-0.5 bg-pink-500 mx-auto mt-6 opacity-40" />
            </div>
            
            <p className="text-slate-800 font-medium text-lg mb-10 max-w-md italic opacity-80">
              May this new chapter of your life be filled with wonders!
            </p>
            
            <button 
              onClick={() => setStep('GIFT')}
              className="group relative px-12 py-6 bg-white text-pink-600 rounded-full font-black text-2xl shadow-[0_20px_50px_rgba(255,105,180,0.4)] hover:shadow-[0_20px_50px_rgba(255,105,180,0.6)] transition-all active:scale-95 flex items-center gap-4 border-2 border-pink-100"
            >
              <span>UNBOX THE GIFT</span>
              <span className="group-hover:rotate-12 transition-transform">🎁</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 6: Final Gift Reveal with Jokes and Wishes */}
      {step === 'GIFT' && (
        <div className="h-full w-full bg-slate-50 flex items-center justify-center p-6 animate-in zoom-in fade-in duration-500">
          <div className="bg-white p-10 rounded-[3rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] border border-pink-100 max-w-sm w-full text-center relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-50 rounded-full opacity-50" />
             <div className="absolute top-0 right-0 p-6 opacity-20 text-5xl">🍰</div>
             
             <div className="relative z-10">
               <div className="w-24 h-24 bg-gradient-to-tr from-pink-200 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-12 shadow-lg">
                  <span className="text-5xl">😜</span>
               </div>
               
               <h3 className="text-3xl font-serif-bold text-slate-800 mb-4">SURPRISE!</h3>
               
               <div className="p-8 bg-slate-50/80 rounded-3xl border border-slate-100 mb-10 relative">
                 <div className="absolute -top-3 -left-3 text-4xl text-pink-300 opacity-40">"</div>
                 <p className="text-3xl font-bold text-pink-600 mb-3 italic tracking-tight">
                   Shakal dekhi hai apni?
                 </p>
                 <div className="w-16 h-1 bg-pink-300/30 mx-auto mb-5 rounded-full" />
                 <p className="text-slate-600 text-lg leading-relaxed font-medium">
                   Just kidding meri pyari behen! You are the light of our lives. 
                 </p>
                 <div className="absolute -bottom-3 -right-3 text-4xl text-pink-300 opacity-40">"</div>
               </div>
               
               <div className="space-y-2 py-4">
                 <p className="text-slate-400 text-xs uppercase tracking-[0.3em] font-bold">Warmest Wishes From</p>
                 <p className="text-5xl font-celebration text-indigo-600 drop-shadow-sm">Tayyaba</p>
               </div>

               <button 
                 onClick={() => setStep('REVEAL')}
                 className="mt-12 text-pink-400 text-sm font-bold hover:text-pink-600 transition-colors uppercase tracking-widest flex items-center justify-center gap-2 mx-auto"
               >
                 <span>✨ Back to Party</span>
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
