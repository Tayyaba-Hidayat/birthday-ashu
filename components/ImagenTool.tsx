
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { GeneratedAsset } from '../types';

const ImagenTool: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState<GeneratedAsset[]>([]);
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '3:4' | '4:3'>('1:1');

  const generateImage = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio } }
      });

      let imageUrl = '';
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (imageUrl) {
        setAssets(prev => [{
          id: Date.now().toString(),
          type: 'image',
          url: imageUrl,
          prompt,
          timestamp: Date.now()
        }, ...prev]);
      }
    } catch (error) {
      console.error("Image generation failed:", error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 shadow-xl backdrop-blur-sm">
        <label className="block text-sm font-medium text-slate-400 mb-2">Imagination Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A majestic golden dragon sleeping on a mountain of diamonds, cinematic lighting, 8k..."
          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all h-32 resize-none"
        />
        
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Aspect Ratio:</span>
            <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
              {['1:1', '16:9', '9:16', '3:4', '4:3'].map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio as any)}
                  className={`px-3 py-1 rounded-md text-xs transition-all ${
                    aspectRatio === ratio 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={generateImage}
            disabled={loading || !prompt}
            className={`ml-auto px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg ${
              loading || !prompt
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95 shadow-indigo-500/20'
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <span>Generate</span>
                <span className="text-lg">✨</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <div key={asset.id} className="group relative bg-slate-800 rounded-2xl overflow-hidden border border-slate-700/50 shadow-lg hover:shadow-indigo-500/10 transition-all">
              <img src={asset.url} alt={asset.prompt} className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <p className="text-xs text-slate-300 line-clamp-2 italic">"{asset.prompt}"</p>
                <div className="mt-3 flex gap-2">
                   <button className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-md py-2 rounded-lg text-xs font-semibold transition-colors">Download</button>
                   <button className="px-3 bg-indigo-600 hover:bg-indigo-500 py-2 rounded-lg text-xs font-semibold transition-colors">Edit</button>
                </div>
              </div>
            </div>
          ))}
          {assets.length === 0 && !loading && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500">
              <div className="text-6xl mb-4 opacity-20">🎨</div>
              <p>Your creations will appear here</p>
            </div>
          )}
          {loading && (
             <div className="bg-slate-800/40 animate-pulse rounded-2xl aspect-square border border-slate-700/50 flex items-center justify-center">
                <span className="text-slate-600 text-sm">Visualizing...</span>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagenTool;
