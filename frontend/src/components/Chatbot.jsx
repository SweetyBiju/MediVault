import React, { useState } from 'react';
import { Bot, X } from 'lucide-react';

const Chatbot = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-10 right-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-40 transition"
        title="AI Assistant"
      >
        <Bot size={40} />
      </button>

      {/* Chatbot Panel */}
      {open && (
        <div className="fixed bottom-10 right-50 w-[300px] sm:w-[350px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden flex flex-col">
          <div className="flex justify-between items-center px-4 py-2 border-b dark:border-gray-700">
            <h4 className="text-sm font-bold">MediBot</h4>
            <button onClick={() => setOpen(false)}>
              <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
            </button>
          </div>
          <div className="flex-1 p-3 text-sm overflow-y-auto text-gray-500 dark:text-gray-300">
            👋 Hi! I'm your health assistant. Ask me anything about your records or upcoming visits.
            <br /><br />
            *(Chat integration coming soon.)*
          </div>
          <div className="p-3 border-t dark:border-gray-700">
            <input
              type="text"
              disabled
              placeholder="Type your question..."
              className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-400 text-sm"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
