import React from 'react';
import { format } from 'date-fns';
import { CheckCircle, AlertTriangle } from 'lucide-react';
export interface HistoryItemData {
  id: string;
  date: Date;
  prediction: string;
  confidence: number;
  risk: 'low' | 'medium' | 'high';
  thumbnailUrl: string;
}
interface HistoryItemProps {
  item: HistoryItemData;
  onSelect: (item: HistoryItemData) => void;
}
const HistoryItem: React.FC<HistoryItemProps> = ({ item, onSelect }) => {
  const getRiskIcon = () => {
    if (item.risk === 'low') {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (item.risk === 'medium') {
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    } else {
      return <AlertTriangle className="h-5 w-5 text-medical-red" />;
    }
  };
  return (
    <div 
      className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={() => onSelect(item)}
    >
      <div className="h-16 w-16 overflow-hidden rounded-md border bg-gray-100 mr-4 flex-shrink-0">
        <img 
          src={item.thumbnailUrl} 
          alt="ECG Thumbnail" 
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2">
          {getRiskIcon()}
          <h4 className="font-medium text-gray-900 truncate">{item.prediction}</h4>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {format(item.date, 'MMM d, yyyy • h:mm a')}
        </p>
      </div>
      <div className="ml-4 flex-shrink-0">
        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
          {item.confidence}%
        </span>
      </div>
    </div>
  );
};
export default HistoryItem;