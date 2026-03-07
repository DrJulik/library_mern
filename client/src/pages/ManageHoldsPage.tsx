import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/layouts/Layout';
import holdService from '@/services/holdService';
import { Hold, HoldStatus } from '@/types';
import { getApiErrorMessage } from '@/services/api';

type FilterStatus = 'all' | HoldStatus;

export default function ManageHoldsPage() {
  const [holds, setHolds] = useState<Hold[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('pending');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchHolds = async () => {
    setLoading(true);
    setError(null);
    try {
      const status = filter === 'all' ? undefined : filter;
      const res = await holdService.getAllHolds(status);
      setHolds(res.holds ?? []);
    } catch (err) {
      setError(getApiErrorMessage(err));
      setHolds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolds();
  }, [filter]);

  const handleApprove = async (holdId: string) => {
    setActionLoading(holdId);
    setError(null);
    try {
      await holdService.approveHold(holdId);
      await fetchHolds();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (holdId: string) => {
    setActionLoading(holdId);
    setError(null);
    try {
      await holdService.rejectHold(holdId);
      await fetchHolds();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  };

  const userName = (h: Hold) =>
    typeof h.user === 'object' && h.user ? (h.user as { name?: string }).name : '—';
  const userEmail = (h: Hold) =>
    typeof h.user === 'object' && h.user ? (h.user as { email?: string }).email : '—';
  const bookTitle = (h: Hold) =>
    typeof h.book === 'object' && h.book ? (h.book as { title?: string }).title : '—';
  const bookAuthor = (h: Hold) =>
    typeof h.book === 'object' && h.book ? (h.book as { author?: string }).author : '—';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Manage Holds</h1>
          <Link
            to="/admin"
            className="text-library-600 hover:text-library-700 font-medium"
          >
            ← Back to Admin
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          {(['pending', 'approved', 'fulfilled', 'cancelled', 'all'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === s
                  ? 'bg-library-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-library-600" />
          </div>
        ) : holds.length === 0 ? (
          <p className="text-gray-600 py-8">No holds found.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Book
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Date
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {holds.map((h) => (
                  <tr key={h._id}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{userName(h)}</div>
                      <div className="text-sm text-gray-500">{userEmail(h)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{bookTitle(h)}</div>
                      <div className="text-sm text-gray-500">{bookAuthor(h)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          h.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : h.status === 'approved'
                              ? 'bg-blue-100 text-blue-800'
                              : h.status === 'fulfilled'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {h.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(h.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      {h.status === 'pending' ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleApprove(h._id)}
                            disabled={actionLoading === h._id}
                            className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
                          >
                            {actionLoading === h._id ? '…' : 'Approve'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(h._id)}
                            disabled={actionLoading === h._id}
                            className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 text-sm font-medium"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
