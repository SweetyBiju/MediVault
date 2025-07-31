import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import { FileText, Download, MessageSquare } from "lucide-react";
import HumanBodyVisualization from "../components/HumanBodyVisualization";
import InsightsCard from "../components/InsightsCard";
import Chatbot from "../components/Chatbot";

const Insights = () => {
  const { reportId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [insights, setInsights] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);

  // Load uploaded files from localStorage
  useEffect(() => {
    const storedFiles = JSON.parse(localStorage.getItem("uploadedFiles")) || [];
    setUploadedFiles(storedFiles);
  }, []);

  // Fetch insights from backend
  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5600/api/insights/overall/${User._id}`);
        if (!res.ok) throw new Error("Failed to fetch insights");
        const data = await res.json();
        console.log("[Fetched Insights]:", data);
        setInsights(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load insights. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, [reportId]);

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: true,
  };

  const handleDownload = (file) => {
    // For backend-stored files, replace with actual URL (e.g., S3 or server)
    window.open(file.preview || `/uploads/${file.name}`, "_blank");
  };

  const handleAskAI = () => setShowChatbot(true);

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading AI Insights...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-600">{error}</div>;
  if (!insights) return <div className="flex justify-center items-center min-h-screen">No data available</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Row 1: Body + Prescriptions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-2">Your Body Overview</h2>
            <div className="flex justify-center max-h-[250px]">
              <HumanBodyVisualization parameters={insights.parameters} />
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-2xl p-4">
            <h2 className="text-lg font-semibold mb-4">Uploaded Prescriptions</h2>
            <div className="max-h-[250px] overflow-y-auto pr-2 space-y-3">
              {uploadedFiles.length > 0 ? (
                uploadedFiles.map((file, idx) => (
                  <div key={idx} className="border rounded-lg p-3 bg-gray-50 flex flex-col">
                    <div>
                      <p className="font-medium text-blue-600">{file.name}</p>
                      <p className="text-xs text-gray-500">{file.size} MB • {file.type}</p>
                      <p className="text-xs text-gray-400">Uploaded on: {file.date}</p>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 rounded"
                        onClick={() => handleDownload(file)}
                      >
                        <Download size={14} className="inline-block mr-1" /> Download
                      </button>
                      <button
                        className="flex-1 bg-purple-500 hover:bg-purple-600 text-white text-xs py-1 rounded"
                        onClick={() => alert("Show AI insights for this file")}
                      >
                        🤖 Insights
                      </button>
                      <button
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs py-1 rounded"
                        onClick={handleAskAI}
                      >
                        <MessageSquare size={14} className="inline-block mr-1" /> Ask Bot
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No prescriptions uploaded yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: AI Recommendations */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">AI Recommendations</h2>
          <Slider {...carouselSettings}>
            {insights.recommendations.map((rec, idx) => (
              <div key={idx} className="h-60 flex items-center justify-center bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white p-4 rounded-xl shadow-lg">
                <p className="text-lg font-semibold text-center">{rec}</p>
              </div>
            ))}
          </Slider>
        </div>

        {/* Row 3: Parameters + Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Parameter Insights</h2>
            <div className="grid grid-cols-1 gap-4 max-h-[500px] overflow-y-auto pr-2">
              {insights.parameters.map((param, index) => (
                <InsightsCard key={param.name + index} {...param} />
              ))}
            </div>
          </div>
          <div className="bg-white shadow rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <FileText size={20} className="text-blue-500" /> AI Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{insights.summary}</p>
          </div>
        </div>
      </div>

      {/* Chatbot Modal */}
      {showChatbot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl relative">
            <button
              onClick={() => setShowChatbot(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <Chatbot contextReportId={reportId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Insights;
