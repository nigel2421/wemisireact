
import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../types';
import { GoogleGenAI, Modality } from '@google/genai';
import { imageUrlToBase64 } from '../utils/imageUtils';
import { SparklesIcon } from './icons/SparklesIcon';
import { XIcon } from './icons/XIcon';
import { UploadIcon } from './icons/UploadIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { BrushIcon } from './icons/BrushIcon';
import { TrashIcon } from './icons/TrashIcon';

interface RoomVisualizerProps {
  product: Product;
  onClose: () => void;
}

const RoomVisualizer: React.FC<RoomVisualizerProps> = ({ product, onClose }) => {
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Masking state
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(30);
  const [hasMask, setHasMask] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Update context properties when brush size changes
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = 'rgba(220, 38, 38, 0.7)'; // Red with opacity
      }
    }
  }, [brushSize, roomImage]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleStartOver(); // Clear previous state
      const reader = new FileReader();
      reader.onloadend = () => {
        setRoomImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageLoad = () => {
    if (imageRef.current && canvasRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      
      // Set canvas internal resolution to match original image resolution
      canvasRef.current.width = naturalWidth;
      canvasRef.current.height = naturalHeight;
      
      // Reset context after resize
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = 'rgba(220, 38, 38, 0.7)';
      }
    }
  };

  // --- Drawing Logic ---

  const getCoordinates = (event: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    
    if ('touches' in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = (event as React.MouseEvent).clientX;
      clientY = (event as React.MouseEvent).clientY;
    }

    // Map client coordinates to canvas internal coordinates
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);
    
    return { x, y };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!roomImage || generatedImage) return;
    setIsDrawing(true);
    
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y); // Draw a dot for a single click
      ctx.stroke();
      setHasMask(true);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    e.preventDefault(); // Prevent scrolling on touch devices
    
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath(); // Reset path
    }
  };

  const clearMask = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        setHasMask(false);
      }
    }
  };

  // --- Generation Logic ---

  const handleGenerate = async () => {
    if (!roomImage) {
      setError('Please upload a photo of your room first.');
      return;
    }
    
    if (!hasMask) {
      setError('Please paint over the area you want to modify using the brush tool.');
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
      
      const roomImageBase64 = roomImage.split(',')[1];
      const productImageBase64 = await imageUrlToBase64(product.imageUrls[0]);
      
      // Get mask as base64
      // We need to export the canvas. The canvas has transparent background and red strokes.
      const maskBase64 = canvasRef.current?.toDataURL('image/png').split(',')[1];

      if (!maskBase64) throw new Error("Failed to capture mask.");

      const roomImagePart = { inlineData: { mimeType: 'image/jpeg', data: roomImageBase64 } };
      const productImagePart = { inlineData: { mimeType: 'image/jpeg', data: productImageBase64 } };
      const maskImagePart = { inlineData: { mimeType: 'image/png', data: maskBase64 } };
      
      const prompt = `
        The first image is the original room photo.
        The second image is the product material/texture (${product.name}).
        The third image is a mask where the red colored drawing indicates the specific area to be modified.
        
        Task: Realistically replace ONLY the area covered by the red mask in the first image with the material from the second image.
        - Maintain the original lighting, shadows, and perspective of the room.
        - Do not alter any part of the image that is not covered by the mask.
        - Blend the edges naturally.
      `;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [roomImagePart, productImagePart, maskImagePart, { text: prompt }] },
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
    setHasMask(false);
    clearMask();
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
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <header className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <SparklesIcon className="text-purple-600"/>
            <h2 className="text-lg font-bold text-stone-800">AI Room Visualizer</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-stone-500 hover:bg-stone-200"><XIcon /></button>
        </header>
        
        <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
          {/* Left Panel: Controls */}
          <aside className="w-full md:w-1/4 p-6 border-b md:border-b-0 md:border-r flex flex-col gap-6 bg-stone-50 overflow-y-auto">
            <div className="text-center">
              <img src={product.imageUrls[0]} alt={product.name} className="w-full h-40 object-cover rounded-md mx-auto shadow-sm"/>
              <h3 className="font-bold mt-3 text-stone-800">{product.name}</h3>
              <p className="text-sm text-stone-500">{product.category}</p>
            </div>

            <div className="flex flex-col gap-4">
               <div className="border-t border-stone-200 pt-4">
                 <h4 className="font-semibold text-sm text-stone-700 mb-2">Step 1: Upload Room</h4>
                 <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" ref={fileInputRef}/>
                 <button onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md font-semibold text-sm bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 disabled:opacity-50 transition-colors">
                     <UploadIcon /> {roomImage ? 'Change Photo' : 'Upload Photo'}
                 </button>
               </div>

               {roomImage && !generatedImage && (
                 <div className="border-t border-stone-200 pt-4 animate-fade-in">
                   <h4 className="font-semibold text-sm text-stone-700 mb-2">Step 2: Highlight Area</h4>
                   <p className="text-xs text-stone-500 mb-3">Draw over the floor, wall, or object you want to replace.</p>
                   
                   <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs text-stone-600 mb-1">
                          <span>Brush Size</span>
                          <span>{brushSize}px</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BrushIcon className="text-stone-400 h-4 w-4" />
                          <input 
                            type="range" 
                            min="10" 
                            max="100" 
                            value={brushSize} 
                            onChange={(e) => setBrushSize(parseInt(e.target.value))}
                            className="flex-grow h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-800"
                          />
                        </div>
                      </div>

                      <button 
                        onClick={clearMask}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 transition-colors"
                      >
                        <TrashIcon className="h-4 w-4" /> Clear Mask
                      </button>
                   </div>
                 </div>
               )}

               <div className="border-t border-stone-200 pt-4">
                   <h4 className="font-semibold text-sm text-stone-700 mb-2">Step 3: Generate</h4>
                   <button onClick={handleGenerate} disabled={!roomImage || !hasMask || isLoading || !!generatedImage} className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md font-semibold text-sm bg-purple-600 text-white hover:bg-purple-700 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors shadow-sm">
                      {isLoading ? <div className="spinner"></div> : <SparklesIcon />}
                      {isLoading ? 'Processing...' : 'Visualize'}
                   </button>
               </div>

               {generatedImage && !isLoading && (
                  <a href={generatedImage} download={`visualizer-${product.id}.png`} className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md font-semibold text-sm bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm transition-colors">
                    <DownloadIcon /> Download Result
                  </a>
               )}
               
               {(roomImage || generatedImage) && !isLoading && (
                  <button onClick={handleStartOver} className="text-sm text-stone-500 hover:text-stone-800 underline text-center">Start Over</button>
               )}
            </div>
          </aside>

          {/* Right Panel: Canvas Workspace */}
          <main className="flex-grow bg-stone-200 flex items-center justify-center p-4 relative overflow-hidden select-none">
            {isLoading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center text-center z-30">
                <div className="spinner !w-12 !h-12 !border-4 !border-purple-600 !border-t-transparent"></div>
                <p className="mt-4 text-lg font-semibold text-stone-800">AI is redesigning your room...</p>
                <p className="text-stone-500">Analyzing mask and applying texture.</p>
              </div>
            )}
            
            {error && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded-md shadow-lg max-w-md text-center text-sm">
                    {error}
                    <button onClick={() => setError(null)} className="ml-2 font-bold">&times;</button>
                </div>
            )}
            
            {!roomImage ? (
                <div className="text-center text-stone-500 p-8 border-2 border-dashed border-stone-300 rounded-xl">
                  <UploadIcon className="w-16 h-16 mx-auto text-stone-400" />
                  <p className="mt-4 text-lg font-semibold">Upload a photo to get started</p>
                  <p className="text-sm text-stone-400 mt-1">Use a clear photo of your room</p>
                  <button onClick={() => fileInputRef.current?.click()} className="mt-4 bg-stone-800 text-white px-6 py-2 rounded-full font-medium hover:bg-stone-700 transition-colors">
                      Upload Photo
                  </button>
                </div>
              ) : (
                <div className="relative shadow-xl max-w-full max-h-full flex justify-center">
                    {/* The visual stack: Image first, then Canvas on top */}
                    <img 
                        ref={imageRef}
                        src={generatedImage || roomImage} 
                        alt="Room" 
                        className="max-w-full max-h-[80vh] object-contain block"
                        onLoad={handleImageLoad}
                        draggable={false}
                    />
                    
                    {/* Canvas for drawing mask - Only visible when not generated yet */}
                    {!generatedImage && (
                        <canvas
                            ref={canvasRef}
                            className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                            style={{ opacity: 0.6 }} // Make the mask semi-transparent
                        />
                    )}
                    
                    {/* Helper text overlay if user hasn't drawn yet */}
                    {!hasMask && !generatedImage && !isDrawing && (
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                            Draw here to select area
                         </div>
                    )}
                </div>
              )
            }
          </main>
        </div>
      </div>
    </div>
  );
};

export default RoomVisualizer;
