
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

const VeoTool: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore
      const exists = await window.aistudio.hasSelectedApiKey();
      setHasKey(exists);
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    // @ts-ignore
    await window.aistudio.openSelectKey();
    setHasKey(true);
  };

  const generateVideo = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setVideoUrl(null);
    setProgress('Initiating video synthesis...');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      const messages = [
        'Defining neural keyframes...',
        'Synthesizing temporal consistency...',
        'Rendering motion vectors...',
        'Upscaling frames...',
        'Finalizing MP4 stream...'
      ];
      let msgIdx = 0;

      while (!operation.done) {
        setProgress(messages[msgIdx % messages.length]);
        msgIdx++;
        await new Promise(resolve => setTimeout(resolve, 8000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        setVideoUrl(URL.createObjectURL(blob));
      }
    } catch (error: any) {
      console.error("Video generation failed:", error);
      if (error?.message?.includes("Requested entity was not found")) {
        setHasKey(false);
        alert("API Key error. Please select your key again.");
      } else {
        alert("Video generation failed. Veo requires a paid API key.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!hasKey) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <div className="w-20 h-20 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-4xl mb-6 border border-indigo-500/20">🔑</div>
        <h3 className="text-2xl font-bold mb-4">Paid API Key Required</h3>
        <p className="max-w-md text-slate-400 mb-8 leading-relaxed">
          Veo Video Generation models require a selected API key from a paid GCP project. 
          Please select your key to continue.
        </p>
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleSelectKey}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
          >
            Select API Key
          </button>
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-indigo-400 text-sm hover:underline"
          >
            Learn about billing
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 shadow-xl">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>Cinematic Prompt</span>
          <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">Veo 3.1</span>
        </h3>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A neon-lit cyberpunk city in the rain, slow motion, hyper-realistic, 720p..."
          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500 h-24 mb-4"
        />
        <button
          onClick={generateVideo}
          disabled={loading || !prompt}
          className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-3 ${
            loading || !prompt
              ? 'bg-slate-700 text-slate-500'
              : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg'
          }`}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{progress}</span>
            </>
          ) : (
            <>
              <span>Generate Video</span>
              <span className="text-lg">🎬</span>
            </>
          )}
        </button>
      </div>

      <div className="aspect-video w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center relative">
        {videoUrl ? (
          <video src={videoUrl} controls autoPlay loop className="w-full h-full object-contain" />
        ) : loading ? (
          <div className="flex flex-col items-center gap-4 text-slate-500">
             <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
             <p className="animate-pulse">{progress}</p>
          </div>
        ) : (
          <div className="text-slate-600 flex flex-col items-center gap-2">
            <span className="text-6xl opacity-10">📽️</span>
            <p>Ready to synthesize your vision</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VeoTool;
