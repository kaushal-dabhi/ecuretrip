'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, Image, File, Video, Phone, MoreVertical, Check, CheckCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  text: string
  sender: 'patient' | 'doctor'
  timestamp: Date
  type: 'text' | 'image' | 'file' | 'voice'
  status: 'sent' | 'delivered' | 'read'
  isTyping?: boolean
}

interface ChatInterfaceProps {
  onClose: () => void
}

export default function ChatInterface({ onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I have a few questions about my upcoming consultation.',
      sender: 'patient',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      type: 'text',
      status: 'read'
    },
    {
      id: '2',
      text: 'Hello! Of course, I\'d be happy to help. What would you like to know?',
      sender: 'doctor',
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      type: 'text',
      status: 'read'
    },
    {
      id: '3',
      text: 'What documents should I bring for the consultation?',
      sender: 'patient',
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
      type: 'text',
      status: 'read'
    },
    {
      id: '4',
      text: 'Please bring your medical reports, previous prescriptions, and any test results. Also, if you have any current medications, please list them.',
      sender: 'doctor',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      type: 'text',
      status: 'read'
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isAttaching, setIsAttaching] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'patient',
      timestamp: new Date(),
      type: 'text',
      status: 'sent'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
    setIsTyping(false)

    // Simulate doctor typing and response
    setTimeout(() => {
      setIsTyping(true)
    }, 1000)

    setTimeout(() => {
      setIsTyping(false)
      const doctorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Thank you for the information. I\'ll review it before our consultation.',
        sender: 'doctor',
        timestamp: new Date(),
        type: 'text',
        status: 'sent'
      }
      setMessages(prev => [...prev, doctorResponse])
    }, 3000)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const message: Message = {
        id: Date.now().toString(),
        text: `📎 ${file.name}`,
        sender: 'patient',
        timestamp: new Date(),
        type: 'file',
        status: 'sent'
      }
      setMessages(prev => [...prev, message])
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Check className="w-3 h-3 text-sand-400" />
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-blue-400" />
      case 'read':
        return <CheckCheck className="w-3 h-3 text-cyan-400" />
      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sand-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center text-white font-bold">
              D
            </div>
            <div>
              <h3 className="font-semibold text-night">Dr. Pritesh Shah</h3>
              <p className="text-sm text-sand-600">Cardiothoracic Surgery</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-sand-600 hover:text-oasis-600 hover:bg-sand-100 rounded-lg transition-colors">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 text-sand-600 hover:text-oasis-600 hover:bg-sand-100 rounded-lg transition-colors">
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 text-sand-600 hover:text-oasis-600 hover:bg-sand-100 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.sender === 'patient' 
                    ? 'bg-oasis-500 text-white rounded-br-md' 
                    : 'bg-sand-100 text-night rounded-bl-md'
                }`}>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <div className={`flex items-center justify-between mt-2 text-xs ${
                    message.sender === 'patient' ? 'text-oasis-100' : 'text-sand-500'
                  }`}>
                    <span>{formatTime(message.timestamp)}</span>
                    {message.sender === 'patient' && (
                      <span className="flex items-center space-x-1">
                        {getStatusIcon(message.status)}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-sand-100 text-night rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-sand-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-sand-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-sand-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-sand-500">Dr. Shah is typing...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-sand-200">
          <div className="flex items-center space-x-3">
            {/* Attachment Button */}
            <div className="relative">
              <button
                onClick={() => setIsAttaching(!isAttaching)}
                className="p-3 text-sand-600 hover:text-oasis-600 hover:bg-sand-100 rounded-lg transition-colors"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              
              {/* Attachment Menu */}
              <AnimatePresence>
                {isAttaching && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-sand-200 p-2"
                  >
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-sand-700 hover:bg-sand-100 rounded-md transition-colors"
                    >
                      <Image className="w-4 h-4" />
                      <span>Image</span>
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-sand-700 hover:bg-sand-100 rounded-md transition-colors"
                    >
                      <File className="w-4 h-4" />
                      <span>Document</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Message Input */}
            <div className="flex-1">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="w-full px-4 py-3 border border-sand-300 rounded-lg focus:ring-2 focus:ring-oasis-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Send Button */}
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="p-3 bg-oasis-500 text-white rounded-lg hover:bg-oasis-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
