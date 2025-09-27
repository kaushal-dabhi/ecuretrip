'use client';

import { ChatWidget } from '@/types/oncology';
import { useState } from 'react';

interface WidgetProps {
  widget: ChatWidget;
  onAction: (action: string, payload?: any) => void;
}

export function ChatWidgetRenderer({ widget, onAction }: WidgetProps) {
  switch (widget.type) {
    case 'button':
      return (
        <button
          onClick={() => onAction(widget.action, widget.payload)}
          className="px-4 py-2 bg-[#145263] text-white rounded-lg hover:bg-[#4794BE] transition-colors text-sm font-medium"
        >
          {widget.label}
        </button>
      );

    case 'card':
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-2">{widget.title}</h3>
          <p className="text-slate-700 text-sm">{widget.body}</p>
        </div>
      );

    case 'table':
      return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="font-semibold text-slate-900">{widget.title}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {widget.columns.map((column, index) => (
                    <th key={index} className="px-4 py-2 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {widget.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-2 text-sm text-slate-900">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    case 'form':
      return <FormWidget widget={widget} onAction={onAction} />;

    case 'invoice':
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-slate-900">Invoice #{widget.id}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              widget.status === 'paid' ? 'bg-green-100 text-green-800' :
              widget.status === 'issued' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {widget.status.toUpperCase()}
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mb-3">
            {widget.currency} {widget.total.toLocaleString()}
          </div>
          {widget.url && (
            <a
              href={widget.url}
              className="inline-block px-4 py-2 bg-[#145263] text-white rounded-lg hover:bg-[#4794BE] transition-colors text-sm font-medium"
            >
              View Invoice
            </a>
          )}
        </div>
      );

    case 'link':
      return (
        <a
          href={widget.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-[#83B990] text-white rounded-lg hover:bg-[#8EBF8C] transition-colors text-sm font-medium"
        >
          {widget.label}
        </a>
      );

    case 'notice':
      return (
        <div className={`p-4 rounded-lg border ${
          widget.kind === 'danger' ? 'bg-red-50 border-red-200 text-red-800' :
          widget.kind === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
          'bg-green-50 border-green-200 text-green-800'
        }`}>
          <p className="text-sm font-medium">{widget.text}</p>
        </div>
      );

    case 'dicom':
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-slate-900 mb-3">DICOM Viewer</h3>
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <a
              href={widget.ohifUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#6F96E1] text-white rounded-lg hover:bg-[#4794BE] transition-colors text-sm font-medium"
            >
              Open DICOM Viewer
            </a>
          </div>
          <p className="text-xs text-slate-600 mt-2">Study UID: {widget.studyUID}</p>
        </div>
      );

    default:
      return null;
  }
}

function FormWidget({ widget, onAction }: { widget: Extract<ChatWidget, { type: 'form' }>, onAction: (action: string, payload?: any) => void }) {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAction(widget.submitAction, formData);
  };

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="font-semibold text-slate-900 mb-4">{widget.title}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {widget.fields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {field.label}
            </label>
            {field.type === 'select' ? (
              <select
                value={formData[field.key] || ''}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#145263] focus:border-transparent"
              >
                <option value="">Select...</option>
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : field.type === 'number' ? (
              <input
                type="number"
                value={formData[field.key] || ''}
                onChange={(e) => handleInputChange(field.key, parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#145263] focus:border-transparent"
              />
            ) : (
              <input
                type="text"
                value={formData[field.key] || ''}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#145263] focus:border-transparent"
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-[#145263] text-white rounded-lg hover:bg-[#4794BE] transition-colors text-sm font-medium"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
