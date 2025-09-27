'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Eye, Download, ZoomIn, ZoomOut, RotateCw, Settings } from 'lucide-react';

interface DICOMViewerProps {
  studyId: string;
  imageId: string;
  imageUrl: string;
  metadata?: any;
}

export default function DICOMViewer({ studyId, imageId, imageUrl, metadata }: DICOMViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(1);
  const [contrast, setContrast] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadImage();
  }, [imageUrl]);

  const loadImage = async () => {
    try {
      setLoading(true);
      setError(null);

      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            // Set canvas size
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Apply transformations
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.scale(zoom, zoom);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
            
            // Apply brightness and contrast
            ctx.filter = `brightness(${brightness}) contrast(${contrast})`;
            
            // Draw image
            ctx.drawImage(img, 0, 0);
            ctx.restore();
          }
        }
        setLoading(false);
      };
      
      img.onerror = () => {
        setError('Failed to load DICOM image');
        setLoading(false);
      };
      
      img.src = imageUrl;
    } catch (err) {
      setError('Error loading image');
      setLoading(false);
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.1));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setBrightness(1);
    setContrast(1);
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `dicom-${studyId}-${imageId}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading DICOM image...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <div className="text-center">
          <Eye className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 px-4 py-2 border-b flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-gray-200 rounded"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-gray-200 rounded"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={handleRotate}
            className="p-2 hover:bg-gray-200 rounded"
            title="Rotate"
          >
            <RotateCw className="h-4 w-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 hover:bg-gray-200 rounded"
            title="Reset"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Brightness:</span>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={brightness}
              onChange={(e) => setBrightness(parseFloat(e.target.value))}
              className="w-20"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Contrast:</span>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={contrast}
              onChange={(e) => setContrast(parseFloat(e.target.value))}
              className="w-20"
            />
          </div>
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-gray-200 rounded"
            title="Download"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Image Display */}
      <div className="p-4 bg-black">
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-96 object-contain"
            style={{ cursor: 'crosshair' }}
          />
        </div>
      </div>

      {/* Metadata */}
      {metadata && (
        <div className="px-4 py-3 bg-gray-50 border-t">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Image Metadata</h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div>Rows: {metadata.rows}</div>
            <div>Columns: {metadata.columns}</div>
            <div>Bits: {metadata.bitsAllocated}</div>
            <div>Type: {metadata.photometricInterpretation}</div>
          </div>
        </div>
      )}
    </div>
  );
}
