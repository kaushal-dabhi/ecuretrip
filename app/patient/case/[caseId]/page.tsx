'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  DollarSign,
  MessageSquare,
  Upload,
  Eye,
  Download
} from 'lucide-react'
import TopUtilityBar from '@/components/TopUtilityBar'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

interface CaseDetails {
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
    currency: string | null
  }
}

interface CaseFile {
  id: string
  case_id: string
  path: string
  mime_type: string | null
  size_bytes: number | null
  created_at: string
}

interface Quote {
  id: string
  case_id: string
  total: number | null
  currency: string | null
  status: string
  created_at: string
  updated_at: string
}

export default function PatientCasePage() {
  const params = useParams()
  const caseId = params.caseId as string
  
  const [caseDetails, setCaseDetails] = useState<CaseDetails | null>(null)
  const [files, setFiles] = useState<CaseFile[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (caseId) {
      fetchCaseDetails()
    }
  }, [caseId])

  async function fetchCaseDetails() {
    try {
      const supabase = createClient()
      
      // Get case details with treatment info
      const { data: caseData, error: caseError } = await supabase
        .from('cases')
        .select(`
          *,
          treatment:treatments(id, name, description, base_price, currency)
        `)
        .eq('id', caseId)
        .single()

      if (caseError) throw caseError

      // Get case files
      const { data: filesData, error: filesError } = await supabase
        .from('case_files')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false })

      if (filesError) throw filesError

      // Get quotes for this case
      const { data: quotesData, error: quotesError } = await supabase
        .from('quotes')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false })

      if (quotesError) throw quotesError

      setCaseDetails(caseData)
      setFiles(filesData || [])
      setQuotes(quotesData || [])
    } catch (err: any) {
      setError(err.message || 'Failed to load case details')
      console.error('Error fetching case details:', err)
    } finally {
      setLoading(false)
    }
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Clock className="w-4 h-4" />
      case 'quoted': return <MessageSquare className="w-4 h-4" />
      case 'accepted': return <CheckCircle className="w-4 h-4" />
      case 'closed': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
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

  if (error || !caseDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopUtilityBar />
        <Navigation />
        <div className="pt-32 pb-16">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Case Not Found</h1>
              <p className="text-gray-600 mb-6">
                {error || 'The requested case could not be found.'}
              </p>
              <Link href="/patient/dashboard">
                <Button>Back to Dashboard</Button>
              </Link>
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

          {/* Case Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-slate-900">
                Case #{caseDetails.id.slice(-8)}
              </h1>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(caseDetails.status)}`}>
                {getStatusIcon(caseDetails.status)}
                {caseDetails.status}
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Created {new Date(caseDetails.created_at).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Updated {new Date(caseDetails.updated_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Treatment Information */}
              {caseDetails.treatment && (
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Treatment Information
                    </h2>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">
                          {caseDetails.treatment.name}
                        </h3>
                        <p className="text-gray-600">
                          {caseDetails.treatment.description}
                        </p>
                      </div>
                      {caseDetails.treatment.base_price && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="text-lg font-semibold text-green-600">
                            {caseDetails.treatment.currency} {caseDetails.treatment.base_price.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500">(Base Price)</span>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Patient Notes */}
              {caseDetails.patient_notes && (
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Your Notes
                    </h2>
                  </CardHeader>
                  <CardBody>
                    <p className="text-gray-700">{caseDetails.patient_notes}</p>
                  </CardBody>
                </Card>
              )}

              {/* Files */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      Medical Files ({files.length})
                    </h2>
                    <Link href={`/patient/case/${caseId}/uploads`}>
                      <Button size="sm" variant="outline">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Files
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardBody>
                  {files.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No files uploaded yet</p>
                      <Link href={`/patient/case/${caseId}/uploads`}>
                        <Button>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Your First File
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {files.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="font-medium text-slate-900">
                                {file.path.split('/').pop()}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatFileSize(file.size_bytes)} • {file.mime_type}
                              </p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
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
              {/* Quotes */}
              {quotes.length > 0 && (
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Quotes ({quotes.length})
                    </h3>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-3">
                      {quotes.map((quote) => (
                        <div key={quote.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-lg font-semibold text-green-600">
                              {quote.currency} {quote.total?.toLocaleString()}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              quote.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                              quote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {quote.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {new Date(quote.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <Link href="/patient/quotes">
                        <Button className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          View All Quotes
                        </Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-bold text-slate-900">Quick Actions</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-3">
                    <Link href={`/patient/case/${caseId}/uploads`}>
                      <Button className="w-full" variant="outline">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Files
                      </Button>
                    </Link>
                    {quotes.length > 0 && (
                      <Link href="/patient/quotes">
                        <Button className="w-full" variant="outline">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          View Quotes
                        </Button>
                      </Link>
                    )}
                    <Link href="/patient/dashboard">
                      <Button className="w-full" variant="outline">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                      </Button>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}