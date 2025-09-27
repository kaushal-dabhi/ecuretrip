'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { 
  ArrowLeft, 
  CheckCircle,
  AlertCircle,
  Calendar,
  MessageSquare,
  FileText,
  User,
  DollarSign,
  Clock,
  Eye
} from 'lucide-react'
import TopUtilityBar from '@/components/TopUtilityBar'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

interface Quote {
  id: string
  case_id: string
  prepared_by: string | null
  currency: string
  total: number | null
  status: string
  created_at: string
  updated_at: string
  case?: {
    id: string
    patient_id: string
    treatment_id: string | null
    status: string
    patient_notes: string | null
    treatment?: {
      id: string
      name: string
      description: string | null
    }
  }
  doctor?: {
    id: string
    full_name: string | null
    email: string | null
  }
}

export default function PatientQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [acceptedQuote, setAcceptedQuote] = useState<Quote | null>(null)

  useEffect(() => {
    fetchQuotes()
  }, [])

  async function fetchQuotes() {
    try {
      const supabase = createClient()
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('Please sign in to view quotes')
        return
      }

      // Get patient record
      const { data: patient } = await supabase
        .from('patients')
        .select('*')
        .eq('profile_id', user.id)
        .single()

      if (!patient) {
        setError('Patient record not found')
        return
      }

      // Get quotes for patient's cases
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          case:cases(id, patient_id, treatment_id, status, patient_notes, treatment:treatments(id, name, description)),
          doctor:profiles(id, full_name, email)
        `)
        .eq('case.patient_id', patient.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setQuotes(data || [])
    } catch (err: any) {
      setError('Failed to load quotes')
      console.error('Error fetching quotes:', err)
    } finally {
      setLoading(false)
    }
  }

  async function acceptQuote(quoteId: string, caseId: string) {
    setProcessing(quoteId)
    setError(null)

    try {
      const supabase = createClient()
      
      // Get the quote details for finance calculation
      const { data: quoteData } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', quoteId)
        .single()

      if (!quoteData) throw new Error('Quote not found')

      // Update quote status to accepted
      const { error: quoteError } = await supabase
        .from('quotes')
        .update({ 
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('id', quoteId)

      if (quoteError) throw quoteError

      // Update case status to accepted
      const { error: caseError } = await supabase
        .from('cases')
        .update({ 
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('id', caseId)

      if (caseError) throw caseError

      // Create finance note with breakdown (15% platform fee)
      const xAmount = quoteData.total || 0
      const aFee = Math.round(xAmount * 0.15) // 15% platform fee
      const yTransfer = xAmount - aFee
      const zProfit = aFee

      const { error: financeError } = await supabase
        .from('finance_notes')
        .insert({
          case_id: caseId,
          quote_id: quoteId,
          x_amount: xAmount,
          a_fee: aFee,
          y_transfer: yTransfer,
          z_profit: zProfit,
          currency: quoteData.currency || 'INR',
          status: 'pending',
          payment_method: 'payment_link_pending',
          created_at: new Date().toISOString()
        })

      if (financeError) throw financeError

      // Show payment modal
      setAcceptedQuote(quoteData)
      setShowPaymentModal(true)
      await fetchQuotes() // Refresh quotes
      
    } catch (err: any) {
      setError(err.message || 'Failed to accept quote')
    } finally {
      setProcessing(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'sent': return 'bg-blue-100 text-blue-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <Clock className="w-4 h-4" />
      case 'accepted': return <CheckCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopUtilityBar />
        <Navigation />
        <div className="pt-32 pb-16">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">Loading quotes...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopUtilityBar />
      <Navigation />
      
      <div className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-8">
            <Link href="/patient/dashboard">
              <Button variant="ghost" icon={ArrowLeft}>
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          )}

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">My Quotes</h1>
              <p className="text-gray-600">Review and accept quotes from medical professionals</p>
            </div>
          </div>

          {quotes.length === 0 ? (
            <Card>
              <CardBody className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Quotes Yet</h3>
                <p className="text-gray-600 mb-6">
                  You haven't received any quotes yet. Create a case to get started.
                </p>
                <Link href="/treatments">
                  <Button size="lg">
                    Browse Treatments
                  </Button>
                </Link>
              </CardBody>
            </Card>
          ) : (
            <div className="space-y-6">
              {quotes.map((quote) => (
                <Card key={quote.id} className="hover:shadow-lg transition-shadow">
                  <CardBody>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <h3 className="text-xl font-bold text-slate-900">
                            Quote #{quote.id.slice(-8)}
                          </h3>
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(quote.status)}`}>
                            {getStatusIcon(quote.status)}
                            {quote.status}
                          </span>
                        </div>

                        {/* Case Information */}
                        {quote.case && (
                          <div className="mb-4">
                            <h4 className="font-semibold text-slate-900 mb-1">Case #{quote.case.id.slice(-8)}</h4>
                            {quote.case.treatment && (
                              <p className="text-gray-600">{quote.case.treatment.name}</p>
                            )}
                            {quote.case.patient_notes && (
                              <p className="text-gray-500 text-sm mt-1">{quote.case.patient_notes}</p>
                            )}
                          </div>
                        )}

                        {/* Doctor Information */}
                        {quote.doctor && (
                          <div className="mb-4">
                            <h4 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                              <User className="w-4 h-4" />
                              Doctor
                            </h4>
                            <p className="text-gray-600">{quote.doctor.full_name || 'Anonymous Doctor'}</p>
                            <p className="text-gray-500 text-sm">{quote.doctor.email}</p>
                          </div>
                        )}

                        {/* Quote Amount */}
                        <div className="mb-4">
                          <h4 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            Quote Amount
                          </h4>
                          <div className="text-2xl font-bold text-green-600">
                            ₹{quote.total?.toLocaleString() || 'TBD'}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Received {new Date(quote.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-6">
                        <Link href={`/patient/case/${quote.case?.id}/uploads`}>
                          <Button variant="outline" size="sm" icon={Eye}>
                            View Case
                          </Button>
                        </Link>
                        
                        {quote.status === 'sent' && (
                          <Button
                            onClick={() => acceptQuote(quote.id, quote.case_id)}
                            loading={processing === quote.id}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            icon={CheckCircle}
                          >
                            Accept Quote
                          </Button>
                        )}
                        
                        {quote.status === 'accepted' && (
                          <div className="text-center">
                            <div className="text-green-600 font-medium text-sm mb-1">✓ Accepted</div>
                            <div className="text-xs text-gray-500">
                              {new Date(quote.updated_at).toLocaleDateString()}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}

          {/* Quick Stats */}
          {quotes.length > 0 && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardBody className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{quotes.length}</div>
                  <div className="text-sm text-gray-600">Total Quotes</div>
                </CardBody>
              </Card>
              <Card>
                <CardBody className="text-center">
                  <div className="text-2xl font-bold text-yellow-600 mb-1">
                    {quotes.filter(q => q.status === 'sent').length}
                  </div>
                  <div className="text-sm text-gray-600">Pending Review</div>
                </CardBody>
              </Card>
              <Card>
                <CardBody className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {quotes.filter(q => q.status === 'accepted').length}
                  </div>
                  <div className="text-sm text-gray-600">Accepted</div>
                </CardBody>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && acceptedQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">Quote Accepted!</h3>
              <p className="text-gray-600 mb-6">
                Your quote has been accepted. Payment link will be sent to your email shortly.
              </p>

              {/* Financial Breakdown */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h4 className="font-semibold text-gray-900 mb-3">Payment Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Amount (X):</span>
                    <span className="font-medium">₹{acceptedQuote.total?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee (A):</span>
                    <span className="font-medium">₹{Math.round((acceptedQuote.total || 0) * 0.15).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Doctor Transfer (Y):</span>
                    <span className="font-medium">₹{Math.round((acceptedQuote.total || 0) * 0.85).toLocaleString()}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>You Pay:</span>
                    <span className="text-green-600">₹{acceptedQuote.total?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => setShowPaymentModal(false)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Continue
                </Button>
                <p className="text-xs text-gray-500">
                  A payment link will be sent to your registered email address within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
