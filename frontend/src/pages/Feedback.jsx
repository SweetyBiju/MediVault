

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  MessageSquare,
  Star,
  Send,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  Filter,
  Search,
  Plus,
  Eye,
  Heart,
  Zap,
  Target,
  Award,
  Lightbulb,
  Bug,
  Smile,
  Frown,
  Meh
} from 'lucide-react';

const Feedback = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('submit');
  const [feedbackForm, setFeedbackForm] = useState({
    rating: 0,
    category: 'general',
    title: '',
    description: '',
    priority: 'medium',
    anonymous: false
  });
  const [feedbackList, setFeedbackList] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { value: 'general', label: 'General Feedback', icon: MessageSquare },
    { value: 'ui', label: 'User Interface', icon: Eye },
    { value: 'features', label: 'Features', icon: Zap },
    { value: 'performance', label: 'Performance', icon: TrendingUp },
    { value: 'security', label: 'Security', icon: AlertCircle },
    { value: 'bug', label: 'Bug Report', icon: Bug },
    { value: 'suggestion', label: 'Suggestion', icon: Lightbulb }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-green-600 bg-green-100' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600 bg-yellow-100' },
    { value: 'high', label: 'High', color: 'text-red-600 bg-red-100' }
  ];

  useEffect(() => {
    fetchFeedback();
    fetchStats();
  }, []);

  const fetchFeedback = async () => {
    // Mock data - in real app, this would be an API call
    const mockFeedback = [
      {
        id: 1,
        user: { name: 'John Doe', role: 'patient' },
        rating: 5,
        category: 'features',
        title: 'Love the AI insights feature!',
        description: 'The AI health recommendations are incredibly helpful and accurate.',
        priority: 'medium',
        status: 'reviewed',
        votes: { up: 12, down: 1 },
        createdAt: '2024-01-20T10:30:00Z',
        response: 'Thank you for the positive feedback! We\'re glad you find the AI insights helpful.'
      },
      {
        id: 2,
        user: { name: 'Dr. Sarah Johnson', role: 'doctor' },
        rating: 4,
        category: 'ui',
        title: 'Dashboard could be more intuitive',
        description: 'The doctor dashboard has great features but the layout could be more user-friendly.',
        priority: 'high',
        status: 'in-progress',
        votes: { up: 8, down: 2 },
        createdAt: '2024-01-19T14:20:00Z',
        response: null
      },
      {
        id: 3,
        user: { name: 'Anonymous', role: 'patient' },
        rating: 3,
        category: 'bug',
        title: 'Upload issue with large files',
        description: 'Having trouble uploading files larger than 5MB.',
        priority: 'high',
        status: 'resolved',
        votes: { up: 15, down: 0 },
        createdAt: '2024-01-18T09:15:00Z',
        response: 'This issue has been fixed in our latest update. File upload limit increased to 25MB.'
      }
    ];

    setFeedbackList(mockFeedback);
  };

  const fetchStats = async () => {
    // Mock stats
    setStats({
      totalFeedback: 247,
      averageRating: 4.2,
      responseRate: 89,
      resolutionTime: 2.3,
      categoryBreakdown: {
        features: 45,
        ui: 38,
        bug: 32,
        performance: 28,
        security: 15,
        general: 89
      },
      ratingDistribution: {
        5: 120,
        4: 78,
        3: 32,
        2: 12,
        1: 5
      },
      recentTrends: {
        satisfaction: 'up',
        responseTime: 'down',
        bugReports: 'stable'
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Mock submission
    setTimeout(() => {
      const newFeedback = {
        id: Date.now(),
        user: feedbackForm.anonymous ? { name: 'Anonymous', role: user.role } : user,
        ...feedbackForm,
        status: 'pending',
        votes: { up: 0, down: 0 },
        createdAt: new Date().toISOString(),
        response: null
      };

      setFeedbackList([newFeedback, ...feedbackList]);
      setSubmitStatus('success');
      setFeedbackForm({
        rating: 0,
        category: 'general',
        title: '',
        description: '',
        priority: 'medium',
        anonymous: false
      });
      setLoading(false);

      setTimeout(() => setSubmitStatus(null), 3000);
    }, 1000);
  };

  const handleVote = (feedbackId, voteType) => {
    setFeedbackList(feedbackList.map(feedback => {
      if (feedback.id === feedbackId) {
        return {
          ...feedback,
          votes: {
            ...feedback.votes,
            [voteType]: feedback.votes[voteType] + 1
          }
        };
      }
      return feedback;
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'reviewed': return 'text-blue-600 bg-blue-100';
      case 'in-progress': return 'text-purple-600 bg-purple-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRatingIcon = (rating) => {
    if (rating >= 4) return <Smile className="w-5 h-5 text-green-600" />;
    if (rating >= 3) return <Meh className="w-5 h-5 text-yellow-600" />;
    return <Frown className="w-5 h-5 text-red-600" />;
  };

  const filteredFeedback = feedbackList.filter(feedback => {
    const matchesCategory = filterCategory === 'all' || feedback.category === filterCategory;
    const matchesSearch = feedback.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <MessageSquare className="w-8 h-8 mr-3 text-blue-600" />
              Feedback & Community
            </h1>
            <p className="text-gray-600">
              Share your thoughts, report issues, and help us improve MediVault for everyone.
            </p>
          </motion.div>
        </div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8"
        >
          <div className="flex border-b border-gray-200">
            {[
              { id: 'submit', label: 'Submit Feedback', icon: Send },
              { id: 'community', label: 'Community Feedback', icon: Users },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Submit Feedback Tab */}
        {activeTab === 'submit' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Submit Your Feedback</h2>

            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2"
              >
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-700">Thank you for your feedback! We'll review it soon.</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Overall Rating *
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFeedbackForm({...feedbackForm, rating})}
                      className={`p-1 transition-colors ${
                        rating <= feedbackForm.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      <Star className="w-8 h-8 fill-current" />
                    </button>
                  ))}
                  <span className="ml-4 text-sm text-gray-600">
                    {feedbackForm.rating > 0 && `${feedbackForm.rating} out of 5 stars`}
                  </span>
                </div>
              </div>

              {/* Category and Priority */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={feedbackForm.category}
                    onChange={(e) => setFeedbackForm({...feedbackForm, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={feedbackForm.priority}
                    onChange={(e) => setFeedbackForm({...feedbackForm, priority: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {priorities.map((priority) => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={feedbackForm.title}
                  onChange={(e) => setFeedbackForm({...feedbackForm, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief summary of your feedback"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={5}
                  value={feedbackForm.description}
                  onChange={(e) => setFeedbackForm({...feedbackForm, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Please provide detailed feedback..."
                />
              </div>

              {/* Anonymous Option */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={feedbackForm.anonymous}
                  onChange={(e) => setFeedbackForm({...feedbackForm, anonymous: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="anonymous" className="text-sm text-gray-700">
                  Submit anonymously
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || feedbackForm.rating === 0}
                className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                  loading || feedbackForm.rating === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                }`}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit Feedback</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}

        {/* Community Feedback Tab */}
        {activeTab === 'community' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search feedback..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Feedback List */}
            <div className="space-y-4">
              {filteredFeedback.map((feedback, index) => (
                <motion.div
                  key={feedback.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex items-center space-x-2">
                          {getRatingIcon(feedback.rating)}
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(feedback.status)}`}>
                          {feedback.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          priorities.find(p => p.value === feedback.priority)?.color
                        }`}>
                          {feedback.priority}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feedback.title}</h3>
                    <p className="text-gray-600 mb-4">{feedback.description}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <span>By {feedback.user.name}</span>
                        <span className="capitalize">({feedback.user.role})</span>
                        <span>{new Date(feedback.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleVote(feedback.id, 'up')}
                          className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span>{feedback.votes.up}</span>
                        </button>
                        <button
                          onClick={() => handleVote(feedback.id, 'down')}
                          className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
                        >
                          <ThumbsDown className="w-4 h-4" />
                          <span>{feedback.votes.down}</span>
                        </button>
                      </div>
                    </div>

                    {feedback.response && (
                      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <h4 className="font-medium text-blue-900 mb-1">Team Response:</h4>
                        <p className="text-blue-800 text-sm">{feedback.response}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {filteredFeedback.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback found</h3>
                  <p className="text-gray-600">
                    {searchTerm || filterCategory !== 'all'
                      ? 'Try adjusting your search or filters'
                      : 'Be the first to share your feedback!'
                    }
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { title: 'Total Feedback', value: stats.totalFeedback, icon: MessageSquare, color: 'blue' },
                { title: 'Average Rating', value: `${stats.averageRating}/5`, icon: Star, color: 'yellow' },
                { title: 'Response Rate', value: `${stats.responseRate}%`, icon: CheckCircle, color: 'green' },
                { title: 'Avg Resolution', value: `${stats.resolutionTime} days`, icon: Clock, color: 'purple' }
              ].map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg bg-${metric.color}-100`}>
                      <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Category Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Feedback by Category</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(stats.categoryBreakdown || {}).map(([category, count]) => {
                  const categoryInfo = categories.find(c => c.value === category);
                  return (
                    <div key={category} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {categoryInfo && <categoryInfo.icon className="w-5 h-5 text-gray-600" />}
                          <span className="font-medium text-gray-900 capitalize">
                            {categoryInfo?.label || category}
                          </span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">{count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${(count / Math.max(...Object.values(stats.categoryBreakdown || {}))) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Rating Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Rating Distribution</h2>
              
              <div className="space-y-4">
                {Object.entries(stats.ratingDistribution || {}).reverse().map(([rating, count]) => (
                  <div key={rating} className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 w-16">
                      <span className="text-sm font-medium">{rating}</span>
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${(count / Math.max(...Object.values(stats.ratingDistribution || {}))) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600 w-12">{count}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Trends */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent Trends</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {Object.entries(stats.recentTrends || {}).map(([metric, trend]) => (
                  <div key={metric} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      {trend === 'up' ? (
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      ) : trend === 'down' ? (
                        <TrendingDown className="w-6 h-6 text-red-600" />
                      ) : (
                        <Target className="w-6 h-6 text-gray-600" />
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 capitalize mb-1">
                      {metric.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    <p className={`text-sm font-medium capitalize ${
                      trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {trend}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Feedback;