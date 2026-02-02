
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Modality, Blob, LiveServerMessage } from '@google/genai';

const LiveTool: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcription, setTranscription] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening'>('idle');
  
  const sessionRef = useRef<any>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const decodeAudioData = async (
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const createBlob = (data: Float32Array): Blob => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  const startSession = async () => {
    setStatus('connecting');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      inputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            console.log('Session Opened');
            setStatus('listening');
            setIsActive(true);
            
            const source = inputContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = inputContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Transcription
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              setTranscription(prev => [...prev, `AI: ${text}`]);
            } else if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              setTranscription(prev => [...prev, `You: ${text}`]);
            }

            // Handle Audio Output
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && outputContextRef.current) {
              const ctx = outputContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const sourceNode = ctx.createBufferSource();
              sourceNode.buffer = audioBuffer;
              sourceNode.connect(ctx.destination);
              
              sourceNode.addEventListener('ended', () => {
                sourcesRef.current.delete(sourceNode);
              });
              
              sourceNode.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(sourceNode);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => console.error('Live API Error:', e),
          onclose: () => stopSession(),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: "You are a helpful, conversational AI companion. Respond naturally and keep answers concise for voice chat.",
          outputAudioTranscription: {},
          inputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
          }
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (error) {
      console.error("Failed to start Live session:", error);
      setStatus('idle');
    }
  };

  const stopSession = () => {
    if (sessionRef.current) {
      // Logic to close session and release streams
      setIsActive(false);
      setStatus('idle');
      sessionRef.current = null;
      inputContextRef.current?.close();
      outputContextRef.current?.close();
    }
  };

  return (
    <div className="h-full flex flex-col max-w-2xl mx-auto py-10">
      <div className="flex-1 overflow-y-auto space-y-4 mb-8 pr-4 custom-scrollbar">
        {transcription.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-40 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-4xl mb-4">💬</div>
            <p>Start a conversation to see transcription</p>
          </div>
        )}
        {transcription.map((text, i) => (
          <div key={i} className={`p-3 rounded-xl max-w-[85%] text-sm ${text.startsWith('You:') ? 'bg-indigo-600/20 ml-auto border border-indigo-500/30' : 'bg-slate-800 border border-slate-700'}`}>
            <span className="font-bold opacity-60 mr-2">{text.split(':')[0]}:</span>
            {text.split(':').slice(1).join(':')}
          </div>
        ))}
      </div>

      <div className="bg-slate-800/80 p-8 rounded-3xl border border-slate-700 shadow-2xl flex flex-col items-center gap-6 backdrop-blur-lg">
        <div className="relative">
          {isActive && (
            <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping" />
          )}
          <button
            onClick={isActive ? stopSession : startSession}
            disabled={status === 'connecting'}
            className={`relative w-24 h-24 rounded-full flex items-center justify-center text-3xl transition-all duration-300 transform active:scale-90 shadow-2xl ${
              isActive 
                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30' 
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/30'
            }`}
          >
            {status === 'connecting' ? (
              <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            ) : isActive ? (
              '⏹️'
            ) : (
              '🎙️'
            )}
          </button>
        </div>
        
        <div className="text-center">
          <p className="font-bold text-lg mb-1">
            {status === 'connecting' ? 'Establishing link...' : isActive ? 'Listening...' : 'Ready to Talk'}
          </p>
          <p className="text-xs text-slate-400">
            Powered by Gemini 2.5 Native Audio
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveTool;
