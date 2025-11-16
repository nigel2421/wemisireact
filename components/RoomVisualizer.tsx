
import React, { useState, useRef } from 'react';
import { Product } from '../types';
import { GoogleGenAI, Modality } from '@google/genai';
import { imageUrlToBase64, fileToBase64 } from '../utils/imageUtils';
import { SparklesIcon } from './icons/SparklesIcon';
import { XIcon } from './icons/XIcon';
import { UploadIcon } from './icons/UploadIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface RoomVisualizerProps {
  product: Product;
  onClose: () => void;
}

const RoomVisualizer: React.FC<RoomVisualizerProps> = ({ product, onClose }) => {
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setGeneratedImage(null);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setRoomImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!roomImage) {
      setError('Please upload a photo of your room first.');
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
      
      const roomImageBase64 = roomImage.split(',')[1];
      const productImageBase64 = await imageUrlToBase64(product.imageUrls[0]);

      const roomImagePart = { inlineData: { mimeType: 'image/jpeg', data: roomImageBase64 } };
      const productImagePart = { inlineData: { mimeType: 'image/jpeg', data: productImageBase64 } };
      const textPart = { text: `Analyze the first image, which is a photo of a room. Then, using the texture and material from the second image (a product photo of ${product.name}), realistically replace the main surface in the first image (e.g., floor, wall, or fence) with the product's material. Maintain the original room's lighting, shadows, and perspective.` };
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [roomImagePart, productImagePart, textPart] },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });

      const resultPart = response.candidates?.[0]?.content?.parts[0];
      if (resultPart && resultPart.inlineData) {
        const generatedBase64 = resultPart.inlineData.data;
        setGeneratedImage(`data:image/png;base64,${generatedBase64}`);
      } else {
        throw new Error('AI did not return an image. Please try again.');
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate visualization. ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setRoomImage(null);
    setGeneratedImage(null);
    setError(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <style>{`
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .spinner { border: 2px solid #f3f3f3; border-top: 2px solid #6d28d9; border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite; }
      `}</style>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] max-h-[700px] flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <SparklesIcon className="text-purple-600"/>
            <h2 className="text-lg font-bold text-stone-800">AI Room Visualizer</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-stone-500 hover:bg-stone-200"><XIcon /></button>
        </header>
        
        <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
          {/* Left Panel: Product & Controls */}
          <aside className="w-full md:w-1/3 p-4 border-b md:border-b-0 md:border-r flex flex-col gap-4">
            <div className="text-center">
              <img src={product.imageUrls[0]} alt={product.name} className="w-full h-40 object-cover rounded-md mx-auto"/>
              <h3 className="font-bold mt-2">{product.name}</h3>
              <p className="text-sm text-stone-500">{product.category}</p>
            </div>
            <div className="flex-grow flex flex-col justify-center gap-3">
               <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" ref={fileInputRef}/>
               <button onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md font-semibold text-sm bg-stone-100 text-stone-800 hover:bg-stone-200 disabled:opacity-50 disabled:cursor-not-allowed">
                   <UploadIcon /> {roomImage ? 'Change Photo' : 'Upload Your Room Photo'}
               </button>
               <button onClick={handleGenerate} disabled={!roomImage || isLoading} className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md font-semibold text-sm bg-purple-600 text-white hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed">
                  {isLoading ? <div className="spinner"></div> : <SparklesIcon />}
                  {isLoading ? 'Generating...' : 'Generate Visualization'}
               </button>
               {generatedImage && !isLoading && (
                  <a href={generatedImage} download={`visualizer-${product.id}.png`} className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md font-semibold text-sm bg-emerald-500 text-white hover:bg-emerald-600">
                    <DownloadIcon /> Download Image
                  </a>
               )}
            </div>
            {(roomImage || generatedImage) && !isLoading && (
                <button onClick={handleStartOver} className="text-sm text-stone-500 hover:underline">Start Over</button>
            )}
          </aside>

          {/* Right Panel: Image Display */}
          <main className="flex-grow bg-stone-100 flex items-center justify-center p-4 relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center text-center z-10">
                <div className="spinner !w-10 !h-10 !border-4"></div>
                <p className="mt-4 font-semibold text-purple-700">AI is re-decorating your room...</p>
                <p className="text-sm text-stone-500">This can take a moment.</p>
              </div>
            )}
            {error && <div className="p-4 bg-red-100 border border-red-300 text-red-800 rounded-md text-sm">{error}</div>}
            
            {!isLoading && !error && (
              !roomImage ? (
                <div className="text-center text-stone-500">
                  <UploadIcon className="w-12 h-12 mx-auto" />
                  <p className="mt-2 font-semibold">Upload a photo to get started</p>
                  <p className="text-xs">Your photo will appear here.</p>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <img src={generatedImage || roomImage} alt={generatedImage ? "AI Generated Visualization" : "Your uploaded room"} className="max-w-full max-h-full object-contain rounded-md shadow-lg"/>
                </div>
              )
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default RoomVisualizer;