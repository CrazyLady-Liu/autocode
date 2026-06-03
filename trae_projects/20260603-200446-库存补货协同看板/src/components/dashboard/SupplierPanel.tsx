import React, { useState } from 'react';
import { 
  Phone, Clock, CheckCircle, AlertTriangle, User, MessageSquare, 
  Mail, Calendar, Smartphone, Users, Package, ChevronDown, ChevronUp,
  ThumbsUp, Minus, ThumbsDown, Truck, AlertOctagon, Loader
} from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Supplier, CommunicationType, CommunicationResult, ShipmentStatus } from '../../data/types';
import { getSupplierStatusText } from '../../utils/riskCalculator';

interface SupplierPanelProps {
  suppliers: Supplier[];
}

const getCommunicationIcon = (type: CommunicationType) => {
  switch (type) {
    case 'call':
      return <Phone className="w-3 h-3" />;
    case 'email':
      return <Mail className="w-3 h-3" />;
    case 'meeting':
      return <Users className="w-3 h-3" />;
    case 'wechat':
      return <Smartphone className="w-3 h-3" />;
    default:
      return <MessageSquare className="w-3 h-3" />;
  }
};

const getCommunicationResultIcon = (result: CommunicationResult) => {
  switch (result) {
    case 'positive':
      return <ThumbsUp className="w-3 h-3 text-emerald-500" />;
    case 'neutral':
      return <Minus className="w-3 h-3 text-gray-500" />;
    case 'negative':
      return <ThumbsDown className="w-3 h-3 text-red-500" />;
    default:
      return <Minus className="w-3 h-3 text-gray-500" />;
  }
};

const getCommunicationResultText = (result: CommunicationResult) => {
  switch (result) {
    case 'positive':
      return '进展顺利';
    case 'neutral':
      return '进展一般';
    case 'negative':
      return '存在问题';
    default:
      return '未知';
  }
};

const getShipmentStatusText = (status: ShipmentStatus) => {
  switch (status) {
    case 'pending':
      return '待发货';
    case 'shipped':
      return '已发货';
    case 'in-transit':
      return '运输中';
    case 'delivered':
      return '已送达';
    case 'delayed':
      return '已延迟';
    default:
      return '未知';
  }
};

const getShipmentStatusIcon = (status: ShipmentStatus) => {
  switch (status) {
    case 'pending':
      return <Clock className="w-3 h-3" />;
    case 'shipped':
      return <Package className="w-3 h-3" />;
    case 'in-transit':
      return <Truck className="w-3 h-3" />;
    case 'delivered':
      return <CheckCircle className="w-3 h-3" />;
    case 'delayed':
      return <AlertOctagon className="w-3 h-3" />;
    default:
      return <Loader className="w-3 h-3" />;
  }
};

