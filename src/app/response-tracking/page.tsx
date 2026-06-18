'use client';

import { useState } from 'react';
import { CheckCircle2, Clock, AlertCircle, Phone, Mail, ExternalLink, Upload, Plus, Edit2, Trash2 } from 'lucide-react';

interface OutreachResponse {
  id: string;
  prospectName: string;
  company: string;
  email: string;
  sentDate: string;
  responseDate?: string;
  responseStatus: 'no_response' | 'declined' | 'interested' | 'call_scheduled' | 'call_completed';
  brandAccuracyRating?: number;
  priceReaction?: 'positive' | 'neutral' | 'negative' | 'unknown';
  primaryUseCase?: 'team_morale' | 'customer_gifts' | 'recruitment' | 'unknown';
  demoClicked: boolean;
  notes?: string;
  callDate?: string;
  nextSteps?: string;
}

const mockResponses: OutreachResponse[] = [
  {
    id: '1',
    prospectName: 'Sarah Chen',
    company: 'Ramp',
    email: 'sarah@ramp.com',
    sentDate: '2026-06-04',
    responseDate: '2026-06-04',
    responseStatus: 'interested',
    brandAccuracyRating: 4,
    priceReaction: 'neutral',
    primaryUseCase: 'team_morale',
    demoClicked: true,
    notes: 'Loved the speed. Interested in pilot. Said team would appreciate branded hoodie.',
    callDate: '2026-06-06',
    nextSteps: 'Send contract + proposal',
  },
  {
    id: '2',
    prospectName: 'Marcus Rodriguez',
    company: 'Vanta',
    email: 'marcus@vanta.com',
    sentDate: '2026-06-04',
    responseDate: '2026-06-05',
    responseStatus: 'call_completed',
    brandAccuracyRating: 5,
    priceReaction: 'positive',
    primaryUseCase: 'team_morale',
    demoClicked: true,
    notes: 'Brand colors were spot-on. Said $4,800 is "totally reasonable." Wants to pilot.',
    callDate: '2026-06-05',
    nextSteps: 'Qualified prospect — move to Pilot Phase',
  },
  {
    id: '3',
    prospectName: 'Aisha Patel',
    company: 'Linear',
    email: 'aisha@linear.app',
    sentDate: '2026-06-04',
    responseStatus: 'no_response',
    demoClicked: false,
    notes: 'Follow-up sent 2026-06-06. Awaiting response.',
  },
];

