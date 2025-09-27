'use client'

import { useState, useEffect } from 'react'
import { Bell, X, CheckCircle, AlertCircle, Info, Clock, DollarSign, Calendar, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Notification {
  id: string
  type: 'success' | 'warning' | 'info' | 'error'
  title: string
  message: string
  timestamp: Date
  read: boolean
  action?: {
    label: string
    onClick: () => void
  }
  category: 'appointment' | 'payment' | 'system' | 'message'
}

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Appointment Confirmed',
      message: 'Your consultation with Dr. Pritesh Shah has been confirmed for tomorrow at 10:00 AM.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
      category: 'appointment',
      action: {
        label: 'View Details',
        onClick: () => console.log('View appointment details')
      }
    },
    {
      id: '2',
      type: 'info',
      title: 'Payment Received',
      message: 'Payment of ₹2,500 for consultation has been successfully processed.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      read: false,
      category: 'payment',
      action: {
        label: 'Download Receipt',
        onClick: () => console.log('Download receipt')
      }
    },
    {
      id: '3',
      type: 'warning',
      title: 'Appointment Reminder',
      message: 'You have an upcoming appointment in 2 hours. Please prepare your documents.',
      timestamp: new Date(Date.now() - 1000 * 60 * 90),
      read: true,
      category: 'appointment'
    },
    {
      id: '4',
      type: 'info',
      title: 'New Message',
      message: 'Dr. Gaurav Tiwari sent you a message regarding your treatment plan.',
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      read: false,
      category: 'message',
      action: {
        label: 'Reply',
        onClick: () => console.log('Open chat')
      }
    }
  ])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length)
  }, [notifications])

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getNotificationIcon = (type: string, category: string) => {
    if (category === 'appointment') return <Calendar className="w-5 h-5" />
    if (category === 'payment') return <DollarSign className="w-5 h-5" />
    if (category === 'message') return <MessageCircle className="w-5 h-5" />
    
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />
      case 'warning':
        return <AlertCircle className="w-5 h-5" />
      case 'error':
        return <AlertCircle className="w-5 h-5" />
      default:
        return <Info className="w-5 h-5" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-cyan-500 bg-cyan-100 border-cyan-200'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'error':
        return 'text-red-600 bg-red-100 border-red-200'
      default:
        return 'text-blue-600 bg-blue-100 border-blue-200'
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-sand-600 hover:text-oasis-600 hover:bg-sand-100 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute right-0 top-12 w-96 bg-white rounded-2xl shadow-2xl border border-sand-200 z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-sand-200">
              <h3 className="font-semibold text-night">Notifications</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-oasis-600 hover:text-oasis-700 font-medium"
                >
                  Mark all read
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-sand-600 hover:text-sand-700 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-sand-500">
                  <Bell className="w-12 h-12 mx-auto mb-3 text-sand-300" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="p-2">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`p-3 rounded-lg border mb-2 transition-all duration-200 ${
                        notification.read 
                          ? 'bg-sand-50 border-sand-200' 
                          : 'bg-white border-sand-300 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {/* Icon */}
                        <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                          {getNotificationIcon(notification.type, notification.category)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-night text-sm mb-1">
                              {notification.title}
                            </h4>
                            <button
                              onClick={() => removeNotification(notification.id)}
                              className="p-1 text-sand-400 hover:text-sand-600 rounded transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          
                          <p className="text-sm text-sand-600 mb-2 leading-relaxed">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-sand-500 flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                            
                            {notification.action && (
                              <button
                                onClick={() => {
                                  notification.action?.onClick()
                                  markAsRead(notification.id)
                                }}
                                className="text-xs text-oasis-600 hover:text-oasis-700 font-medium"
                              >
                                {notification.action.label}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Unread Indicator */}
                      {!notification.read && (
                        <div className="w-2 h-2 bg-oasis-500 rounded-full mt-2 ml-auto"></div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-sand-200 bg-sand-50 rounded-b-2xl">
                <button
                  onClick={() => console.log('View all notifications')}
                  className="w-full text-center text-sm text-oasis-600 hover:text-oasis-700 font-medium"
                >
                  View All Notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
