import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, Zap, AlertTriangle, RefreshCw } from 'lucide-react';
import { analyzeSupplementImage } from '../services/geminiService';
import { SupplementData } from '../types';

interface Props {
  onScanComplete: (data: SupplementData) => void;
  onClose: () => void;
}

const BarcodeScanner: React.FC<Props> = ({ onScanComplete, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    setError(null);
    
    // Check if browser supports media devices
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Camera API is not supported in this browser context (requires HTTPS).");
      return;
    }

    try {
      let stream: MediaStream;
      try {
        // First try to get the rear/environment camera
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
      } catch (err) {
        console.warn("Environment camera failed, trying fallback", err);
        // Fallback to any available video device if specific constraint fails
        stream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error("Camera error:", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError("Permission denied. Please allow camera access in your browser settings.");
      } else if (err.name === 'NotFoundError') {
        setError("No camera device found.");
      } else {
        setError("Could not access camera. Please ensure no other apps are using it.");
      }
    }
  };

  useEffect(() => {
    startCamera();

    return () => {
      // Cleanup: stop all tracks when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleRetry = () => {
    startCamera();
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsScanning(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const base64Image = canvas.toDataURL('image/jpeg').split(',')[1];
      
      try {
        const data = await analyzeSupplementImage(base64Image);
        
        // Stop stream before completing
        if (videoRef.current && videoRef.current.srcObject) {
           const stream = videoRef.current.srcObject as MediaStream;
           stream.getTracks().forEach(track => track.stop());
        }
        
        onScanComplete(data);
      } catch (err) {
        console.error(err);
        setError("Could not analyze image. Please ensure the product is well-lit and try again.");
        setIsScanning(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/70 to-transparent">
        <h2 className="text-white font-semibold text-lg">Scan Product</h2>
        <button onClick={onClose} className="text-white p-2 bg-white/20 rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors">
          <X size={24} />
        </button>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative flex items-center justify-center bg-gray-900">
        {!error ? (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Scanner Overlay */}
            <div className="relative border-2 border-emerald-500 rounded-lg w-64 h-64 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-emerald-400 -mt-1 -ml-1"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-emerald-400 -mt-1 -mr-1"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-emerald-400 -mb-1 -ml-1"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-emerald-400 -mb-1 -mr-1"></div>
                {isScanning && (
                   <div className="absolute inset-0 bg-emerald-500/20 animate-pulse"></div>
                )}
            </div>
            <p className="absolute bottom-32 text-white/80 text-sm font-medium z-10 bg-black/40 px-3 py-1 rounded-full pointer-events-none">
              Align product label within frame
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center max-w-sm animate-fade-in">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="text-red-500" size={32} />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Camera Issue</h3>
            <p className="text-gray-400 mb-6 text-sm">{error}</p>
            <div className="flex gap-3">
              <button onClick={onClose} className="px-5 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors text-sm font-medium">
                Cancel
              </button>
              <button onClick={handleRetry} className="px-5 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-2 text-sm font-medium">
                <RefreshCw size={16} /> Retry
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-black p-6 flex justify-center items-center pb-safe">
         <button 
           onClick={captureAndAnalyze}
           disabled={isScanning || !!error}
           className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-transparent hover:bg-white/10 active:scale-95 transition-all relative disabled:opacity-50 disabled:cursor-not-allowed"
           aria-label="Capture photo"
         >
           <div className={`w-16 h-16 rounded-full ${isScanning ? 'bg-emerald-500 animate-pulse' : 'bg-white'}`}></div>
         </button>
         <canvas ref={canvasRef} className="hidden" />
      </div>
      
      {isScanning && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-50">
          <Zap className="text-emerald-400 w-12 h-12 mb-4 animate-bounce" />
          <p className="text-white font-medium text-lg">Analyzing Supplement...</p>
          <p className="text-gray-400 text-sm mt-2">Checking ingredients & safety</p>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;