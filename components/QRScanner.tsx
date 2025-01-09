import React, { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import { toast } from 'sonner';

interface QRScannerProps {
  onScan: (email: string) => void;
}

export function QRScanner({ onScan }: QRScannerProps) {
  const webcamRef = useRef<Webcam>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [lastScanAttempt, setLastScanAttempt] = useState<Date | null>(null);
  const [scanStatus, setScanStatus] = useState<'scanning' | 'detected' | 'error'>('scanning');
  const [detectedContent, setDetectedContent] = useState<string | null>(null);

  const capture = useCallback(() => {
    if (!isScanning) return;
    
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setLastScanAttempt(new Date());
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setScanStatus('error');
          toast.error('Failed to process camera feed');
          return;
        }

        ctx.drawImage(image, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          setScanStatus('detected');
          setDetectedContent(code.data);
          console.log('Detected content:', code.data);
          
          try {
            // Try to decode as base64
            const decodedEmail = atob(code.data);
            if (decodedEmail.includes('@')) {
              setIsScanning(false);
              onScan(decodedEmail.toLowerCase());
              toast.success(`Detected email: ${decodedEmail}`);
            } else {
              toast.error(`Detected content is not an email: ${decodedEmail}`);
              setScanStatus('scanning');
            }
          } catch (error) {
            // If base64 decode fails, check if the raw content is an email
            if (code.data.includes('@')) {
              setIsScanning(false);
              onScan(code.data.toLowerCase());
              toast.success(`Detected email: ${code.data}`);
            } else {
              toast.error(`Detected content: ${code.data}`);
              setScanStatus('scanning');
            }
          }
        } else {
          setDetectedContent(null);
          setScanStatus('scanning');
        }
      };
    }
  }, [onScan, isScanning]);

  // Scan every 500ms
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isScanning) {
      setScanStatus('scanning');
      interval = setInterval(capture, 500);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [capture, isScanning]);

  const videoConstraints = {
    width: 720,
    height: 720,
    facingMode: "environment"
  };

  const getBorderColor = () => {
    switch (scanStatus) {
      case 'detected':
        return 'border-green-500';
      case 'error':
        return 'border-red-500';
      default:
        return 'border-white';
    }
  };

  const getStatusText = () => {
    if (detectedContent) {
      return `Detected: ${detectedContent.slice(0, 30)}${detectedContent.length > 30 ? '...' : ''}`;
    }
    switch (scanStatus) {
      case 'detected':
        return 'QR Code Detected!';
      case 'error':
        return 'Scanner Error';
      default:
        return 'Scanning...';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="relative rounded-lg overflow-hidden bg-gray-100">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="w-full aspect-square object-cover"
          onUserMediaError={() => {
            setScanStatus('error');
            toast.error('Failed to access camera');
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div 
            className={`w-48 h-48 border-2 ${getBorderColor()} rounded-lg transition-colors duration-200`}
            style={{
              boxShadow: scanStatus === 'scanning' ? '0 0 0 2px rgba(255,255,255,0.5)' : 'none',
              animation: scanStatus === 'scanning' ? 'pulse 2s infinite' : 'none'
            }}
          />
          <div className="mt-4 px-4 py-2 bg-black bg-opacity-50 rounded-full">
            <p className="text-white text-sm font-medium">
              {getStatusText()}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center px-2">
        <p className="text-sm text-gray-500">
          {lastScanAttempt && `Last scan: ${lastScanAttempt.toLocaleTimeString()}`}
        </p>
        <button
          onClick={() => {
            setIsScanning(true);
            setScanStatus('scanning');
            setDetectedContent(null);
          }}
          className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Retry Scan
        </button>
      </div>

      {detectedContent && (
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Raw Content:</span> {detectedContent}
          </p>
        </div>
      )}

      <style jsx global>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255,255,255,0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(255,255,255,0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255,255,255,0);
          }
        }
      `}</style>
    </div>
  );
}
