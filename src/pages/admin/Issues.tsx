import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IssueList } from '@/components/admin/IssueList';

export function Issues() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/admin')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reported Issues</h1>
        <p className="text-gray-600 mt-1">Review and manage equipment issues</p>
      </div>

      <IssueList />
    </div>
  );
}
