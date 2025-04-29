import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
interface EcgViewerProps {
  imageUrl: string;
  onClose?: () => void;
}
const EcgViewer: React.FC<EcgViewerProps> = ({ imageUrl, onClose }) => {
  const [zoom, setZoom] = useState(1);
  const [isIdentifyingFeatures, setIsIdentifyingFeatures] = useState(false);
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 2.5));
  };
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };
  const resetZoom = () => {
    setZoom(1);
  };
  const toggleFeatureIdentification = () => {
    setIsIdentifyingFeatures(prev => !prev);
  };
  return (
    <Card className="w-full bg-white shadow-lg overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gray-100 p-2 flex items-center justify-between border-b">
          <div className="text-sm font-medium">ECG Viewer</div>
          <div className="flex space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={handleZoomIn}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom In</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>  
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={handleZoomOut}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom Out</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>           
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={resetZoom}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset Zoom</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={isIdentifyingFeatures ? "default" : "ghost"} 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={toggleFeatureIdentification}
                  >
                    <Heart className={`h-4 w-4 ${isIdentifyingFeatures ? "text-white" : ""}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Identify ECG Features</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="relative overflow-auto p-4 max-h-[500px]">
          <div 
            className="relative transition-transform"
            style={{ 
              transform: `scale(${zoom})`, 
              transformOrigin: 'center top',
              marginBottom: zoom > 1 ? `${(zoom - 1) * 100}%` : '0'
            }}
          >
            <img 
              src={imageUrl} 
              alt="ECG" 
              className="w-full object-contain"
            />
            {isIdentifyingFeatures && (
              <>
                {/* Lead indicators - would be positioned based on the actual ECG image */}
                <div className="absolute top-[27%] left-[27%] bg-blue-500/70 text-white text-xs px-1 rounded">
                  Lead I
                </div>
                <div className="absolute top-[27%] left-[45%] bg-blue-500/70 text-white text-xs px-1 rounded">
                  aVR
                </div>
                <div className="absolute top-[27%] left-[65%] bg-blue-500/70 text-white text-xs px-1 rounded">
                  V1
                </div>
                <div className="absolute top-[27%] left-[85%] bg-blue-500/70 text-white text-xs px-1 rounded">
                  V4
                </div>                
                { }
                <div className="absolute top-[24%] left-[10%] bg-green-500/70 text-white text-xs px-1 rounded">
                  P wave
                </div>               
                { }
                <div className="absolute top-[33%] left-[15%] bg-amber-500/70 text-white text-xs px-1 rounded">
                  QRS
                </div>                
                {}
                <div className="absolute top-[27%] left-[22%] bg-purple-500/70 text-white text-xs px-1 rounded">
                  T wave
                </div>
              </>
            )}
          </div>
        </div>       
        { }
        <div className="p-3 border-t text-xs text-gray-500 bg-gray-50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div>
              <span className="font-medium">ID:</span> 168590
            </div>
            <div>
              <span className="font-medium">Gender:</span> Male
            </div>
            <div>
              <span className="font-medium">Date:</span> 2020-08-05
            </div>
            <div>
              <span className="font-medium">Time:</span> 11:02:38 PM
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default EcgViewer;