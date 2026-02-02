
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

const EditTool: React.FC = () => {
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setBaseImage(ev.target?.result as string);
        setResultImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyEdit = async () => {
    if (!baseImage || !prompt.trim()) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = baseImage.split(',')[1];
      const mimeType = baseImage.split(';')[0].split(':')[1];

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType } },
            { text: prompt }
          ]
        }
      });

      let editedUrl = '';
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          editedUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (editedUrl) setResultImage(editedUrl);
    } catch (error) {
      console.error("Edit failed:", error);
      alert("Multimodal edit failed. Please check the prompt and image size.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      <div className="flex flex-col gap-6">
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-300">1. Upload Source</h3>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="aspect-video w-full bg-slate-900 rounded-xl border-2 border-dashed border-slate-700 hover:border-indigo-500/50 cursor-pointer flex flex-col items-center justify-center text-slate-500 transition-all overflow-hidden relative"
          >
            {baseImage ? (
              <img src={baseImage} className="w-full h-full object-contain" alt="Source" />
            ) : (
              <>
                <span className="text-4xl mb-2">📁</span>
                <p className="text-sm">Click to upload image</p>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*" 
            />
          </div>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 flex flex-col gap-4">
          <h3 className="font-semibold text-slate-300">2. Describe Changes</h3>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'Change the sky to a sunset', 'Make the cat wear sunglasses'..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500 h-24"
          />
          <button
            onClick={applyEdit}
            disabled={loading || !baseImage || !prompt}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              loading || !baseImage || !prompt
                ? 'bg-slate-700 text-slate-500'
                : 'bg-indigo-600 text-white hover:bg-indigo-500'
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : 'Re-imagine Image'}
          </button>
        </div>
      </div>

      <div className="bg-slate-950 rounded-2xl border border-slate-800 flex flex-col shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Output Canvas</h3>
          {resultImage && (
            <button className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded text-white transition-colors">
              Save Result
            </button>
          )}
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          {resultImage ? (
            <img src={resultImage} className="max-w-full max-h-full object-contain rounded shadow-2xl" alt="Edited" />
          ) : loading ? (
             <div className="flex flex-col items-center gap-4 text-slate-500">
                <div className="w-12 h-12 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin" />
                <p className="animate-pulse text-sm">Processing multi-modal request...</p>
             </div>
          ) : (
            <div className="text-slate-700 text-center">
              <div className="text-8xl mb-4 opacity-5">🎨</div>
              <p>Your edit will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditTool;
