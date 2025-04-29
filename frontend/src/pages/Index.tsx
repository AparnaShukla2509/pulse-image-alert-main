import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ImageUploader from '@/components/ImageUploader';
import AnalysisResult, { AnalysisResultProps } from '@/components/AnalysisResult';
import HistoryList from '@/components/HistoryList';
import { HistoryItemData } from '@/components/HistoryItem';
import { apiService } from '@/services/apiService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Activity, UploadCloud, History, ChevronDown } from 'lucide-react';
const Index = () => {
  const { toast } = useToast();
  const [activeImage, setActiveImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultProps['result']>(null);
  const [activeTab, setActiveTab] = useState<string>('upload');
  const { data: historyItems = [] } = useQuery({
    queryKey: ['history'],
    queryFn: () => apiService.getHistoryItems(),
  });
  const handleImageUpload = (file: File) => {
    setActiveImage(file);
    setImagePreview(URL.createObjectURL(file));
    setAnalysisResult(null);
    toast({
      title: "Image uploaded",
      description: "Your ECG image has been uploaded successfully.",
    });
  };
  const handleAnalyzeImage = async () => {
    if (!activeImage) {
      toast({
        title: "No image selected",
        description: "Please upload an ECG image first.",
        variant: "destructive"
      });
      return;
    }
    try {
      setIsAnalyzing(true);
      const result = await apiService.analyzeEcg(activeImage);
      setAnalysisResult(result);
      if (imagePreview) {
        await apiService.saveAnalysisResult(result, imagePreview);
      }
      toast({
        title: "Analysis complete",
        description: `Detected: ${result.prediction} with ${result.confidence}% confidence.`,
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your ECG image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  const handleReset = () => {
    setActiveImage(null);
    setImagePreview(null);
    setAnalysisResult(null);
  };
  const handleSelectHistoryItem = (item: HistoryItemData) => {
    setAnalysisResult({
      prediction: item.prediction,
      confidence: item.confidence,
      risk: item.risk,
      details: [
        "This is a historical result.",
        "Detailed analysis information would be loaded here in a real application."
      ]
    });
    setImagePreview(item.thumbnailUrl);
    setActiveTab('upload');
  };
  useEffect(() => {
    if (activeImage && !isAnalyzing && !analysisResult) {
      handleAnalyzeImage();
    }
  }, [activeImage]);
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <section className="text-center mb-12">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
              <Heart className="h-6 w-6 text-medical-blue" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Cardiovascular Disease Detection
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Upload an ECG image and our AI will analyze it for signs of cardiovascular disease.
            </p>
          </section>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload" className="flex items-center justify-center">
                <UploadCloud className="h-4 w-4 mr-2" />
                ECG Analysis
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center justify-center">
                <History className="h-4 w-4 mr-2" />
                History
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-medical-blue" />
                    ECG Analysis
                  </CardTitle>
                  <CardDescription>
                    Upload an electrocardiogram (ECG) image for AI-powered analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ImageUploader onImageUpload={handleImageUpload} />         
                  {isAnalyzing || analysisResult ? (
                    <AnalysisResult 
                      isAnalyzing={isAnalyzing} 
                      result={analysisResult} 
                      onReset={handleReset}
                    />
                  ) : (
                    <div className="text-center text-gray-500 italic text-sm mt-4">
                      Analysis results will appear here after uploading an image.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="history">
              <HistoryList items={historyItems} onSelect={handleSelectHistoryItem} />
            </TabsContent>
          </Tabs>
          <div className="mt-12">
            <div className="flex items-center justify-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">How It Works</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">1. Upload ECG</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Upload an ECG image from your medical records or directly from medical devices.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">2. AI Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Our machine learning models analyze the ECG patterns to detect abnormalities.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">3. Get Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    View detailed results with confidence scores and risk assessments.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="mt-16 text-center">
            <div className="inline-flex items-center text-gray-400 mb-2">
              <span className="text-sm">Scroll down for more information</span>
              <ChevronDown className="h-4 w-4 ml-1" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
export default Index;