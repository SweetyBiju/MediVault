


import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  MessageSquare,
  Users,
  Plus,
  Search,
  Filter,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Pin,
  Lock,
  Eye,
  Clock,
  User,
  Stethoscope,
  Heart,
  Brain,
  Activity,
  Shield,
  AlertCircle,
  CheckCircle,
  Star,
  TrendingUp,
  Calendar,
  Tag,
  Send,
  Edit,
  Trash2,
  Flag,
  Award,
  Crown,
  Zap
} from 'lucide-react';

const Forum = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('discussions');
  const [discussions, setDiscussions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: '',
    anonymous: false
  });
  const [newReply, setNewReply] = useState('');
  const [loading, setLoading] = useState(false);

  const forumCategories = [
    { id: 'all', name: 'All Discussions', icon: MessageSquare, color: 'blue', count: 247 },
    { id: 'general', name: 'General Health', icon: Heart, color: 'red', count: 89 },
    { id: 'patient-tips', name: 'Patient Tips', icon: User, color: 'green', count: 67 },
    { id: 'doctor-qa', name: 'Doctor Q&A', icon: Stethoscope, color: 'purple', count: 45 },
    { id: 'mental-health', name: 'Mental Health', icon: Brain, color: 'indigo', count: 34 },
    { id: 'fitness', name: 'Fitness & Wellness', icon: Activity, color: 'orange', count: 28 },
    { id: 'technology', name: 'Health Tech', icon: Zap, color: 'yellow', count: 23 },
    { id: 'support', name: 'Support Groups', icon: Users, color: 'pink', count: 19 }
  ];

  const userBadges = {
    'verified-doctor': { icon: Stethoscope, color: 'text-blue-600', label: 'Verified Doctor' },
    'top-contributor': { icon: Star, color: 'text-yellow-600', label: 'Top Contributor' },
    'helpful-member': { icon: Award, color: 'text-green-600', label: 'Helpful Member' },
    'moderator': { icon: Shield, color: 'text-purple-600', label: 'Moderator' },
    'expert': { icon: Crown, color: 'text-orange-600', label: 'Expert' }
  };

  useEffect(() => {
    fetchDiscussions();
    setCategories(forumCategories);
  }, [selectedCategory, sortBy]);

  const fetchDiscussions = async () => {
    // Mock data - in real app, this would be an API call
    const mockDiscussions = [
      {
        id: 1,
        title: 'Tips for managing diabetes with technology',
        content: 'I\'ve been using various apps and devices to manage my diabetes. Here are some tools that have really helped me...',
        author: {
          name: 'Sarah Johnson',
          role: 'patient',
          avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
          badges: ['top-contributor', 'helpful-member']
        },
        category: 'patient-tips',
        tags: ['diabetes', 'technology', 'apps'],
        votes: { up: 24, down: 2 },
        replies: 8,
        views: 156,
        isPinned: true,
        isLocked: false,
        createdAt: '2024-01-20T10:30:00Z',
        lastActivity: '2024-01-21T14:20:00Z',
        replies_data: [
          {
            id: 101,
            content: 'Great tips! I\'ve been using a similar approach with my CGM.',
            author: {
              name: 'Dr. Michael Chen',
              role: 'doctor',
              badges: ['verified-doctor']
            },
            votes: { up: 12, down: 0 },
            createdAt: '2024-01-20T15:45:00Z'
          }
        ]
      },
      {
        id: 2,
        title: 'Question about blood pressure medication side effects',
        content: 'I recently started taking lisinopril and I\'m experiencing some side effects. Has anyone else had similar experiences?',
        author: {
          name: 'Anonymous',
          role: 'patient',
          avatar: null,
          badges: []
        },
        category: 'doctor-qa',
        tags: ['blood-pressure', 'medication', 'side-effects'],
        votes: { up: 15, down: 1 },
        replies: 12,
        views: 203,
        isPinned: false,
        isLocked: false,
        createdAt: '2024-01-19T16:20:00Z',
        lastActivity: '2024-01-21T09:15:00Z',
        replies_data: []
      },
      {
        id: 3,
        title: 'Mental health resources during chronic illness',
        content: 'Dealing with a chronic condition can be mentally challenging. I wanted to share some resources that have helped me cope...',
        author: {
          name: 'Dr. Emily Watson',
          role: 'doctor',
          avatar: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=150',
          badges: ['verified-doctor', 'expert']
        },
        category: 'mental-health',
        tags: ['mental-health', 'chronic-illness', 'resources'],
        votes: { up: 31, down: 0 },
        replies: 6,
        views: 89,
        isPinned: false,
        isLocked: false,
        createdAt: '2024-01-18T11:10:00Z',
        lastActivity: '2024-01-20T18:30:00Z',
        replies_data: []
      }
    ];

    setDiscussions(mockDiscussions);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Mock post creation
    setTimeout(() => {
      const post = {
        id: Date.now(),
        title: newPost.title,
        content: newPost.content,
        author: newPost.anonymous ? {
          name: 'Anonymous',
          role: user.role,
          avatar: null,
          badges: []
        } : {
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          badges: user.badges || []
        },
        category: newPost.category,
        tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        votes: { up: 0, down: 0 },
        replies: 0,
        views: 0,
        isPinned: false,
        isLocked: false,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        replies_data: []
      };

      setDiscussions([post, ...discussions]);
      setShowNewPostModal(false);
      setNewPost({
        title: '',
        content: '',
        category: 'general',
        tags: '',
        anonymous: false
      });
      setLoading(false);
    }, 1000);
  };

  const handleVote = (discussionId, voteType) => {
    setDiscussions(discussions.map(discussion => {
      if (discussion.id === discussionId) {
        return {
          ...discussion,
          votes: {
            ...discussion.votes,
            [voteType]: discussion.votes[voteType] + 1
          }
        };
      }
      return discussion;
    }));
  };

  const handleReply = async (discussionId) => {
    if (!newReply.trim()) return;

    const reply = {
      id: Date.now(),
      content: newReply,
      author: {
        name: user.name,
        role: user.role,
        badges: user.badges || []
      },
      votes: { up: 0, down: 0 },
      createdAt: new Date().toISOString()
    };

    setDiscussions(discussions.map(discussion => {
      if (discussion.id === discussionId) {
        return {
          ...discussion,
          replies: discussion.replies + 1,
          replies_data: [...discussion.replies_data, reply],
          lastActivity: new Date().toISOString()
        };
      }
      return discussion;
    }));

    setNewReply('');
  };

  const getBadgeIcon = (badge) => {
    const badgeInfo = userBadges[badge];
    if (!badgeInfo) return null;
    
    return (
      <div className={`inline-flex items-center ${badgeInfo.color}`} title={badgeInfo.label}>
        <badgeInfo.icon className="w-4 h-4" />
      </div>
    );
  };

  const filteredDiscussions = discussions.filter(discussion => {
    const matchesCategory = selectedCategory === 'all' || discussion.category === selectedCategory;
    const matchesSearch = discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discussion.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discussion.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.lastActivity) - new Date(a.lastActivity);
      case 'popular':
        return (b.votes.up - b.votes.down) - (a.votes.up - a.votes.down);
      case 'replies':
        return b.replies - a.replies;
      case 'views':
        return b.views - a.views;
      default:
        return 0;
    }
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                  <Users className="w-8 h-8 mr-3 text-blue-600" />
                  Community Forum
                </h1>
                <p className="text-gray-600">
                  Connect with other patients and healthcare professionals to share experiences and get support.
                </p>
              </div>
              <button
                onClick={() => setShowNewPostModal(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                <span>New Discussion</span>
              </button>
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <category.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Forum Stats */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Forum Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Discussions</span>
                  <span className="font-semibold">247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active Members</span>
                  <span className="font-semibold">1,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Today's Posts</span>
                  <span className="font-semibold">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Online Now</span>
                  <span className="font-semibold text-green-600">89</span>
                </div>
              </div>
            </motion.div>

            {/* Top Contributors */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Contributors</h3>
              <div className="space-y-3">
                {[
                  { name: 'Dr. Sarah Johnson', posts: 45, badges: ['verified-doctor', 'expert'] },
                  { name: 'Michael Chen', posts: 38, badges: ['top-contributor'] },
                  { name: 'Emily Watson', posts: 32, badges: ['helpful-member'] }
                ].map((contributor, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{contributor.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">{contributor.name}</span>
                        <div className="flex space-x-1">
                          {contributor.badges.map((badge, badgeIndex) => (
                            <span key={badgeIndex}>{getBadgeIcon(badge)}</span>
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{contributor.posts} posts</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-6"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search discussions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                  <option value="replies">Most Replies</option>
                  <option value="views">Most Views</option>
                </select>
              </div>
            </motion.div>

            {/* Discussions List */}
            <div className="space-y-4">
              {filteredDiscussions.map((discussion, index) => (
                <motion.div
                  key={discussion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {discussion.isPinned && <Pin className="w-4 h-4 text-blue-600" />}
                          {discussion.isLocked && <Lock className="w-4 h-4 text-gray-600" />}
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                            {discussion.title}
                          </h3>
                        </div>
                        
                        <p className="text-gray-600 mb-3 line-clamp-2">{discussion.content}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center space-x-2">
                            {discussion.author.avatar ? (
                              <img
                                src={discussion.author.avatar}
                                alt={discussion.author.name}
                                className="w-6 h-6 rounded-full"
                              />
                            ) : (
                              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                                <User className="w-3 h-3 text-gray-600" />
                              </div>
                            )}
                            <span>{discussion.author.name}</span>
                            <div className="flex space-x-1">
                              {discussion.author.badges.map((badge, badgeIndex) => (
                                <span key={badgeIndex}>{getBadgeIcon(badge)}</span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{discussion.views} views</span>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {discussion.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleVote(discussion.id, 'up')}
                          className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span>{discussion.votes.up}</span>
                        </button>
                        <button
                          onClick={() => handleVote(discussion.id, 'down')}
                          className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
                        >
                          <ThumbsDown className="w-4 h-4" />
                          <span>{discussion.votes.down}</span>
                        </button>
                        <button
                          onClick={() => setSelectedDiscussion(discussion)}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <Reply className="w-4 h-4" />
                          <span>{discussion.replies} replies</span>
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <Flag className="w-4 h-4" />
                        </button>
                        {user?.id === discussion.author.id && (
                          <>
                            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Quick Reply */}
                    {selectedDiscussion?.id === discussion.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex space-x-3">
                          <textarea
                            value={newReply}
                            onChange={(e) => setNewReply(e.target.value)}
                            placeholder="Write a reply..."
                            rows={3}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          />
                          <button
                            onClick={() => handleReply(discussion.id)}
                            disabled={!newReply.trim()}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              newReply.trim()
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {filteredDiscussions.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No discussions found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || selectedCategory !== 'all'
                      ? 'Try adjusting your search or filters'
                      : 'Be the first to start a discussion!'
                    }
                  </p>
                  <button
                    onClick={() => setShowNewPostModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    Start Discussion
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Start New Discussion</h2>
                <button
                  onClick={() => setShowNewPostModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Plus className="w-6 h-6 transform rotate-45" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleCreatePost} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What would you like to discuss?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  required
                  value={newPost.category}
                  onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.filter(cat => cat.id !== 'all').map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  required
                  rows={8}
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Share your thoughts, ask questions, or provide helpful information..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (optional)
                </label>
                <input
                  type="text"
                  value={newPost.tags}
                  onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="diabetes, medication, tips (comma-separated)"
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={newPost.anonymous}
                  onChange={(e) => setNewPost({...newPost, anonymous: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="anonymous" className="text-sm text-gray-700">
                  Post anonymously
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                  }`}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
                  ) : (
                    'Post Discussion'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Forum;