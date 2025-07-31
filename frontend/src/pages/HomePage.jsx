import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Brain, 
  Calendar, 
  Heart, 
  Activity, 
  Lock,
  Plus,
  Minus,
  Star,
  ArrowRight,
  CheckCircle,
  Users,
  Globe,
  Stethoscope
} from 'lucide-react';

const HomePage = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const features = [
    {
      icon: Shield,
      title: "Secure Medical Records",
      description: "Bank-level encryption with blockchain-inspired security for your sensitive health data",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Get personalized health recommendations and early risk detection powered by advanced AI",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Calendar,
      title: "Easy Appointments",
      description: "Book, reschedule, and manage appointments with real-time doctor availability",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Activity,
      title: "Health Monitoring",
      description: "Track your health trends and get alerts for important changes in your condition",
      color: "from-orange-500 to-red-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Patient",
      content: "MediVault saved me hours during my emergency visit. Having all my records instantly accessible was a lifesaver!",
      rating: 5,
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      name: "Dr. Michael Chen",
      role: "Cardiologist",
      content: "The AI insights help me make better diagnoses faster. My patients love the seamless experience.",
      rating: 5,
      avatar: "https://images.pexels.com/photos/582750/pexels-photo-582750.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      name: "Maria Rodriguez",
      role: "Patient",
      content: "Finally, a platform that puts patients in control of their health data. The security features give me peace of mind.",
      rating: 5,
      avatar: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150"
    }
  ];

  const patientFAQs = [
    {
      question: "How secure is my health data?",
      answer: "We use AES-256 encryption, the same standard used by banks and government agencies. Your data is stored with blockchain-inspired security features and comprehensive audit logs."
    },
    {
      question: "Can I share my records with any doctor?",
      answer: "Yes! You can securely share specific records with any healthcare provider through time-limited, encrypted links. You maintain full control over who sees what."
    },
    {
      question: "What happens if I lose my phone?",
      answer: "Your data is safely stored in our secure cloud infrastructure. Simply log in from any device using your credentials and optional two-factor authentication."
    },
    {
      question: "How does the AI health insight work?",
      answer: "Our AI analyzes your health records, lab results, and trends to provide personalized recommendations and early risk detection. All analysis is done while maintaining your privacy."
    }
  ];

  const doctorFAQs = [
    {
      question: "How do I verify my medical credentials?",
      answer: "During registration, you'll provide your medical license number, specialty, and hospital affiliation. Our verification team reviews and confirms your credentials within 24-48 hours."
    },
    {
      question: "Can I access patient records instantly?",
      answer: "Yes, with proper patient consent. Patients can share their records with you through secure, time-limited access links, giving you immediate access to their medical history."
    },
    {
      question: "Does the platform support telehealth?",
      answer: "Absolutely! Schedule and conduct virtual consultations directly through the platform with integrated video calling and secure messaging features."
    },
    {
      question: "How does the AI diagnostic assistance work?",
      answer: "Our AI analyzes patient data to highlight potential anomalies, suggest differential diagnoses, and provide evidence-based treatment recommendations to support your clinical decisions."
    }
  ];

  const stats = [
    { number: "50K+", label: "Patients Protected", icon: Users },
    { number: "1,200+", label: "Healthcare Providers", icon: Stethoscope },
    { number: "99.9%", label: "Uptime Guarantee", icon: Shield },
    { number: "24/7", label: "Support Available", icon: Heart }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Your Health,{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Your Control
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Secure medical records, AI-powered insights, and seamless healthcare management. 
                Access your health data anytime, anywhere with bank-level security.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 inline-flex items-center justify-center space-x-2 shadow-lg"
                >
                  <span className="font-semibold">Get Started Free</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/about"
                  className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-50 transition-all inline-flex items-center justify-center space-x-2"
                >
                  <span className="font-semibold">Learn More</span>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl transform rotate-3 opacity-20"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm">
                  <div className="flex items-center justify-center space-x-4 mb-6">
                    <div className="relative">
                      <Heart className="w-16 h-16 text-red-500 animate-pulse" />
                      <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 animate-ping"></div>
                    </div>
                    <div className="text-center">
                      <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mb-2"></div>
                      <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mb-2"></div>
                      <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Health Monitoring</h3>
                    <p className="text-gray-600 text-sm">AI-powered insights at your fingertips</p>
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">98%</div>
                      <div className="text-xs text-gray-600">Accuracy</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">24/7</div>
                      <div className="text-xs text-gray-600">Monitoring</div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">5min</div>
                      <div className="text-xs text-gray-600">Response</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Revolutionizing Healthcare Management
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of healthcare with our comprehensive platform designed for both patients and providers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105"
              >
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-xl text-gray-600">
              See what our users say about their MediVault experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Get answers to common questions about MediVault
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Patient FAQs */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Users className="w-6 h-6 mr-2 text-blue-600" />
                For Patients
              </h3>
              <div className="space-y-4">
                {patientFAQs.map((faq, index) => (
                  <div key={`patient-${index}`} className="bg-white rounded-lg shadow-md">
                    <button
                      onClick={() => setOpenFAQ(openFAQ === `patient-${index}` ? null : `patient-${index}`)}
                      className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      {openFAQ === `patient-${index}` ? (
                        <Minus className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <Plus className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      )}
                    </button>
                    {openFAQ === `patient-${index}` && (
                      <div className="px-6 pb-6">
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Doctor FAQs */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Stethoscope className="w-6 h-6 mr-2 text-purple-600" />
                For Doctors
              </h3>
              <div className="space-y-4">
                {doctorFAQs.map((faq, index) => (
                  <div key={`doctor-${index}`} className="bg-white rounded-lg shadow-md">
                    <button
                      onClick={() => setOpenFAQ(openFAQ === `doctor-${index}` ? null : `doctor-${index}`)}
                      className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      {openFAQ === `doctor-${index}` ? (
                        <Minus className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <Plus className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      )}
                    </button>
                    {openFAQ === `doctor-${index}` && (
                      <div className="px-6 pb-6">
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Transform Your Healthcare Experience?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of patients and healthcare providers who trust MediVault with their health data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 inline-flex items-center justify-center space-x-2 shadow-lg font-semibold"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="border border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-all inline-flex items-center justify-center space-x-2 font-semibold"
              >
                <span>Contact Sales</span>
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center space-x-6 text-blue-100">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Free 30-day trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>24/7 support</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="w-8 h-8 text-red-500" />
                <span className="text-xl font-bold">MediVault</span>
              </div>
              <p className="text-gray-400">
                Democratizing healthcare with secure, AI-powered solutions for patients and providers.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/security" className="hover:text-white transition-colors">Security</Link></li>
                <li><Link to="/api" className="hover:text-white transition-colors">API</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/press" className="hover:text-white transition-colors">Press</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/status" className="hover:text-white transition-colors">Status</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 MediVault. All rights reserved. Made with ❤️ for better healthcare.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;