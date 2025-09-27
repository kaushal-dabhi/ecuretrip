'use client'

import { useState } from 'react'
import { CreditCard, Building2, Smartphone, Lock, Shield, CheckCircle } from 'lucide-react'

interface PaymentFormProps {
  amount: number
  currency: string
  description: string
  onSuccess: (paymentId: string) => void
  onError: (error: string) => void
}

export default function PaymentForm({ amount, currency, description, onSuccess, onError }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank_transfer' | 'upi'>('card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
    bankAccount: '',
    ifscCode: '',
    accountHolder: ''
  })

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, American Express'
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      icon: Building2,
      description: 'Direct bank transfer'
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: Smartphone,
      description: 'Google Pay, PhonePe, Paytm'
    }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    if (paymentMethod === 'card') {
      if (!formData.cardNumber || !formData.cardHolder || !formData.expiryDate || !formData.cvv) {
        return 'Please fill in all card details'
      }
      if (formData.cardNumber.length < 16) {
        return 'Please enter a valid card number'
      }
      if (formData.cvv.length < 3) {
        return 'Please enter a valid CVV'
      }
    } else if (paymentMethod === 'upi') {
      if (!formData.upiId) {
        return 'Please enter your UPI ID'
      }
    } else if (paymentMethod === 'bank_transfer') {
      if (!formData.bankAccount || !formData.ifscCode || !formData.accountHolder) {
        return 'Please fill in all bank details'
      }
    }
    return null
  }

  const processPayment = async () => {
    const validationError = validateForm()
    if (validationError) {
      onError(validationError)
      return
    }

    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Generate a mock payment ID
      const paymentId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // In a real application, you would:
      // 1. Send payment details to your payment gateway (Stripe, Razorpay, etc.)
      // 2. Handle the response from the payment gateway
      // 3. Update your database with the payment status
      // 4. Send confirmation emails/SMS

      onSuccess(paymentId)
    } catch {
      onError('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Payment Method Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-night mb-4">Choose Payment Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setPaymentMethod(method.id as 'card' | 'bank_transfer' | 'upi')}
              className={`p-4 border-2 rounded-lg text-left transition-all duration-200 ${
                paymentMethod === method.id
                  ? 'border-oasis-500 bg-oasis-50'
                  : 'border-sand-200 hover:border-sand-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  paymentMethod === method.id ? 'bg-oasis-500 text-white' : 'bg-sand-100 text-sand-600'
                }`}>
                  <method.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium text-night">{method.name}</div>
                  <div className="text-sm text-sand-600">{method.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Payment Form */}
      <div className="card">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-night mb-2">Payment Details</h3>
          <div className="bg-sand-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-sand-600">Amount to Pay</span>
              <span className="text-2xl font-bold text-oasis-600">
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: currency,
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(amount)}
              </span>
            </div>
            <div className="text-sm text-sand-600 mt-1">{description}</div>
          </div>
        </div>

        {/* Card Payment Form */}
        {paymentMethod === 'card' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-night mb-2">
                Card Number
              </label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className="input-field"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-night mb-2">
                  Card Holder Name
                </label>
                <input
                  type="text"
                  name="cardHolder"
                  value={formData.cardHolder}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-night mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  maxLength={5}
                  className="input-field"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-night mb-2">
                CVV
              </label>
              <input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleInputChange}
                placeholder="123"
                maxLength={4}
                className="input-field"
              />
            </div>
          </div>
        )}

        {/* UPI Payment Form */}
        {paymentMethod === 'upi' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-night mb-2">
                UPI ID
              </label>
              <input
                type="text"
                name="upiId"
                value={formData.upiId}
                onChange={handleInputChange}
                placeholder="username@upi"
                className="input-field"
              />
            </div>
            <div className="bg-sand-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-sm text-sand-600">
                <Smartphone className="w-4 h-4" />
                <span>You will receive a payment request on your UPI app</span>
              </div>
            </div>
          </div>
        )}

        {/* Bank Transfer Form */}
        {paymentMethod === 'bank_transfer' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-night mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  name="bankAccount"
                  value={formData.bankAccount}
                  onChange={handleInputChange}
                  placeholder="1234567890"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-night mb-2">
                  IFSC Code
                </label>
                <input
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleInputChange}
                  placeholder="SBIN0001234"
                  className="input-field"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-night mb-2">
                Account Holder Name
              </label>
              <input
                type="text"
                name="accountHolder"
                value={formData.accountHolder}
                onChange={handleInputChange}
                placeholder="Account Holder Name"
                className="input-field"
              />
            </div>
            <div className="bg-sand-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-sm text-sand-600">
                <Building2 className="w-4 h-4" />
                <span>You will receive bank transfer details after confirmation</span>
              </div>
            </div>
          </div>
        )}

        {/* Security Features */}
        <div className="mt-6 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-cyan-500 mt-0.5" />
            <div className="text-sm text-cyan-800">
              <div className="font-medium mb-1">Secure Payment</div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>256-bit SSL encryption</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>PCI DSS compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Your data is protected</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <div className="mt-6">
          <button
            onClick={processPayment}
            disabled={isProcessing}
            className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing Payment...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Lock className="w-5 h-5" />
                <span>Pay Securely</span>
              </div>
            )}
          </button>
        </div>

        {/* Additional Information */}
        <div className="mt-4 text-center">
          <p className="text-xs text-sand-500">
            By proceeding, you agree to our{' '}
            <a href="/terms" className="text-oasis-500 hover:text-oasis-600">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-oasis-500 hover:text-oasis-600">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
