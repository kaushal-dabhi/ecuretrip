'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage, ChatWidget } from '@/types/journey';
import { ChatWidgetRenderer } from './ChatWidgets';
import { Send, Mic, Paperclip, Loader2 } from 'lucide-react';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  onAction: (action: string, payload?: any) => void;
  busy?: boolean;
  error?: string;
  className?: string;
}

export default function ChatPanel({
  messages,
  onSend,
  onAction,
  busy = false,
  error,
  className = ''
}: ChatPanelProps) {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = () => {
    if (inputText.trim() && !busy) {
      onSend(inputText.trim());
      setInputText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAction = (action: string, payload?: any) => {
    onAction(action, payload);
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (message: ChatMessage, index: number) => {
    const isUser = message.type === 'text' && index % 2 === 0; // Simple heuristic for demo

    if (message.type === 'text') {
      return (
        <div
          key={index}
          className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
        >
          <div
            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              isUser
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-slate-900'
            }`}
          >
            <p className="text-sm">{message.text}</p>
            <p className={`text-xs mt-1 ${
              isUser ? 'text-blue-100' : 'text-slate-500'
            }`}>
              {formatTime(message.timestamp)}
            </p>
          </div>
        </div>
      );
    }

    if (message.type === 'widgets') {
      return (
        <div key={index} className="flex justify-start mb-4">
          <div className="max-w-md lg:max-w-lg">
            <div className="space-y-3">
              {message.items.map((widget, widgetIndex) => (
                <ChatWidgetRenderer
                  key={widgetIndex}
                  widget={widget}
                  onAction={handleAction}
                />
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {formatTime(message.timestamp)}
            </p>
          </div>
        </div>
      );
    }

    if (message.type === 'mixed') {
      return (
        <div key={index} className="flex justify-start mb-4">
          <div className="max-w-md lg:max-w-lg">
            <div className="bg-gray-100 text-slate-900 px-4 py-2 rounded-lg mb-3">
              <p className="text-sm">{message.text}</p>
            </div>
            <div className="space-y-3">
              {message.widgets.map((widget, widgetIndex) => (
                <ChatWidgetRenderer
                  key={widgetIndex}
                  widget={widget}
                  onAction={handleAction}
                />
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {formatTime(message.timestamp)}
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col h-96 lg:h-[500px] ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h3 className="font-semibold text-slate-900">AI Assistant</h3>
          <p className="text-xs text-slate-600">Powered by medical AI</p>
        </div>
        <div className="flex items-center gap-2">
          {busy && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-slate-500 py-8">
            <div className="mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Send className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h4 className="font-medium text-slate-700 mb-2">Welcome to your AI Assistant</h4>
            <p className="text-sm text-slate-600">
              I can help you with your medical journey. Ask me anything about your case, 
              upload documents, or get assistance with appointments and billing.
            </p>
          </div>
        ) : (
          messages.map((message, index) => renderMessage(message, index))
        )}
        
        {error && (
          <div className="flex justify-start mb-4">
            <div className="max-w-md bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded-lg">
              <p className="text-sm">Error: {error}</p>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <button
            className="flex-shrink-0 p-2 border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={() => {
              // TODO: Implement file upload
              console.log('File upload clicked');
            }}
          >
            <Paperclip className="w-4 h-4" />
          </button>
          
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={busy}
              className="w-full pr-12 h-10 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            <button
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={() => {
                // TODO: Implement voice recording
                setIsRecording(!isRecording);
              }}
            >
              <Mic className={`w-4 h-4 ${isRecording ? 'text-red-600' : ''}`} />
            </button>
          </div>
          
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || busy}
            className="flex-shrink-0 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        {/* Suggested actions */}
        {messages.length === 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              className="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={() => onAction('UPLOAD_REPORT_START')}
            >
              Upload Report
            </button>
            <button
              className="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={() => onAction('MATCH_DOCTORS')}
            >
              Find Doctors
            </button>
            <button
              className="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={() => onAction('BUILD_QUOTE')}
            >
              Get Quote
            </button>
            <button
              className="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={() => onAction('BOOK_APPOINTMENT')}
            >
              Book Appointment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
