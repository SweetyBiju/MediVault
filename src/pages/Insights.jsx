


import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  Brain,
  Heart,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Eye,
  Target,
  Zap,
  Shield,
  BarChart3,
  PieChart,
  LineChart,
  Info,
  Calendar,
  User,
  Clock,
  ArrowUp,
  ArrowDown,
  Minus,
  Plus,
  RefreshCw
} from 'lucide-react';

const Insights = () => {
  const { user } = useAuth();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [timeRange, setTimeRange] = useState('3months');

  useEffect(() => {
    fetchInsights();
  }, [user, timeRange]);

  const fetchInsights = async () => {
    setLoading(true);
    // Mock API call - in real app, this would fetch from backend
    setTimeout(() => {
      if (user?.role === 'patient') {
        setInsights(generatePatientInsights());
      } else {
        setInsights(generateDoctorInsights());
      }
      setLoading(false);
    }, 1500);
  };

  const generatePatientInsights = () => ({
    healthScore: {
      current: 78,
      previous: 72,
      trend: 'up',
      category: 'Good'
    },
    riskAssessment: {
      diabetes: { score: 25, level: 'low', trend: 'stable' },
      hypertension: { score: 45, level: 'medium', trend: 'improving' },
      heartDisease: { score: 15, level: 'low', trend: 'stable' },
      obesity: { score: 35, level: 'medium', trend: 'improving' }
    },
    vitals: {
      bloodPressure: { value: '120/80', status: 'normal', trend: 'stable' },
      heartRate: { value: '72 bpm', status: 'normal', trend: 'stable' },
      weight: { value: '165 lbs', status: 'normal', trend: 'decreasing' },
      bmi: { value: '22.5', status: 'normal', trend: 'stable' }
    },
    recommendations: [
      {
        type: 'exercise',
        title: 'Increase Cardio Activity',
        description: 'Add 30 minutes of moderate cardio 3x per week',
        priority: 'high',
        impact: 'Reduce heart disease risk by 15%'
      },
      {
        type: 'diet',
        title: 'Reduce Sodium Intake',
        description: 'Limit sodium to 2,300mg per day',
        priority: 'medium',
        impact: 'Lower blood pressure by 5-10 points'
      },
      {
        type: 'sleep',
        title: 'Improve Sleep Quality',
        description: 'Maintain 7-9 hours of sleep nightly',
        priority: 'medium',
        impact: 'Better overall health and recovery'
      }
    ],
    trends: {
      bloodPressure: [118, 120, 122, 119, 120, 118, 120],
      weight: [170, 168, 167, 166, 165, 165, 165],
      heartRate: [75, 73, 72, 74, 72, 71, 72]
    },
    alerts: [
      {
        type: 'warning',
        message: 'Blood pressure reading slightly elevated last week',
        date: '2024-01-15',
        severity: 'medium'
      }
    ]
  });

  const generateDoctorInsights = () => ({
    patientOverview: {
      totalPatients: 247,
      activePatients: 189,
      highRiskPatients: 23,
      appointmentsToday: 8
    },
    diagnosticInsights: [
      {
        patientId: 'P001',
        patientName: 'John Doe',
        condition: 'Potential Diabetes',
        confidence: 0.85,
        reasoning: 'Elevated glucose levels in recent lab results',
        recommendation: 'Order HbA1c test and dietary consultation'
      },
      {
        patientId: 'P002',
        patientName: 'Jane Smith',
        condition: 'Hypertension Risk',
        confidence: 0.72,
        reasoning: 'Consistent high blood pressure readings',
        recommendation: 'Consider ACE inhibitor therapy'
      }
    ],
    anomalies: [
      {
        type: 'lab-result',
        patientName: 'Bob Wilson',
        description: 'Glucose level significantly higher than baseline',
        severity: 'high',
        date: '2024-01-20'
      },
      {
        type: 'vital-signs',
        patientName: 'Alice Johnson',
        description: 'Blood pressure trending upward over 2 weeks',
        severity: 'medium',
        date: '2024-01-19'
      }
    ],
    predictiveAnalytics: {
      riskFactors: ['Age', 'BMI', 'Family history', 'Lifestyle factors'],
      predictions: [
        {
          condition: 'Type 2 Diabetes',
          probability: 0.65,
          timeframe: '2-3 years',
          patients: 15
        },
        {
          condition: 'Cardiovascular Disease',
          probability: 0.45,
          timeframe: '5 years',
          patients: 8
        }
      ]
    },
    treatmentRecommendations: [
      {
        treatment: 'Lifestyle modification program',
        priority: 'high',
        patients: 45,
        details: 'Diet and exercise intervention'
      },
      {
        treatment: 'Medication review',
        priority: 'medium',
        patients: 23,
        details: 'Optimize current medication regimens'
      }
    ]
  });

  const getRiskColor = (level) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'improving': return <ArrowUp className="w-4 h-4 text-green-600" />;
      case 'declining': return <ArrowDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const HealthScoreGauge = ({ score, category }) => {
    const circumference = 2 * Math.PI * 45;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444'}
            strokeWidth="8"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{score}</span>
          <span className="text-xs text-gray-600">{category}</span>
        </div>
      </div>
    );
  };

  const RiskMeter = ({ score, level }) => {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ${
              level === 'low' ? 'bg-green-500' : level === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-700">{score}%</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your health data...</p>
        </div>
      </div>
    );
  }

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
                  <Brain className="w-8 h-8 mr-3 text-purple-600" />
                  AI Health Insights
                </h1>
                <p className="text-gray-600">
                  {user?.role === 'patient' 
                    ? 'Personalized health analysis and recommendations powered by AI'
                    : 'AI-powered diagnostic assistance and patient analytics'
                  }
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="1month">Last Month</option>
                  <option value="3months">Last 3 Months</option>
                  <option value="6months">Last 6 Months</option>
                  <option value="1year">Last Year</option>
                </select>
                <button
                  onClick={fetchInsights}
                  className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {user?.role === 'patient' ? (
          /* Patient Insights */
          <div className="space-y-8">
            {/* Health Score Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Overall Health Score</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Updated 2 hours ago</span>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 items-center">
                <div className="text-center">
                  <HealthScoreGauge score={insights.healthScore.current} category={insights.healthScore.category} />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Previous Score:</span>
                    <span className="font-semibold">{insights.healthScore.previous}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Change:</span>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(insights.healthScore.trend)}
                      <span className="font-semibold text-green-600">
                        +{insights.healthScore.current - insights.healthScore.previous}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor('low')}`}>
                      {insights.healthScore.category}
                    </span>
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">What this means:</h3>
                  <p className="text-sm text-purple-800">
                    Your health score has improved by 6 points! This indicates better overall health 
                    management and adherence to recommendations.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Risk Assessment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Risk Assessment</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(insights.riskAssessment).map(([condition, data], index) => (
                  <div key={condition} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 capitalize">
                        {condition.replace(/([A-Z])/g, ' $1').trim()}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(data.trend)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(data.level)}`}>
                          {data.level}
                        </span>
                      </div>
                    </div>
                    <RiskMeter score={data.score} level={data.level} />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Vital Signs Trends */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Vital Signs</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(insights.vitals).map(([vital, data]) => (
                  <div key={vital} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Heart className="w-6 h-6 text-red-500 mr-2" />
                      <h3 className="font-semibold text-gray-900 capitalize">
                        {vital.replace(/([A-Z])/g, ' $1').trim()}
                      </h3>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">{data.value}</p>
                    <div className="flex items-center justify-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        data.status === 'normal' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {data.status}
                      </span>
                      {getTrendIcon(data.trend)}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">AI Recommendations</h2>
              
              <div className="space-y-4">
                {insights.recommendations.map((rec, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Target className="w-5 h-5 text-purple-600" />
                          <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            rec.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {rec.priority} priority
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{rec.description}</p>
                        <p className="text-sm text-purple-600 font-medium">{rec.impact}</p>
                      </div>
                      <button className="ml-4 p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                        <Info className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Alerts */}
            {insights.alerts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Health Alerts</h2>
                
                <div className="space-y-4">
                  {insights.alerts.map((alert, index) => (
                    <div key={index} className={`p-4 rounded-lg border-l-4 ${
                      alert.severity === 'high' ? 'bg-red-50 border-red-500' : 'bg-yellow-50 border-yellow-500'
                    }`}>
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                          alert.severity === 'high' ? 'text-red-600' : 'text-yellow-600'
                        }`} />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{alert.message}</p>
                          <p className="text-sm text-gray-600 mt-1">{new Date(alert.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          /* Doctor Insights */
          <div className="space-y-8">
            {/* Patient Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-4 gap-6"
            >
              {[
                { title: 'Total Patients', value: insights.patientOverview.totalPatients, icon: User, color: 'blue' },
                { title: 'Active Patients', value: insights.patientOverview.activePatients, icon: Activity, color: 'green' },
                { title: 'High Risk', value: insights.patientOverview.highRiskPatients, icon: AlertTriangle, color: 'red' },
                { title: 'Today\'s Appointments', value: insights.patientOverview.appointmentsToday, icon: Calendar, color: 'purple' }
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Diagnostic Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">AI Diagnostic Suggestions</h2>
              
              <div className="space-y-4">
                {insights.diagnosticInsights.map((insight, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <User className="w-5 h-5 text-blue-600" />
                          <h3 className="font-semibold text-gray-900">{insight.patientName}</h3>
                          <span className="text-sm text-gray-500">ID: {insight.patientId}</span>
                        </div>
                        <div className="mb-2">
                          <span className="font-medium text-gray-900">{insight.condition}</span>
                          <span className="ml-2 text-sm text-blue-600">
                            Confidence: {Math.round(insight.confidence * 100)}%
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{insight.reasoning}</p>
                        <p className="text-sm font-medium text-green-600">{insight.recommendation}</p>
                      </div>
                      <div className="ml-4 flex items-center space-x-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-2 bg-blue-500 rounded-full"
                            style={{ width: `${insight.confidence * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Anomaly Detection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Anomaly Detection</h2>
              
              <div className="space-y-4">
                {insights.anomalies.map((anomaly, index) => (
                  <div key={index} className={`p-4 rounded-lg border-l-4 ${
                    anomaly.severity === 'high' ? 'bg-red-50 border-red-500' : 'bg-yellow-50 border-yellow-500'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <AlertTriangle className={`w-5 h-5 ${
                            anomaly.severity === 'high' ? 'text-red-600' : 'text-yellow-600'
                          }`} />
                          <h3 className="font-semibold text-gray-900">{anomaly.patientName}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            anomaly.severity === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {anomaly.severity}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-1">{anomaly.description}</p>
                        <p className="text-sm text-gray-500">{new Date(anomaly.date).toLocaleDateString()}</p>
                      </div>
                      <button className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                        Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Predictive Analytics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Predictive Analytics</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Risk Factors Analyzed</h3>
                  <div className="space-y-2">
                    {insights.predictiveAnalytics.riskFactors.map((factor, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Predicted Conditions</h3>
                  <div className="space-y-3">
                    {insights.predictiveAnalytics.predictions.map((prediction, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900">{prediction.condition}</span>
                          <span className="text-sm text-gray-600">{prediction.patients} patients</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Risk: {Math.round(prediction.probability * 100)}%</span>
                          <span className="text-gray-600">Timeframe: {prediction.timeframe}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Treatment Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Treatment Recommendations</h2>
              
              <div className="space-y-4">
                {insights.treatmentRecommendations.map((treatment, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{treatment.treatment}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          treatment.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {treatment.priority} priority
                        </span>
                        <span className="text-sm text-gray-600">{treatment.patients} patients</span>
                      </div>
                    </div>
                    <p className="text-gray-600">{treatment.details}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Insights;