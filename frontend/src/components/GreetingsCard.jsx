import React from "react";
import { Calendar } from "lucide-react";

const GreetingCard = ({ user = "User" }) => {
  const now = new Date();
  const hours = now.getHours();
  const day = now.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

  let greeting = "Hello";
  if (hours < 12) greeting = "Good morning";
  else if (hours < 18) greeting = "Good afternoon";
  else if(hours<20) greeting="Good evening";
  else greeting = "Good Night, Sleep now";

  return (
    <section className="relative bg-gradient-to-b from-[#dfe9f3] via-[#f6f4fb] to-white+ dark:from-gray-800 dark:via-gray-800 dark:to-gray-900+ px-8 py-14 mb-0 rounded-b-3xl shadow-inner transition-all">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left: Greeting */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            {greeting}, {user}! <span className="animate-wave">👋</span>
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Here's your health overview. Let’s stay on track.
          </p>
        </div>

        {/* Right: Date + Avatar */}
        <div className="text-right flex items-center gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Today</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-white">{day}</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white shadow-lg">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default GreetingCard;
