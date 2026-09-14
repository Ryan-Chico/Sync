import { CheckCircle, XCircle, Clock, User } from 'lucide-react';
import { useIssues } from '@/hooks/useIssues';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { formatDateTime } from '@/lib/utils';
import type { RoomIssue } from '@/types';

export function IssueList() {
  const { issues, loading, verifyIssue, fixIssue } = useIssues();
  const { user } = useAuth();

  async function handleVerify(issueId: string) {
    if (!user) return;
    try {
      await verifyIssue(issueId, user.id);
    } catch (err) {
      console.error('Failed to verify:', err);
    }
  }

  async function handleFix(issueId: string) {
    try {
      await fixIssue(issueId);
    } catch (err) {
      console.error('Failed to fix:', err);
    }
  }

  const statusConfig = {
    reported: {
      icon: <Clock className="w-5 h-5 text-yellow-500" />,
      label: 'Reported',
      bgColor: 'bg-yellow-50 border-yellow-200',
    },
    verified: {
      icon: <CheckCircle className="w-5 h-5 text-blue-500" />,
      label: 'Verified',
      bgColor: 'bg-blue-50 border-blue-200',
    },
    fixed: {
      icon: <XCircle className="w-5 h-5 text-green-500" />,
      label: 'Fixed',
      bgColor: 'bg-green-50 border-green-200',
    },
  };

  if (loading) return <Spinner />;

  const pendingIssues = issues.filter((i) => i.status !== 'fixed');
  const fixedIssues = issues.filter((i) => i.status === 'fixed');

  return (
    <div className="space-y-6">
      {/* Pending Issues */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Pending Issues ({pendingIssues.length})
        </h3>
        {pendingIssues.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-xl border border-gray-200">
            <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-2" />
            <p className="text-gray-500">No pending issues</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingIssues.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                onVerify={() => handleVerify(issue.id)}
                onFix={() => handleFix(issue.id)}
                statusConfig={statusConfig[issue.status]}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fixed Issues */}
      {fixedIssues.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Fixed ({fixedIssues.length})
          </h3>
          <div className="space-y-3 opacity-75">
            {fixedIssues.slice(0, 10).map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                statusConfig={statusConfig[issue.status]}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function IssueCard({
  issue,
  onVerify,
  onFix,
  statusConfig,
}: {
  issue: RoomIssue;
  onVerify?: () => void;
  onFix?: () => void;
  statusConfig: { icon: React.ReactNode; label: string; bgColor: string };
}) {
  return (
    <div className={`p-4 rounded-xl border ${statusConfig.bgColor}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {statusConfig.icon}
          <div>
            <p className="font-medium text-gray-900">
              {issue.room?.name} (Room {issue.room?.room_number})
            </p>
            <p className="text-sm text-gray-600">{issue.equipment_name}</p>
          </div>
        </div>
        <span className="text-xs text-gray-500">{formatDateTime(issue.created_at)}</span>
      </div>

      {issue.description && (
        <p className="text-sm text-gray-600 mb-3 ml-7">{issue.description}</p>
      )}

      <div className="flex items-center justify-between ml-7">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <User className="w-3 h-3" />
          Reported by {issue.reporter?.full_name || 'Unknown'}
        </div>

        <div className="flex gap-2">
          {issue.status === 'reported' && onVerify && (
            <Button size="sm" variant="secondary" onClick={onVerify}>
              Verify
            </Button>
          )}
          {issue.status === 'verified' && onFix && (
            <Button size="sm" onClick={onFix}>
              Mark Fixed
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
