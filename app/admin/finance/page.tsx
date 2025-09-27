'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { 
  ArrowLeft, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calculator,
  FileText,
  Calendar,
  User,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import TopUtilityBar from '@/components/TopUtilityBar'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { FinanceNote } from '@/types/database'

interface FinanceNoteWithDetails extends FinanceNote {
  case?: {
    id: string
    patient_id: string
    treatment_id: string | null
    status: string
    patient_notes: string | null
    treatment?: {
      id: string
      name: string
    }
  }
  quote?: {
    id: string
    total: number | null
    currency: string | null
  }
}

export default function AdminFinancePage() {
  const [financeNotes, setFinanceNotes] = useState<FinanceNoteWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalProfit: 0,
    pendingPayments: 0,
    completedPayments: 0
  })

  useEffect(() => {
    fetchFinanceNotes()
  }, [])

  async function fetchFinanceNotes() {
    try {
      const supabase = createClient()
      
      // Get finance notes with related data
      const { data, error } = await supabase
        .from('finance_notes')
        .select(`
          *,
          case:cases(id, patient_id, treatment_id, status, patient_notes, treatment:treatments(id, name)),
          quote:quotes(id, total, currency)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      setFinanceNotes(data || [])
      
      // Calculate stats
      const totalRevenue = data?.reduce((sum, note) => sum + (note.x_amount || 0), 0) || 0
      const totalProfit = data?.reduce((sum, note) => sum + (note.z_profit || 0), 0) || 0
      const pendingPayments = data?.filter(note => note.status === 'pending').length || 0
      const completedPayments = data?.filter(note => note.status === 'completed').length || 0

      setStats({
        totalRevenue,
        totalProfit,
        pendingPayments,
        completedPayments
      })
    } catch (err: any) {
      setError('Failed to load finance data')
      console.error('Error fetching finance notes:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'refunded': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'refunded': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopUtilityBar />
        <Navigation />
        <div className="pt-32 pb-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">Loading finance data...</p>
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
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-8">
            <Button variant="ghost" icon={ArrowLeft}>
              Back to Admin
            </Button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Finance Dashboard</h1>
              <p className="text-gray-600">Track revenue, profits, and payment status</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardBody className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  ₹{stats.totalRevenue.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Revenue</div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  ₹{stats.totalProfit.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Profit</div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {stats.pendingPayments}
                </div>
                <div className="text-sm text-gray-600">Pending Payments</div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {stats.completedPayments}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </CardBody>
            </Card>
          </div>

          {/* Finance Notes Table */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Financial Records
              </h2>
            </CardHeader>
            <CardBody>
              {financeNotes.length === 0 ? (
                <div className="text-center py-12">
                  <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Financial Records</h3>
                  <p className="text-gray-600">
                    No finance notes have been created yet.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Case</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Treatment</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-900">X Amount</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-900">A Fee</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-900">Y Transfer</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-900">Z Profit</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {financeNotes.map((note) => (
                        <tr key={note.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="text-sm font-medium text-gray-900">
                              #{note.case_id.slice(-8)}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-gray-600">
                              {note.case?.treatment?.name || 'Unknown'}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="text-sm font-medium text-gray-900">
                              ₹{note.x_amount.toLocaleString()}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="text-sm text-blue-600">
                              ₹{(note.a_fee || 0).toLocaleString()}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="text-sm text-green-600">
                              ₹{(note.y_transfer || 0).toLocaleString()}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="text-sm font-medium text-green-600">
                              ₹{(note.z_profit || 0).toLocaleString()}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(note.status)}`}>
                              {getStatusIcon(note.status)}
                              {note.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-gray-500">
                              {new Date(note.created_at).toLocaleDateString()}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Financial Summary */}
          {financeNotes.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-slate-900">Revenue Breakdown</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Revenue (X):</span>
                      <span className="font-semibold">₹{stats.totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-600">Platform Fees (A):</span>
                      <span className="font-semibold text-blue-600">₹{stats.totalProfit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-600">Doctor Transfers (Y):</span>
                      <span className="font-semibold text-green-600">₹{(stats.totalRevenue - stats.totalProfit).toLocaleString()}</span>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-slate-900">Payment Status</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-yellow-600">Pending:</span>
                      <span className="font-semibold">{stats.pendingPayments}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-600">Completed:</span>
                      <span className="font-semibold">{stats.completedPayments}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Transactions:</span>
                      <span className="font-semibold">{financeNotes.length}</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
