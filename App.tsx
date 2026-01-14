import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';
import NutritionCard from './components/NutritionCard';
import { analyzeFoodImage } from './services/geminiService';
import { LoadingStatus, FoodAnalysisResult } from './types';
import { Loader2, AlertCircle, RefreshCcw } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<LoadingStatus>(LoadingStatus.IDLE);
  const [data, setData] = useState<FoodAnalysisResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback(async (base64: string, mimeType: string, preview: string) => {
    setPreviewUrl(preview);
    setStatus(LoadingStatus.ANALYZING);
    setError(null);
    setData(null);

    try {
      const result = await analyzeFoodImage(base64, mimeType);
      setData(result);
      setStatus(LoadingStatus.SUCCESS);
    } catch (err) {
      console.error(err);
      setError("我们无法分析该图片。请确保这是一张清晰的食物照片，然后重试。");
      setStatus(LoadingStatus.ERROR);
    }
  }, []);

  const reset = () => {
    setStatus(LoadingStatus.IDLE);
    setData(null);
    setPreviewUrl(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FAFAFA]">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        
        <div className="text-center mb-10 space-y-2">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                吃得聪明，<span className="text-primary">活得健康。</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                利用先进的 AI 技术，拍照即刻估算食物卡路里和营养成分。
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Upload & Preview */}
            <div className={`lg:col-span-5 space-y-6 ${status === LoadingStatus.SUCCESS ? '' : 'lg:col-start-4 lg:col-span-6'}`}>
                
                {status === LoadingStatus.IDLE && (
                   <div className="transition-all duration-500 transform hover:scale-[1.01]">
                        <ImageUpload onImageSelect={handleImageSelect} disabled={false} />
                   </div>
                )}

                {(status === LoadingStatus.ANALYZING || status === LoadingStatus.SUCCESS || status === LoadingStatus.ERROR) && (
                    <div className="relative rounded-3xl overflow-hidden shadow-lg border border-gray-100 group">
                        <img 
                            src={previewUrl!} 
                            alt="Food Preview" 
                            className="w-full h-80 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                        
                        {status !== LoadingStatus.ANALYZING && (
                             <button 
                                onClick={reset}
                                className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-all"
                            >
                                <RefreshCcw size={16} />
                                扫描下一张
                            </button>
                        )}
                       
                        {status === LoadingStatus.ANALYZING && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                                <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
                                <span className="text-white font-medium text-lg tracking-wide animate-pulse">正在分析美味...</span>
                            </div>
                        )}
                    </div>
                )}

                {status === LoadingStatus.ERROR && (
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex flex-col items-center text-center animate-fade-in-up">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-3">
                            <AlertCircle size={24} />
                        </div>
                        <h3 className="text-red-900 font-semibold mb-1">分析失败</h3>
                        <p className="text-red-600 text-sm">{error}</p>
                        <button 
                            onClick={reset}
                            className="mt-4 text-red-700 font-medium hover:underline text-sm"
                        >
                            重试
                        </button>
                    </div>
                )}
            </div>

            {/* Right Column: Results */}
            {status === LoadingStatus.SUCCESS && data && (
                <div className="lg:col-span-7 animate-fade-in-up delay-100">
                    <NutritionCard data={data} />
                </div>
            )}
        </div>

      </main>

      <footer className="py-6 text-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} NutriScan AI. 由 Google Gemini 提供支持。</p>
      </footer>
    </div>
  );
};

export default App;