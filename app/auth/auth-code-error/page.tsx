import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export default function AuthCodeError() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Authentication Error
        </h1>
        
        <p className="text-gray-600 mb-6">
          There was an error with your authentication link. This could be because:
        </p>
        
        <ul className="text-left text-sm text-gray-600 mb-6 space-y-2">
          <li>• The link has expired</li>
          <li>• The link has already been used</li>
          <li>• There was a network error</li>
        </ul>
        
        <div className="space-y-3">
          <Link 
            href="/start-case"
            className="w-full inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </Link>
          
          <Link 
            href="/"
            className="w-full inline-block px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
