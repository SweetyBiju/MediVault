
import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Create custom Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5600',
  withCredentials: true,
});

// Add request interceptor to include Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const Chatbot = () => {
  const { currentUser, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: "👋 Hi! I'm MediBot, your health assistant. Ask me about medications, records, or upload a medicine label image.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [userAllergies, setUserAllergies] = useState([]);
  const [allergyError, setAllergyError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Sync isAuthenticated with auth state
  useEffect(() => {
    if (!loading) {
      setIsAuthenticated(!!currentUser);
      if (!currentUser) {
        setAllergyError('Please log in to use the chatbot.');
        setUserAllergies(['penicillin', 'sulfa']);
      }
    }
  }, [currentUser, loading]);

  // Fetch user allergies on component mount if authenticated
  useEffect(() => {
    const fetchAllergies = async () => {
      if (loading || !isAuthenticated) return;

      try {
        // Verify token with /api/auth/me
        await api.get('/api/auth/me');
        // Fetch allergies
        const response = await api.get('/api/allergies');
        const allergies = Array.isArray(response.data)
          ? response.data.map((allergy) => allergy.name)
          : ['penicillin', 'sulfa'];
        setUserAllergies(allergies);
        setAllergyError(null);
      } catch (error) {
        console.error('Error fetching allergies:', {
          status: error.response?.status,
          message: error.message,
          data: error.response?.data,
        });
        setAllergyError('Failed to load allergies. Using default allergies.');
        setUserAllergies(['penicillin', 'sulfa']);
        if (error.response?.status === 401) {
          setAllergyError('Session expired. Please log in again.');
          setIsAuthenticated(false);
          logout();
        }
      }
    };
    fetchAllergies();
  }, [isAuthenticated, loading, logout]);

  // Scroll to the bottom of the chat when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle text message submission
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !isAuthenticated || loading) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Verify token before sending
      await api.get('/api/auth/me');
      const response = await api.post('/api/bot/text', {
        message: userMessage.content,
        userAllergies: Array.isArray(userAllergies) ? userAllergies : ['penicillin', 'sulfa'],
      });

      const { reply, disclaimer } = response.data;
      const botMessage = {
        role: 'bot',
        content: `${reply}\n\n*${disclaimer}*`,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending text message:', {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
        requestBody: { message: userMessage.content, userAllergies },
      });
      const errorMessage = {
        role: 'bot',
        content:
          error.response?.status === 401
            ? 'Session expired. Please log in again.'
            : `Failed to send message: ${error.response?.data?.error || error.message}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
      if (error.response?.status === 401) {
        setIsAuthenticated(false);
        setAllergyError('Session expired. Please log in again.');
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    if (!isAuthenticated || loading) return;
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  // Handle image submission
  const handleSendImage = async () => {
    if (!image || !isAuthenticated || loading) return;

    const userMessage = { role: 'user', content: `Uploaded image: ${image.name}` };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Verify token before sending
      await api.get('/api/auth/me');
      const formData = new FormData();
      formData.append('image', image);
      formData.append('userAllergies', JSON.stringify(Array.isArray(userAllergies) ? userAllergies : ['penicillin', 'sulfa']));

      const response = await api.post('/api/bot/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { extracted, reply, disclaimer } = response.data;
      const extractedText = extracted.medicines.length
        ? `Extracted: ${extracted.medicines
            .map((m) => `${m.name} (${m.strength}, ${m.form})`)
            .join(', ')}`
        : 'No medicines extracted from the image.';

      const botMessage = {
        role: 'bot',
        content: `${extractedText}\n\n${reply}\n\n*${disclaimer}*`,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending image:', {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      });
      const errorMessage = {
        role: 'bot',
        content:
          error.response?.status === 401
            ? 'Session expired. Please log in again.'
            : `Failed to process image: ${error.response?.data?.error || error.message}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
      if (error.response?.status === 401) {
        setIsAuthenticated(false);
        setAllergyError('Session expired. Please log in again.');
        logout();
      }
    } finally {
      setImage(null);
      setIsLoading(false);
      fileInputRef.current.value = null;
    }
  };

  // Trigger image submission when image is selected
  useEffect(() => {
    if (image) {
      handleSendImage();
    }
  }, [image]);

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-10 right-10 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-40 transition"
        title="AI Assistant"
      >
        <Bot size={40} />
      </button>

      {/* Chatbot Panel */}
      {open && (
        <div className="fixed bottom-10 right-10 w-[300px] sm:w-[350px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden flex flex-col h-[400px]">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-2 border-b dark:border-gray-700 bg-blue-600 text-white">
            <h4 className="text-sm font-bold">MediBot</h4>
            <button onClick={() => setOpen(false)}>
              <X className="w-4 h-4 hover:text-red-500" />
            </button>
          </div>

          {/* Loading or Auth Warning */}
          {loading && (
            <div className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm">
              Loading authentication...
            </div>
          )}
          {!loading && allergyError && (
            <div className="p-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 text-sm">
              {allergyError}
              {!isAuthenticated && (
                <a
                  href="/login"
                  className="underline ml-1"
                  onClick={() => setOpen(false)}
                >
                  Log in
                </a>
              )}
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-1 p-3 text-sm overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-blue-100 dark:bg-blue-800 text-gray-900 dark:text-gray-100'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-2">
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                  <span className="animate-pulse">Processing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t dark:border-gray-700 flex items-center gap-2"
          >
            {/* Image Upload Button */}
            <label
              htmlFor="image-upload"
              className={`p-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer ${
                isLoading || !isAuthenticated || loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <ImageIcon size={16} />
              <input
                id="image-upload"
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleImageChange}
                className="hidden"
                disabled={isLoading || !isAuthenticated || loading}
                ref={fileInputRef}
              />
            </label>

            {/* Text Input */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isAuthenticated ? 'Type your question...' : 'Log in to chat'}
              className="flex-1 px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none"
              disabled={isLoading || !isAuthenticated || loading}
            />

            {/* Send Button */}
            <button
              type="submit"
              className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
              disabled={isLoading || !input.trim() || !isAuthenticated || loading}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
