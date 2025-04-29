import React from 'react';
import { CheckCircle, AlertTriangle, HelpCircle, Activity, Clock, Heart, Stethoscope } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { getEcgConditionByName } from '@/data/ecgConditions';
export interface AnalysisResultProps {
  isAnalyzing: boolean;
  result: {
    prediction: string | null;
    confidence: number | null;
    risk: 'low' | 'medium' | 'high' | null;
    details: string[] | null;
  } | null;
  onReset: () => void;
}
const AnalysisResult: React.FC<AnalysisResultProps> = ({ isAnalyzing, result, onReset }) => {
  if (isAnalyzing) {
    return (
      <Card className="w-full mt-6">
        <CardHeader>
          <CardTitle className="text-center">Analyzing ECG Image</CardTitle>
          <CardDescription className="text-center">
            Our AI model is processing your ECG image. This may take a few moments...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center pb-6">
          <div className="w-full max-w-md mb-4">
            <Progress value={65} className="h-2" />
          </div>
          <div className="pulse h-8 w-8 rounded-full bg-medical-blue/20 flex items-center justify-center">
            <div className="h-4 w-4 rounded-full bg-medical-blue"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  if (!result || !result.prediction) {
    return null;
  }
  const conditionDetails = getEcgConditionByName(result.prediction);
  const getStatusIcon = () => {
    if (result.risk === 'low') {
      return <CheckCircle className="h-12 w-12 text-green-500" />;
    } else if (result.risk === 'medium') {
      return <AlertTriangle className="h-12 w-12 text-amber-500" />;
    } else if (result.risk === 'high') {
      return <AlertTriangle className="h-12 w-12 text-medical-red" />;
    }
    return <HelpCircle className="h-12 w-12 text-gray-400" />;
  };
  const getStatusColor = () => {
    if (result.risk === 'low') return 'bg-green-50 border-green-200';
    if (result.risk === 'medium') return 'bg-amber-50 border-amber-200';
    if (result.risk === 'high') return 'bg-red-50 border-red-200';
    return 'bg-gray-50 border-gray-200';
  };
  const getStatusTextColor = () => {
    if (result.risk === 'low') return 'text-green-700';
    if (result.risk === 'medium') return 'text-amber-700';
    if (result.risk === 'high') return 'text-red-700';
    return 'text-gray-700';
  };
  const getRiskBadge = () => {
    if (result.risk === 'low') return <Badge className="bg-green-500">Low Risk</Badge>;
    if (result.risk === 'medium') return <Badge className="bg-amber-500">Medium Risk</Badge>;
    if (result.risk === 'high') return <Badge className="bg-red-500">High Risk</Badge>;
    return <Badge variant="outline">Unknown Risk</Badge>;
  };
  return (
    <Card className={`w-full mt-6 ${getStatusColor()}`}>
      <CardHeader>
        <div className="flex flex-col items-center">
          {getStatusIcon()}
          <div className="flex items-center gap-2 mt-4">
            <CardTitle className={getStatusTextColor()}>
              {result.prediction}
            </CardTitle>
            {getRiskBadge()}
          </div>
          <CardDescription className="text-center mt-1">
            Confidence: {result.confidence}%
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-1">Risk Level</h4>
            <div className="flex h-2 overflow-hidden rounded bg-gray-200">
              <div 
                className={
                  result.risk === 'low' 
                    ? 'bg-green-500 w-1/3' 
                    : result.risk === 'medium' 
                      ? 'bg-amber-500 w-2/3' 
                      : 'bg-red-500 w-full'
                }
              ></div>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>
          {conditionDetails && conditionDetails.description && (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Heart className="h-4 w-4 mr-1" />
                Condition Description
              </h4>
              <p className="text-sm text-gray-700">{conditionDetails.description}</p>
            </div>
          )}
          {result.details && result.details.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Activity className="h-4 w-4 mr-1" />
                ECG Findings
              </h4>
              <ul className="space-y-1 text-sm">
                {result.details.map((detail, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {conditionDetails && conditionDetails.treatment && (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Stethoscope className="h-4 w-4 mr-1" />
                Recommended Management
              </h4>
              <ul className="space-y-1 text-sm">
                {conditionDetails.treatment.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}  
          <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
            <Clock className="h-5 w-5 text-gray-400 mr-3" />
            <div className="text-sm">
              <p className="font-medium text-gray-700">Analysis timestamp</p>
              <p className="text-gray-500">{new Date().toLocaleString()}</p>
            </div>
          </div>
          <div className="text-xs text-gray-500 italic">
            <p>Note: This analysis is for demonstration purposes only and should not be used for clinical diagnosis.</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={onReset} variant="outline">
          Analyze Another Image
        </Button>
      </CardFooter>
    </Card>
  );
};
export default AnalysisResult;