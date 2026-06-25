'use client'
import { useQuery } from '@tanstack/react-query'
import { CreditCard } from 'lucide-react'
import axiosSecure from '@/lib/axios'
import RoleGuard from '@/components/dashboard/RoleGuard'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

function TransactionsContent() {
  const { data: transactions = [], isLoading } = useQuery({ queryKey: ['transactions'], queryFn: async () => (await axiosSecure.get('/api/payments/transactions')).data })
  const total = transactions.reduce((sum, t) => sum + t.amount, 0)
  if (isLoading) return <LoadingSpinner fullPage={false} />
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white mb-1">Transactions</h1>
          <p className="text-gray-500 text-sm">All Stripe payment records across the platform.</p>
        </div>
        <div className="card px-5 py-3 text-right">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Total Revenue</p>
          <p className="text-2xl font-black text-neon">${total.toFixed(2)}</p>
        </div>
      </div>
      {transactions.length === 0 ? (
        <div className="card p-12 text-center"><CreditCard className="w-12 h-12 text-gray-600 mx-auto mb-4" /><p className="text-gray-500">No transactions yet.</p></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-dark-border">{['User Email', 'Class', 'Amount', 'Date', 'Transaction ID'].map(h => <th key={h} className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3.5">{h}</th>)}</tr></thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t._id} className="table-row">
                    <td className="px-5 py-4 text-gray-300">{t.userEmail}</td>
                    <td className="px-5 py-4 text-gray-400">{t.className || '—'}</td>
                    <td className="px-5 py-4 text-neon font-semibold">${t.amount}</td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4"><span className="text-xs text-gray-600 font-mono bg-dark-card2 px-2 py-0.5 rounded">{t.transactionId?.substring(0, 20)}…</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
export default function TransactionsPage() {
  return <RoleGuard roles={['admin']}><TransactionsContent /></RoleGuard>
}
