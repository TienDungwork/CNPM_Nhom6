import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useData, Feedback as FeedbackType } from '../DataContext';
import { MessageSquare, CheckCircle, Clock, Ban } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

export function FeedbackReview() {
  const { feedbacks, updateFeedbackStatus } = useData();

  const handleStatusUpdate = (feedbackId: string, status: FeedbackType['status']) => {
    updateFeedbackStatus(feedbackId, status);
    toast.success(`Feedback marked as ${status.toLowerCase()}`);
  };

  const getStatusBadge = (status: FeedbackType['status']) => {
    const styles = {
      Pending: 'bg-yellow-100 text-yellow-700',
      Reviewed: 'bg-blue-100 text-blue-700',
      Resolved: 'bg-green-100 text-green-700',
    };
    return <Badge className={styles[status]}>{status}</Badge>;
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      feature: '💡',
      bug: '🐛',
      improvement: '⭐',
      general: '💬',
      other: '📝',
    };
    return icons[category] || '💬';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const pendingCount = feedbacks.filter(f => f.status === 'Pending').length;
  const reviewedCount = feedbacks.filter(f => f.status === 'Reviewed').length;
  const resolvedCount = feedbacks.filter(f => f.status === 'Resolved').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2" style={{ fontSize: '2rem', fontWeight: 600 }}>Feedback Review</h1>
        <p className="text-gray-600">Review and respond to user feedback</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 rounded-xl border-0 shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-400 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600" style={{ fontSize: '0.875rem' }}>Total Feedback</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 600 }}>{feedbacks.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-xl border-0 shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-400 flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600" style={{ fontSize: '0.875rem' }}>Pending</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 600 }}>{pendingCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-xl border-0 shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center">
              <Ban className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600" style={{ fontSize: '0.875rem' }}>Reviewed</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 600 }}>{reviewedCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-xl border-0 shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600" style={{ fontSize: '0.875rem' }}>Resolved</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 600 }}>{resolvedCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Feedback Table */}
      <Card className="p-6 rounded-xl border-0 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h3 style={{ fontWeight: 600 }}>All Feedback</h3>
          {pendingCount > 0 && (
            <Badge className="bg-yellow-100 text-yellow-700">
              {pendingCount} new
            </Badge>
          )}
        </div>

        {feedbacks.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>No feedback received yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <div 
                key={feedback.id} 
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: '1.5rem' }}>{getCategoryIcon(feedback.category)}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p style={{ fontWeight: 600 }}>{feedback.userName}</p>
                        {feedback.status === 'Pending' && (
                          <Badge className="bg-red-100 text-red-700">New</Badge>
                        )}
                      </div>
                      <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>
                        {formatDate(feedback.createdAt)} • {feedback.category}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(feedback.status)}
                </div>

                <p className="text-gray-700 mb-4">{feedback.message}</p>

                <div className="flex gap-2">
                  {feedback.status === 'Pending' && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(feedback.id, 'Reviewed')}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Mark as Reviewed
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(feedback.id, 'Resolved')}
                        className="bg-green-600 text-white hover:bg-green-700"
                      >
                        Resolve
                      </Button>
                    </>
                  )}
                  {feedback.status === 'Reviewed' && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(feedback.id, 'Resolved')}
                      className="bg-green-600 text-white hover:bg-green-700"
                    >
                      Mark as Resolved
                    </Button>
                  )}
                  {feedback.status === 'Resolved' && (
                    <span className="text-green-600 flex items-center gap-2" style={{ fontSize: '0.875rem' }}>
                      <CheckCircle className="w-4 h-4" />
                      This feedback has been resolved
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
