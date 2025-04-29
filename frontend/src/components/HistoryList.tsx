import React from 'react';
import HistoryItem, { HistoryItemData } from './HistoryItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
interface HistoryListProps {
  items: HistoryItemData[];
  onSelect: (item: HistoryItemData) => void;
}
const HistoryList: React.FC<HistoryListProps> = ({ items, onSelect }) => {
  if (!items.length) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-xl">Analysis History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>No analysis history yet.</p>
            <p className="text-sm mt-1">Analyzed ECGs will appear here.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-xl">Analysis History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item) => (
            <HistoryItem key={item.id} item={item} onSelect={onSelect} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
export default HistoryList;