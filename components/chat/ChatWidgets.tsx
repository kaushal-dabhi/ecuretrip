'use client';

import { ChatWidget } from '@/types/journey';
import { 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle, 
  ExternalLink, 
  Download,
  Calendar,
  DollarSign,
  User,
  Building
} from 'lucide-react';

interface ChatButtonProps {
  widget: Extract<ChatWidget, { type: 'button' }>;
  onAction: (action: string, payload?: any) => void;
}

export function ChatButton({ widget, onAction }: ChatButtonProps) {
  return (
    <Button
      onClick={() => onAction(widget.action, widget.payload)}
      className="w-full justify-start"
      variant="outline"
    >
      {widget.label}
    </Button>
  );
}

interface ChatCardProps {
  widget: Extract<ChatWidget, { type: 'card' }>;
}

export function ChatCard({ widget }: ChatCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{widget.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600">{widget.body}</p>
        {widget.metadata && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {Object.entries(widget.metadata).map(([key, value]) => (
                <Badge key={key} variant="secondary" className="text-xs">
                  {key}: {value}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ChatTableProps {
  widget: Extract<ChatWidget, { type: 'table' }>;
}

export function ChatTable({ widget }: ChatTableProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{widget.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                {widget.columns.map((column, index) => (
                  <th key={index} className="text-left py-2 px-3 font-medium text-slate-700">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {widget.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-gray-100 hover:bg-gray-50">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="py-2 px-3 text-slate-600">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

interface ChatInvoiceProps {
  widget: Extract<ChatWidget, { type: 'invoice' }>;
  onAction: (action: string, payload?: any) => void;
}

export function ChatInvoice({ widget, onAction }: ChatInvoiceProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Invoice #{widget.id}</CardTitle>
          <Badge className={getStatusColor(widget.status)}>
            {widget.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Total Amount:</span>
            <span className="font-semibold text-lg">
              {widget.currency} {widget.total.toLocaleString()}
            </span>
          </div>
          
          <div className="flex gap-2">
            {widget.url && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(widget.url, '_blank')}
                className="flex-1"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Invoice
              </Button>
            )}
            <Button
              variant="default"
              size="sm"
              onClick={() => onAction('PAY_INVOICE', { invoiceId: widget.id })}
              className="flex-1"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Pay Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ChatLinkProps {
  widget: Extract<ChatWidget, { type: 'link' }>;
}

export function ChatLink({ widget }: ChatLinkProps) {
  return (
    <Button
      variant="outline"
      className="w-full justify-start"
      onClick={() => window.open(widget.href, widget.external ? '_blank' : '_self')}
    >
      <ExternalLink className="w-4 h-4 mr-2" />
      {widget.label}
    </Button>
  );
}

interface ChatNoticeProps {
  widget: Extract<ChatWidget, { type: 'notice' }>;
  onAction: (action: string, payload?: any) => void;
}

export function ChatNotice({ widget, onAction }: ChatNoticeProps) {
  const getIcon = () => {
    switch (widget.kind) {
      case 'success': return <CheckCircle className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'danger': return <AlertCircle className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getColors = () => {
    switch (widget.kind) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'danger': return 'bg-red-50 border-red-200 text-red-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className={`w-full p-4 rounded-lg border ${getColors()}`}>
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          <p className="text-sm font-medium">{widget.text}</p>
          {widget.actions && (
            <div className="mt-3 flex gap-2">
              {widget.actions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => onAction(action.action, action.payload)}
                  className="text-xs"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ChatUploadProps {
  widget: Extract<ChatWidget, { type: 'upload' }>;
}

export function ChatUpload({ widget }: ChatUploadProps) {
  const getStatusIcon = () => {
    switch (widget.status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'processing': return <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-600" />;
      default: return <Calendar className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (widget.status) {
      case 'completed': return 'text-green-600';
      case 'processing': return 'text-blue-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div className="flex-1">
            <p className="text-sm font-medium">{widget.filename}</p>
            <p className={`text-xs ${getStatusColor()}`}>
              Status: {widget.status.charAt(0).toUpperCase() + widget.status.slice(1)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ChatSummaryProps {
  widget: Extract<ChatWidget, { type: 'summary' }>;
}

export function ChatSummary({ widget }: ChatSummaryProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{widget.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 mb-4">
          {widget.items.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <span className="text-sm text-slate-700">{item}</span>
            </li>
          ))}
        </ul>
        
        <div className="text-xs text-slate-500 border-t pt-3">
          <p className="italic">{widget.disclaimer}</p>
          {widget.source && (
            <p className="mt-1">Source: {widget.source}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface ChatDoctorMatchProps {
  widget: Extract<ChatWidget, { type: 'doctor_match' }>;
  onAction: (action: string, payload?: any) => void;
}

export function ChatDoctorMatch({ widget, onAction }: ChatDoctorMatchProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Recommended Specialists</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {widget.doctors.map((doctor, index) => (
            <div key={doctor.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-sm">{doctor.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {doctor.specialty}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <Building className="w-3 h-3" />
                    {doctor.hospital}
                  </span>
                  <span>Score: {doctor.score}%</span>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => onAction('SELECT_DOCTOR', { doctorId: doctor.id })}
              >
                Select
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface ChatAppointmentProps {
  widget: Extract<ChatWidget, { type: 'appointment' }>;
}

export function ChatAppointment({ widget }: ChatAppointmentProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Appointment Confirmed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">
              {widget.date} at {widget.time}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-green-600" />
            <span className="text-sm">{widget.doctor}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-purple-600" />
            <span className="text-sm">{widget.location}</span>
          </div>
          
          <div className="text-xs text-slate-500 border-t pt-3">
            Confirmation ID: {widget.confirmationId}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Main widget renderer
interface ChatWidgetRendererProps {
  widget: ChatWidget;
  onAction: (action: string, payload?: any) => void;
}

export function ChatWidgetRenderer({ widget, onAction }: ChatWidgetRendererProps) {
  switch (widget.type) {
    case 'button':
      return <ChatButton widget={widget} onAction={onAction} />;
    case 'card':
      return <ChatCard widget={widget} />;
    case 'table':
      return <ChatTable widget={widget} />;
    case 'invoice':
      return <ChatInvoice widget={widget} onAction={onAction} />;
    case 'link':
      return <ChatLink widget={widget} />;
    case 'notice':
      return <ChatNotice widget={widget} onAction={onAction} />;
    case 'upload':
      return <ChatUpload widget={widget} />;
    case 'summary':
      return <ChatSummary widget={widget} />;
    case 'doctor_match':
      return <ChatDoctorMatch widget={widget} onAction={onAction} />;
    case 'appointment':
      return <ChatAppointment widget={widget} />;
    default:
      return null;
  }
}
