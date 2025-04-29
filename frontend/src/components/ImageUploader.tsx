import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import EcgViewer from './EcgViewer';
interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}
const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isEcgReport, setIsEcgReport] = useState(false);
  const [useExampleEcg, setUseExampleEcg] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  const handleFile = (file: File) => {
    if (!file.type.match('image.*')) {
      alert('Please upload an image file');
      return;
    }
    const isLikelyEcgReport = file.name.toLowerCase().includes('ecg') || 
                             file.name.toLowerCase().includes('ekg') ||
                             file.size > 100000; 
    setIsEcgReport(isLikelyEcgReport);
    setUseExampleEcg(false);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    onImageUpload(file);
  };
  const clearImage = () => {
    setPreviewUrl(null);
    setIsEcgReport(false);
    setUseExampleEcg(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  const handleUseExampleEcg = async () => {
    try {
      const response = await fetch('/lovable-uploads/8f4ef712-426f-4d53-bf70-c375e6f9f38c.png');
      const blob = await response.blob();
      const file = new File([blob], "example-ecg.png", { type: 'image/png' });
      setIsEcgReport(true);
      setUseExampleEcg(true);
      setPreviewUrl('/lovable-uploads/8f4ef712-426f-4d53-bf70-c375e6f9f38c.png');
      onImageUpload(file);
    } catch (error) {
      console.error("Error loading example ECG:", error);
      alert("Failed to load example ECG image. Please try uploading your own image.");
    }
  };
  return (
    <div className="my-6">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-all",
          dragActive ? "border-medical-blue bg-blue-50" : "border-gray-300",
          previewUrl ? "p-3" : "p-10"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="relative w-full">
            <div className="absolute top-2 right-2 z-10">
              <Button 
                variant="destructive" 
                size="icon" 
                onClick={clearImage}
                className="h-8 w-8 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {isEcgReport ? (
              <EcgViewer imageUrl={previewUrl} />
            ) : (
              <div className="flex items-center justify-center bg-black/5 rounded-md overflow-hidden">
                <img 
                  src={previewUrl} 
                  alt="ECG Preview" 
                  className="max-h-[300px] object-contain"
                />
              </div>
            )}            
            <p className="mt-2 text-sm text-gray-500">Click the X to remove and upload a different image</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center mb-2 mx-auto">
                <Upload className="h-8 w-8 text-medical-blue" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Upload ECG Image</h3>
              <p className="text-sm text-gray-500 mt-1">Drag and drop your ECG image here or click to browse</p>
              <p className="text-xs text-gray-400 mt-1">Supports: JPG, PNG, GIF (max 5MB)</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                type="button" 
                onClick={triggerFileInput}
                className="mt-2"
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Select Image
              </Button>
              <Button 
                variant="secondary" 
                type="button" 
                onClick={handleUseExampleEcg}
                className="mt-2"
              >
                <FileText className="mr-2 h-4 w-4" />
                Use Example ECG
              </Button>
            </div>
          </>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};
export default ImageUploader;