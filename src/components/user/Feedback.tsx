import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAuth } from '../AuthContext';
import { MessageSquare, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface UserFeedback {
  id: number;
  message: string;
  status: string;
  createdAt: string;
}

export function Feedback() {
  const { userName } = useAuth();
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myFeedback, setMyFeedback] = useState<UserFeedback[]>([]);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(true);

  useEffect(() => {
    loadMyFeedback();
  }, []);

  const loadMyFeedback = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/feedback/my-feedback', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMyFeedback(data.feedback || []);
      }
    } catch (error) {
      console.error('Failed to load feedback:', error);
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit feedback');
      }

      toast.success('Feedback sent successfully! Admin will review it soon.');
      setSubmitted(true);
      
      // Reload feedback list
      await loadMyFeedback();
      
      setTimeout(() => {
        setSubmitted(false);
        setCategory('');
        setMessage('');
      }, 3000);
    } catch (error: any) {
      console.error('Feedback submission error:', error);
      toast.error(error.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      'new': { label: 'Pending', color: 'text-yellow-600 bg-yellow-50' },
      'in_progress': { label: 'Reviewed', color: 'text-blue-600 bg-blue-50' },
      'done': { label: 'Resolved', color: 'text-green-600 bg-green-50' }
    };
    return statusMap[status] || { label: status, color: 'text-gray-600 bg-gray-50' };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2" style={{ fontSize: '2rem', fontWeight: 600 }}>Feedback</h1>
        <p className="text-gray-600">We'd love to hear your thoughts and suggestions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 rounded-xl border-0 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <h3 style={{ fontWeight: 600 }}>Send Feedback</h3>
          </div>

          {submitted ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-green-600" style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                Thank you for your feedback!
              </p>
              <p className="text-gray-600 mt-2">
                We appreciate your input and will review it soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="bug">Bug Report</SelectItem>
                    <SelectItem value="improvement">Improvement Suggestion</SelectItem>
                    <SelectItem value="general">General Feedback</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="message">Your Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us what you think..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-2 min-h-[200px]"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full gradient-primary text-white border-0"
                disabled={isSubmitting}
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Sending...' : 'Send Feedback'}
              </Button>
            </form>
          )}
        </Card>

        <div className="space-y-6">
          <Card className="p-6 rounded-xl border-0 shadow-md">
            <h3 className="mb-4" style={{ fontWeight: 600 }}>We Value Your Input</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span>💡</span>
                </div>
                <div>
                  <p style={{ fontWeight: 600 }} className="text-gray-900 mb-1">Suggest Features</p>
                  <p className="text-gray-600" style={{ fontSize: '0.875rem' }}>
                    Help us improve by suggesting new features
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span>🐛</span>
                </div>
                <div>
                  <p style={{ fontWeight: 600 }} className="text-gray-900 mb-1">Report Issues</p>
                  <p className="text-gray-600" style={{ fontSize: '0.875rem' }}>
                    Let us know if you encounter any problems
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <span>⭐</span>
                </div>
                <div>
                  <p style={{ fontWeight: 600 }} className="text-gray-900 mb-1">Share Your Experience</p>
                  <p className="text-gray-600" style={{ fontSize: '0.875rem' }}>
                    Tell us how we're doing overall
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-xl border-0 shadow-md bg-gradient-to-br from-[#00C78C] to-[#00E6A0] text-white">
            <h3 className="mb-2" style={{ fontWeight: 600 }}>Need Help?</h3>
            <p style={{ fontSize: '0.875rem' }} className="mb-4 opacity-90">
              For urgent issues or questions, please contact our support team.
            </p>
            <Button variant="secondary" className="bg-white text-[#00C78C] hover:bg-gray-100">
              Contact Support
            </Button>
          </Card>

          <Card className="p-6 rounded-xl border-0 shadow-md">
            <h3 className="mb-4" style={{ fontWeight: 600 }}>My Recent Feedback</h3>
            {isLoadingFeedback ? (
              <p className="text-gray-500 text-center py-4">Loading...</p>
            ) : myFeedback.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No feedback submitted yet</p>
            ) : (
              <div className="space-y-3">
                {myFeedback.slice(0, 3).map((feedback) => {
                  const statusDisplay = getStatusDisplay(feedback.status);
                  return (
                    <div key={feedback.id} className={`flex items-center justify-between p-3 rounded-lg ${statusDisplay.color}`}>
                      <span className={statusDisplay.color.split(' ')[0]} style={{ fontSize: '0.875rem' }}>
                        {feedback.message.length > 50 ? feedback.message.substring(0, 50) + '...' : feedback.message}
                      </span>
                      <span className={statusDisplay.color} style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                        {statusDisplay.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
