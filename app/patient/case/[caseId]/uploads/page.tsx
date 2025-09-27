'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  Image, 
  File, 
  CheckCircle, 
  AlertCircle,
  Download,
  Trash2,
  Eye,
  Calendar,
  User,
  MessageSquare
} from 'lucide-react'
import TopUtilityBar from '@/components/TopUtilityBar'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

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
  }
}

export default function UploadsPage() {
  const params = useParams()
  const router = useRouter()
  const caseId = params.caseId as string

  const [caseData, setCaseData] = useState<Case | null>(null)
  const [files, setFiles] = useState<CaseFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

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
          treatment:treatments(id, name, description)
        `)
        .eq('id', caseId)
        .single()

      if (error) throw error
      setCaseData(data)
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
      setError('Failed to load files')
      console.error('Error fetching files:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setError(null)

    try {
      const supabase = createClient()
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Get patient record
      const { data: patient } = await supabase
        .from('patients')
        .select('*')
        .eq('profile_id', user.id)
        .single()

      if (!patient) throw new Error('Patient record not found')

      // Upload each file
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}_${file.name}`
        const filePath = `${patient.id}/${fileName}`

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('patient_uploads')
          .upload(filePath, file)

        if (uploadError) {
          console.error('Upload error:', uploadError)
          throw new Error(`Upload failed: ${uploadError.message}`)
        }

        // Create database record
        const { error: dbError } = await supabase
          .from('case_files')
          .insert({
            case_id: caseId,
            owner_profile_id: user.id,
            path: filePath,
            mime_type: file.type,
            size_bytes: file.size
          })

        if (dbError) {
          console.error('Database error:', dbError)
          throw new Error(`Database error: ${dbError.message}`)
        }
      }

      setSuccess(`${files.length} file(s) uploaded successfully`)
      await fetchFiles() // Refresh file list
    } catch (err: any) {
      console.error('File upload error:', err)
      setError(err.message || 'Failed to upload files')
    } finally {
      setUploading(false)
      // Reset file input
      if (event.target) {
        event.target.value = ''
      }
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

  async function deleteFile(fileId: string) {
    if (!confirm('Are you sure you want to delete this file?')) return

    try {
      const supabase = createClient()
      
      // Get file info first
      const file = files.find(f => f.id === fileId)
      if (!file) return

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('patient_uploads')
        .remove([file.path])

      if (storageError) throw storageError

      // Delete from database
      const { error: dbError } = await supabase
        .from('case_files')
        .delete()
        .eq('id', fileId)

      if (dbError) throw dbError

      setSuccess('File deleted successfully')
      await fetchFiles() // Refresh file list
    } catch (err: any) {
      setError('Failed to delete file')
      console.error('Delete error:', err)
    }
  }

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (mimeType: string | null) => {
    if (!mimeType) return <File className="w-5 h-5" />
    
    if (mimeType.startsWith('image/')) return <Image className="w-5 h-5" />
    if (mimeType.includes('pdf') || mimeType.includes('document')) return <FileText className="w-5 h-5" />
    return <File className="w-5 h-5" />
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
            <Link href="/treatments">
              <Button variant="outline" icon={ArrowLeft}>
                Back to Treatments
              </Button>
            </Link>
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
            <Link href="/treatments">
              <Button variant="ghost" icon={ArrowLeft}>
                Back to Treatments
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
                    {caseData?.treatment && (
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold text-blue-900 mb-1">Treatment</h3>
                        <p className="text-blue-800">{caseData.treatment.name}</p>
                        {caseData.treatment.description && (
                          <p className="text-blue-700 text-sm mt-1">{caseData.treatment.description}</p>
                        )}
                      </div>
                    )}

                    {caseData?.patient_notes && (
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Your Notes
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

              {/* File Upload */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-bold text-slate-900">Upload Medical Documents</h2>
                  <p className="text-gray-600">Upload your medical records, test results, and other relevant documents</p>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.tiff,.dcm"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-900 mb-2">
                          {uploading ? 'Uploading files...' : 'Click to upload files'}
                        </p>
                        <p className="text-sm text-gray-500">
                          PDF, DOC, Images, DICOM files supported
                        </p>
                      </label>
                    </div>

                    {uploading && (
                      <div className="flex items-center justify-center gap-2 text-blue-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                        <span>Uploading files...</span>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>

              {/* Uploaded Files */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-bold text-slate-900">Uploaded Files ({files.length})</h2>
                </CardHeader>
                <CardBody>
                  {files.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No files uploaded yet</p>
                      <p className="text-sm">Upload your medical documents to get started</p>
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
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => downloadFile(file)}
                              icon={Eye}
                            >
                              View
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteFile(file.id)}
                              icon={Trash2}
                              className="text-red-600 hover:text-red-700"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
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

              {/* Next Steps */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-slate-900">What's Next?</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-600">1</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Upload Documents</p>
                        <p className="text-xs text-gray-600">Medical records, test results, images</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-gray-600">2</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Review by Medical Team</p>
                        <p className="text-xs text-gray-600">Our specialists will analyze your case</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-gray-600">3</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Receive Quote</p>
                        <p className="text-xs text-gray-600">Detailed treatment plan and pricing</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-gray-600">4</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Schedule Treatment</p>
                        <p className="text-xs text-gray-600">Book your appointment</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Support */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-slate-900">Need Help?</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full" size="sm">
                      Contact Support
                    </Button>
                    <Button variant="outline" className="w-full" size="sm">
                      View FAQ
                    </Button>
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
