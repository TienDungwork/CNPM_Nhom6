import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { MessageSquare, Send, CheckCircle } from 'lucide-react';

export function Feedback() {
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !message.trim()) {
      alert('Please fill in all fields');
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setCategory('');
      setMessage('');
    }, 3000);
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

              <Button type="submit" className="w-full gradient-primary text-white border-0">
                <Send className="w-4 h-4 mr-2" />
                Send Feedback
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
            <h3 className="mb-4" style={{ fontWeight: 600 }}>Recent Feedback Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-green-900" style={{ fontSize: '0.875rem' }}>Feature: Dark mode</span>
                <span className="text-green-600" style={{ fontSize: '0.75rem', fontWeight: 600 }}>In Progress</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-900" style={{ fontSize: '0.875rem' }}>Bug: Login issue</span>
                <span className="text-blue-600" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Resolved</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