const getShipmentStatusColor = (status: ShipmentStatus) => {
  switch (status) {
    case 'pending':
      return 'text-amber-600';
    case 'shipped':
      return 'text-blue-600';
    case 'in-transit':
      return 'text-blue-600';
    case 'delivered':
      return 'text-emerald-600';
    case 'delayed':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

export const SupplierPanel: React.FC<SupplierPanelProps> = ({ suppliers }) => {
  const [expandedSupplier, setExpandedSupplier] = useState<string | null>(null);
  
  const activeSuppliers = suppliers.filter(s => s.status === 'active');
  const avgOnTimeRate = Math.round(
    activeSuppliers.reduce((sum, s) => sum + s.onTimeRate, 0) / (activeSuppliers.length || 1)
  );
  
  const totalInTransit = suppliers.reduce((sum, s) => 
    sum + (s.inTransitShipments?.filter(ship => 
      ship.status === 'in-transit' || ship.status === 'shipped'
    ).length || 0), 0
  );

  const toggleExpand = (supplierId: string) => {
    setExpandedSupplier(expandedSupplier === supplierId ? null : supplierId);
  };

  return (
    <Card hover={false}>
      <CardHeader 
        title="供应商协同" 
        subtitle={`${activeSuppliers.length}/${suppliers.length} 家活跃 · ${totalInTransit} 单在途`}
      />

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-emerald-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-emerald-600">{avgOnTimeRate}%</p>
          <p className="text-xs text-gray-500">平均准时交付率</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {Math.round(suppliers.reduce((sum, s) => sum + s.averageDeliveryTime, 0) / suppliers.length)}天
          </p>
          <p className="text-xs text-gray-500">平均交付周期</p>
        </div>
      </div>

      <div className="space-y-3 max-h-56 overflow-y-auto">
        {suppliers.map((supplier) => {
          const isExpanded = expandedSupplier === supplier.id;
          const hasInTransit = supplier.inTransitShipments && supplier.inTransitShipments.length > 0;
          const activeShipments = supplier.inTransitShipments?.filter(s => 
            s.status !== 'delivered'
          ) || [];

          return (
            <div
              key={supplier.id}
              className={`rounded-lg border transition-all duration-200 ${
                supplier.status === 'delayed' 
                  ? 'border-amber-200 bg-amber-50/30' 
                  : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              <div 
                className="p-3 cursor-pointer"
                onClick={() => toggleExpand(supplier.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      supplier.status === 'active' ? 'bg-emerald-100' :
                      supplier.status === 'delayed' ? 'bg-amber-100' : 'bg-gray-100'
                    }`}>
                      <User className={`w-4 h-4 ${
                        supplier.status === 'active' ? 'text-emerald-600' :
                        supplier.status === 'delayed' ? 'text-amber-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 text-sm">{supplier.name}</h4>
                      <p className="text-xs text-gray-500">
                        {supplier.contactPerson} · {supplier.contactPhone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={supplier.status === 'active' ? 'success' : supplier.status === 'delayed' ? 'warning' : 'default'}
                    >
                      {getSupplierStatusText(supplier.status)}
                    </Badge>
                    {supplier.status === 'delayed' && (
                      <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse" />
                    )}
                  </div>
                </div>

                {supplier.lastCommunication && (
                  <div className="mb-2 p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span className={`p-1 rounded ${
                          supplier.lastCommunication.type === 'wechat' ? 'bg-green-100 text-green-600' :
                          supplier.lastCommunication.type === 'call' ? 'bg-blue-100 text-blue-600' :
                          supplier.lastCommunication.type === 'email' ? 'bg-purple-100 text-purple-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {getCommunicationIcon(supplier.lastCommunication.type)}
                        </span>
                        <span className="text-xs font-medium text-gray-700">
                          {supplier.lastCommunication.subject}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getCommunicationResultIcon(supplier.lastCommunication.result)}
                        <span className="text-xs text-gray-500">
                          {getCommunicationResultText(supplier.lastCommunication.result)}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {supplier.lastCommunication.content}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-400">
                        {supplier.lastCommunication.date}
                      </span>
                      <span className="text-xs text-gray-400">
                        by {supplier.lastCommunication.operator}
                      </span>
                    </div>
                  </div>
                )}

                {hasInTransit && activeShipments.length > 0 && (
                  <div className="mb-2">
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>在途订单 ({activeShipments.length})</span>
                    </div>
                    <div className="space-y-1">
                      {activeShipments.slice(0, 2).map(shipment => (
                        <div key={shipment.id} className="flex items-center justify-between p-2 bg-blue-50 rounded text-xs">
                          <div className="flex items-center space-x-2">
                            <span className={getShipmentStatusColor(shipment.status)}>
                              {getShipmentStatusIcon(shipment.status)}
                            </span>
                            <span className="text-gray-700 truncate max-w-28">{shipment.skuName}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-500">{shipment.quantity}件</span>
                            <span className={`font-medium ${getShipmentStatusColor(shipment.status)}`}>
                              {getShipmentStatusText(shipment.status)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-xs">
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-3 h-3 mr-1 text-blue-500" />
                      <span>{supplier.averageDeliveryTime}天</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <CheckCircle className="w-3 h-3 mr-1 text-emerald-500" />
                      <span>{supplier.onTimeRate}%</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      className="flex items-center text-xs text-blue-600 hover:text-blue-700 p-1 rounded hover:bg-blue-50"
                      onClick={(e) => { e.stopPropagation(); }}
                    >
                      <Phone className="w-3 h-3 mr-1" />
                      联系
                    </button>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`} />
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="px-3 pb-3 border-t border-gray-100 bg-gray-50/50">
                  <div className="pt-3">
                    {hasInTransit && activeShipments.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-700 mb-2 flex items-center">
                          <Truck className="w-3 h-3 mr-2" />
                          详细到货计划
                        </p>
                        <div className="space-y-2">
                          {activeShipments.map(shipment => (
                            <div key={shipment.id} className="bg-white rounded-lg p-3 border border-gray-100">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-800">
                                  {shipment.skuName}
                                </span>
                                <Badge variant={
                                  shipment.status === 'delayed' ? 'danger' :
                                  shipment.status === 'delivered' ? 'success' :
                                  shipment.status === 'pending' ? 'warning' : 'info'
                                }>
                                  {getShipmentStatusText(shipment.status)}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                <div>
                                  <p className="text-gray-500">数量</p>
                                  <p className="font-medium text-gray-800">{shipment.quantity}件</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">发货日期</p>
                                  <p className="font-medium text-gray-800">{shipment.shippedDate}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">预计到货</p>
                                  <p className={`font-medium ${
                                    shipment.status === 'delayed' ? 'text-red-600' : 'text-emerald-600'
                                  }`}>
                                    {shipment.estimatedArrivalDate}
                                  </p>
                                </div>
                              </div>
                              {shipment.trackingNumber && (
                                <div className="mt-2 pt-2 border-t border-gray-100">
                                  <p className="text-xs text-gray-500">
                                    物流单号: <span className="font-mono text-gray-700">{shipment.trackingNumber}</span>
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className="text-xs text-gray-500 mr-1">支持品类:</span>
                      {supplier.supportedCategories.map((cat) => (
                        <span key={cat} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default SupplierPanel;