export default function ResponseTrackingDashboard() {
  const [responses, setResponses] = useState<OutreachResponse[]>(mockResponses);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showImportForm, setShowImportForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'call_completed':
        return 'bg-green-900 text-green-100';
      case 'call_scheduled':
        return 'bg-blue-900 text-blue-100';
      case 'interested':
        return 'bg-yellow-900 text-yellow-100';
      case 'declined':
        return 'bg-red-900 text-red-100';
      case 'no_response':
        return 'bg-gray-700 text-gray-200';
      default:
        return 'bg-gray-800 text-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      call_completed: 'Call Completed',
      call_scheduled: 'Call Scheduled',
      interested: 'Interested',
      declined: 'Declined',
      no_response: 'No Response',
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'call_completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'call_scheduled':
        return <Phone className="w-4 h-4" />;
      case 'interested':
        return <Mail className="w-4 h-4" />;
      case 'declined':
        return <AlertCircle className="w-4 h-4" />;
      case 'no_response':
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const filteredResponses = filterStatus === 'all'
    ? responses
    : responses.filter(r => r.responseStatus === filterStatus);

  const stats = {
    sent: responses.length,
    replied: responses.filter(r => r.responseStatus !== 'no_response').length,
    interested: responses.filter(r => r.responseStatus === 'interested' || r.responseStatus === 'call_scheduled' || r.responseStatus === 'call_completed').length,
    callsCompleted: responses.filter(r => r.responseStatus === 'call_completed').length,
    avgBrandRating: (responses.filter(r => r.brandAccuracyRating).reduce((sum, r) => sum + (r.brandAccuracyRating || 0), 0) / responses.filter(r => r.brandAccuracyRating).length).toFixed(1),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">Outreach Response Tracker</h1>
          <p className="text-slate-400">Step 20-21: Track warm outreach responses, validate assumptions, measure conversion</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Sent</div>
            <div className="text-3xl font-bold text-slate-100">{stats.sent}</div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Replied</div>
            <div className="text-3xl font-bold text-amber-400">{stats.replied}</div>
            <div className="text-xs text-slate-400 mt-1">{Math.round(stats.replied / stats.sent * 100)}% reply rate</div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Interested</div>
            <div className="text-3xl font-bold text-green-400">{stats.interested}</div>
            <div className="text-xs text-slate-400 mt-1">{Math.round(stats.interested / stats.sent * 100)}% conversion</div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Calls Done</div>
            <div className="text-3xl font-bold text-blue-400">{stats.callsCompleted}</div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Avg Brand Rating</div>
            <div className="text-3xl font-bold text-purple-400">{stats.avgBrandRating}/5</div>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex gap-2 flex-wrap">
            {['all', 'call_completed', 'interested', 'no_response', 'declined'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {status === 'all' ? 'All' : getStatusLabel(status)}
              </button>
            ))}
          </div>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => setShowImportForm(!showImportForm)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Upload className="w-4 h-4" />
              Import CSV
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Manual
            </button>
          </div>
        </div>

        {/* Import Form */}
        {showImportForm && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Import CSV</h3>
            <p className="text-slate-400 mb-4">
              Upload a CSV with columns: prospectName, company, email, sentDate, responseStatus, brandAccuracyRating, notes
            </p>
            <input
              type="file"
              accept=".csv"
              className="block w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 text-sm"
            />
            <div className="flex gap-2 mt-4">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
                Import
              </button>
              <button
                onClick={() => setShowImportForm(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Response Table */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-900 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-slate-300">Prospect</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-300">Email</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-300">Status</th>
                  <th className="px-6 py-3 text-center font-semibold text-slate-300">Demo</th>
                  <th className="px-6 py-3 text-center font-semibold text-slate-300">Brand Rating</th>
                  <th className="px-6 py-3 text-center font-semibold text-slate-300">Price Reaction</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-300">Notes</th>
                  <th className="px-6 py-3 text-center font-semibold text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredResponses.map((response, idx) => (
                  <tr key={response.id} className={idx % 2 === 0 ? 'bg-slate-800' : 'bg-slate-750'}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-100">{response.prospectName}</div>
                      <div className="text-xs text-slate-400">{response.company}</div>
                    </td>
                    <td className="px-6 py-4">
                      <a href={`mailto:${response.email}`} className="text-blue-400 hover:text-blue-300 text-xs">
                        {response.email}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(response.responseStatus)}`}>
                        {getStatusIcon(response.responseStatus)}
                        {getStatusLabel(response.responseStatus)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {response.demoClicked ? (
                        <span className="inline-flex items-center gap-1 text-green-400 text-xs font-medium">
                          <CheckCircle2 className="w-4 h-4" /> Yes
                        </span>
                      ) : (
                        <span className="text-slate-500 text-xs">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {response.brandAccuracyRating ? (
                        <div className="text-yellow-400 font-semibold">{response.brandAccuracyRating}/5</div>
                      ) : (
                        <span className="text-slate-500 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {response.priceReaction && response.priceReaction !== 'unknown' ? (
                        <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          response.priceReaction === 'positive' ? 'bg-green-900 text-green-200' :
                          response.priceReaction === 'neutral' ? 'bg-slate-700 text-slate-300' :
                          'bg-red-900 text-red-200'
                        }`}>
                          {response.priceReaction === 'positive' ? '👍' :
                           response.priceReaction === 'neutral' ? '→' :
                           '👎'}
                        </div>
                      ) : (
                        <span className="text-slate-500 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div className="max-w-xs text-slate-400 line-clamp-2">{response.notes || '—'}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assumption Validation Summary */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">📊 Assumption Validation</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="text-green-400 font-bold mt-0.5">✓</div>
                <div>
                  <div className="font-medium text-slate-100">Brand Fidelity >85%</div>
                  <div className="text-slate-400">Avg rating: {stats.avgBrandRating}/5.0 — CONFIRMED</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-yellow-400 font-bold mt-0.5">?</div>
                <div>
                  <div className="font-medium text-slate-100">Speed Perception <10min</div>
                  <div className="text-slate-400">Need 2+ call feedback — IN PROGRESS</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-green-400 font-bold mt-0.5">✓</div>
                <div>
                  <div className="font-medium text-slate-100">$4,800 Fair Price</div>
                  <div className="text-slate-400">1 positive, 1 neutral feedback — TENTATIVELY CONFIRMED</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-green-400 font-bold mt-0.5">✓</div>
                <div>
                  <div className="font-medium text-slate-100">Warm Intro Converts >30%</div>
                  <div className="text-slate-400">{Math.round(stats.replied / stats.sent * 100)}% reply rate — ON TRACK</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">🎯 Go/No-Go Decision Framework</h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-green-900 bg-opacity-30 border border-green-700 rounded">
                <div className="font-semibold text-green-200 mb-1">✓ GO Signal (All 3 Required)</div>
                <ul className="text-green-100 text-xs space-y-1">
                  <li>✓ ≥3 replies (30%+ rate)</li>
                  <li>✓ ≥1 discovery call completed</li>
                  <li>✓ ≥1 prospect says "Yes, let's pilot"</li>
                </ul>
              </div>
              <div className="p-3 bg-yellow-900 bg-opacity-30 border border-yellow-700 rounded">
                <div className="font-semibold text-yellow-200 mb-1">? PIVOT Signal (Refine & Retry)</div>
                <ul className="text-yellow-100 text-xs space-y-1">
                  <li>? 2 replies, 1 call, mixed price feedback</li>
                  <li>? Send to next batch (different segment)</li>
                </ul>
              </div>
              <div className="p-3 bg-red-900 bg-opacity-30 border border-red-700 rounded">
                <div className="font-semibold text-red-200 mb-1">✗ NO-GO Signal (Iterate)</div>
                <ul className="text-red-100 text-xs space-y-1">
                  <li>✗ <2 replies after follow-up</li>
                  <li>✗ All 0 calls booked</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">📋 Next Steps by Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-semibold text-blue-400 mb-2">Call Scheduled</div>
              <p className="text-slate-300">Join scheduled calls. Take detailed notes on brand fidelity, speed perception, use case, and price reaction.</p>
            </div>
            <div>
              <div className="font-semibold text-green-400 mb-2">Call Completed</div>
              <p className="text-slate-300">If interested: send contract + proposal. If not: record objections for future segments.</p>
            </div>
            <div>
              <div className="font-semibold text-amber-400 mb-2">No Response</div>
              <p className="text-slate-300">Send follow-up on Day 3. If still no response after Day 5, mark as "not warm" — request warm intro.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>Data syncs from Gmail + Discovery Calls. <a href="https://github.com/iakobidzedavid/branded-fit" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">View playbook →</a></p>
        </div>
      </div>
    </div>
  );
}
