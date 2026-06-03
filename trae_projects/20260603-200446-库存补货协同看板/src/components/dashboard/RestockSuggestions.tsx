import React, { useEffect, useRef } from 'react';
import { ShoppingCart, Calendar, Truck, CheckCircle, Link2, Eye } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { RestockSuggestion } from '../../data/types';
import { getPriorityColor, getPriorityText } from '../../utils/riskCalculator';

interface RestockSuggestionsProps {
  suggestions: RestockSuggestion[];
  onApprove?: (suggestion: RestockSuggestion) => void;
  linkedSkuId?: string | null;
  onSkuSelect?: (skuId: string) => void;
}

export const RestockSuggestions: React.FC<RestockSuggestionsProps> = ({
  suggestions,
  onApprove,
  linkedSkuId,
  onSkuSelect,
}) => {
  const suggestionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const sortedSuggestions = [...suggestions].sort((a, b) => {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  useEffect(() => {
    if (linkedSkuId) {
      const matchingSuggestion = sortedSuggestions.find(s => s.skuId === linkedSkuId);
      if (matchingSuggestion) {
        setTimeout(() => {
          const element = suggestionRefs.current[matchingSuggestion.id];
          const container = containerRef.current;
          if (element && container) {
            const containerRect = container.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();
            const offsetTop = elementRect.top - containerRect.top + container.scrollTop - 20;
            container.scrollTo({ top: offsetTop, behavior: 'smooth' });
          }
        }, 100);
      }
    }
  }, [linkedSkuId, sortedSuggestions]);

  const handleViewInRiskPanel = (suggestion: RestockSuggestion) => {
    onSkuSelect?.(suggestion.skuId);
  };

  return (
    <Card hover={false}>
      <CardHeader 
        title="补货建议" 
        subtitle={linkedSkuId ? `已联动选中: ${sortedSuggestions.find(s => s.skuId === linkedSkuId)?.skuName || ''}` : `共 ${suggestions.length} 条待处理建议，点击查看按钮可联动SKU面板`}
        action={
          <div className="flex items-center space-x-2">
            {linkedSkuId && (
              <Badge variant="info" className="flex items-center">
                <Link2 className="w-3 h-3 mr-1" />
                联动中
              </Badge>
            )}
            <Button variant="primary" size="sm">
              批量处理
            </Button>
          </div>
        }
      />

      <div ref={containerRef} className="space-y-3 max-h-80 overflow-y-auto">
        {sortedSuggestions.map((suggestion) => {
          const isUrgent = suggestion.priority === 'urgent';
          const isLinked = linkedSkuId === suggestion.skuId;
          
          return (
            <div
              key={suggestion.id}
              ref={(el) => { suggestionRefs.current[suggestion.id] = el; }}
              className={`p-4 rounded-lg border transition-all duration-300 ${
                isLinked
                  ? 'ring-2 ring-blue-500 ring-inset bg-blue-50/70 shadow-inner'
                  : isUrgent
                    ? 'border-red-200 bg-red-50/50 hover:border-red-300'
                    : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className={`font-semibold ${isLinked ? 'text-blue-700' : 'text-gray-800'}`}>
                      {suggestion.skuName}
                    </h4>
                    <Badge 
                      variant={suggestion.priority === 'urgent' ? 'danger' : suggestion.priority === 'high' ? 'warning' : 'info'}
                      pulse={isUrgent}
                    >
                      {getPriorityText(suggestion.priority)}
                    </Badge>
                    {isLinked && (
                      <Badge variant="info" className="flex items-center">
                        <Link2 className="w-3 h-3 mr-1" />
                        联动
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{suggestion.reason}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="flex items-center text-sm">
                  <ShoppingCart className="w-4 h-4 text-blue-500 mr-2" />
                  <span className="text-gray-600">建议补货:</span>
                  <span className={`font-bold ml-1 ${isLinked ? 'text-blue-600' : 'text-blue-600'}`}>
                    {suggestion.suggestedQuantity}件
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 text-emerald-500 mr-2" />
                  <span className="text-gray-600">预计到货:</span>
                  <span className="font-medium text-emerald-600 ml-1">
                    {suggestion.estimatedArrivalDate}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Truck className="w-4 h-4 text-amber-500 mr-2" />
                  <span className="text-gray-600 truncate">
                    {suggestion.supplierName}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  onClick={() => onApprove?.(suggestion)}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  确认补货
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleViewInRiskPanel(suggestion)}
                  className={isLinked ? 'ring-2 ring-blue-500 ring-inset' : ''}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  查看
                </Button>
                <Button variant="ghost" size="sm">
                  忽略
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default RestockSuggestions;
