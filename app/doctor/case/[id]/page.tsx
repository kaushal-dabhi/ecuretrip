'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { 
  ArrowLeft, 
  User, 
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Download,
  Eye,
  Send,
  DollarSign,
  Save
} from 'lucide-react'
import TopUtilityBar from '@/components/TopUtilityBar'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import AuthGuard from '@/components/AuthGuard'

interface CaseFile {
  id: string
  case_id: string
  owner_profile_id: string
  path: string
  mime_type: string | null
  size_bytes: number | null
  created_at: string
}

interface Case {
  id: string
  patient_id: string
  treatment_id: string | null
  status: string
  patient_notes: string | null
  created_at: string
  updated_at: string
  treatment?: {
    id: string
    name: string
    description: string | null
    base_price: number | null
    currency: string
  }
  patient?: {
    id: string
    profile_id: string
    profile?: {
      id: string
      full_name: string | null
      email: string | null
    }
  }
  quotes?: Array<{
    id: string
    total: number | null
    status: string
    created_at: string
  }>
}

export default function DoctorCasePage() {
  const params = useParams()
  const router = useRouter()
  const caseId = params.id as string

  const [caseData, setCaseData] = useState<Case | null>(null)
  const [files, setFiles] = useState<CaseFile[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Quote form state
  const [quoteAmount, setQuoteAmount] = useState('')
  const [quoteNotes, setQuoteNotes] = useState('')

  useEffect(() => {
    if (caseId) {
      fetchCaseData()
      fetchFiles()
    }
  }, [caseId])

  async function fetchCaseData() {
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('cases')
        .select(`
          *,
          treatment:treatments(id, name, description, base_price, currency),
          patient:patients(id, profile_id, profile:profiles(id, full_name, email)),
          quotes(id, total, status, created_at)
        `)
        .eq('id', caseId)
        .single()

      if (error) throw error
      setCaseData(data)
      
      // Pre-fill quote amount with base price if available
      if (data.treatment?.base_price) {
        setQuoteAmount(data.treatment.base_price.toString())
      }
    } catch (err: any) {
      setError('Failed to load case data')
      console.error('Error fetching case:', err)
    }
  }

  async function fetchFiles() {
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('case_files')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setFiles(data || [])
    } catch (err: any) {
      console.error('Error fetching files:', err)
    } finally {
      setLoading(false)
    }
  }

  async function sendQuote() {
    if (!quoteAmount.trim()) {
      setError('Please enter a quote amount')
      return
    }

    const amount = parseFloat(quoteAmount)
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid quote amount')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const supabase = createClient()
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Create quote
      const { error: quoteError } = await supabase
        .from('quotes')
        .insert({
          case_id: caseId,
          prepared_by: user.id,
          total: amount,
          status: 'sent'
        })

      if (quoteError) throw quoteError

      // Update case status to 'quoted'
      const { error: caseError } = await supabase
        .from('cases')
        .update({ 
          status: 'quoted',
          updated_at: new Date().toISOString()
        })
        .eq('id', caseId)

      if (caseError) throw caseError

      setSuccess('Quote sent successfully!')
      await fetchCaseData() // Refresh case data
      
      // Clear form
      setQuoteAmount('')
      setQuoteNotes('')
      
    } catch (err: any) {
      setError(err.message || 'Failed to send quote')
    } finally {
      setSaving(false)
    }
  }

  async function downloadFile(file: CaseFile) {
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase.storage
        .from('patient_uploads')
        .createSignedUrl(file.path, 60) // 60 seconds

      if (error) throw error

      // Open download link
      window.open(data.signedUrl, '_blank')
    } catch (err: any) {
      setError('Failed to download file')
      console.error('Download error:', err)
    }
  }

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (mimeType: string | null) => {
    if (!mimeType) return <FileText className="w-5 h-5" />
    
    if (mimeType.startsWith('image/')) return <Eye className="w-5 h-5" />
    if (mimeType.includes('pdf') || mimeType.includes('document')) return <FileText className="w-5 h-5" />
    return <FileText className="w-5 h-5" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'quoted': return 'bg-yellow-100 text-yellow-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
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
              <p className="text-lg text-gray-600">Loading case details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error && !caseData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopUtilityBar />
        <Navigation />
        <div className="pt-32 pb-16">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <p><strong>Error:</strong> {error}</p>
            </div>
            <Link href="/doctor/dashboard">
              <Button variant="outline" icon={ArrowLeft}>
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AuthGuard requiredRole="doctor">
      <div className="min-h-screen bg-gray-50">
        <TopUtilityBar />
        <Navigation />
        
        <div className="pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-8">
            <Link href="/doctor/dashboard">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Case Information */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-slate-900">Case #{caseData?.id.slice(-8)}</h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(caseData?.status || '')}`}>
                      {caseData?.status}
                    </span>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    {/* Patient Info */}
                    {caseData?.patient?.profile && (
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold text-blue-900 mb-1 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Patient Information
                        </h3>
                        <p className="text-blue-800 font-medium">{caseData.patient.profile.full_name || 'Anonymous'}</p>
                        <p className="text-blue-700 text-sm">{caseData.patient.profile.email}</p>
                      </div>
                    )}

                    {/* Treatment Info */}
                    {caseData?.treatment && (
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h3 className="font-semibold text-green-900 mb-1">Treatment</h3>
                        <p className="text-green-800 font-medium">{caseData.treatment.name}</p>
                        {caseData.treatment.description && (
                          <p className="text-green-700 text-sm mt-1">{caseData.treatment.description}</p>
                        )}
                        {caseData.treatment.base_price && (
                          <p className="text-green-700 text-sm mt-1">
                            Base Price: ₹{caseData.treatment.base_price.toLocaleString()}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Patient Notes */}
                    {caseData?.patient_notes && (
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Patient Notes
                        </h3>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{caseData.patient_notes}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Created {new Date(caseData?.created_at || '').toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Medical Files */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-bold text-slate-900">Medical Documents ({files.length})</h2>
                </CardHeader>
                <CardBody>
                  {files.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No files uploaded yet</p>
                      <p className="text-sm">Patient will upload medical documents</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {files.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {getFileIcon(file.mime_type)}
                            <div>
                              <p className="font-medium text-gray-900">
                                {file.path.split('/').pop()?.split('_').slice(1).join('_') || 'Unknown file'}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatFileSize(file.size_bytes)} • {new Date(file.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadFile(file)}
                            icon={Download}
                          >
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Send Quote */}
              {caseData?.status === 'new' && (
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Send Quote
                    </h3>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quote Amount (₹)
                        </label>
                        <Input
                          type="number"
                          value={quoteAmount}
                          onChange={(e) => setQuoteAmount(e.target.value)}
                          placeholder="Enter quote amount"
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Notes (Optional)
                        </label>
                        <textarea
                          value={quoteNotes}
                          onChange={(e) => setQuoteNotes(e.target.value)}
                          placeholder="Add any notes for the patient..."
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          rows={3}
                        />
                      </div>

                      <Button
                        onClick={sendQuote}
                        loading={saving}
                        className="w-full"
                        icon={Send}
                      >
                        Send Quote
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Quote History */}
              {caseData?.quotes && caseData.quotes.length > 0 && (
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-slate-900">Quote History</h3>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-3">
                      {caseData.quotes.map((quote, index) => (
                        <div key={quote.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Quote #{index + 1}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              quote.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                              quote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {quote.status}
                            </span>
                          </div>
                          <div className="text-lg font-bold text-green-600">
                            ₹{quote.total?.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(quote.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Case Status */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-slate-900">Case Status</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(caseData?.status || '')}`}>
                        {caseData?.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Files Uploaded</span>
                      <span className="font-medium">{files.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Created</span>
                      <span className="text-sm">{new Date(caseData?.created_at || '').toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>

        <Footer />
      </div>
    </AuthGuard>
  )
}
