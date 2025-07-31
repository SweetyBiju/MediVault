

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Shield, 
  Users, 
  Award, 
  Target, 
  Globe,
  CheckCircle,
  ArrowRight,
  Linkedin,
  Twitter,
  Mail
} from 'lucide-react';

const About = () => {
  const team = [
    {
      name: "Sweety",
      role: "Team-Member",
      bio: "--",
      avatar: "#",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Yosobanta",
      role: "Team-Member",
      bio: "--",
      avatar: "#",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Neelansh",
      role: "Team-Member",
      bio: "--",
      avatar: "#",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Shubh",
      role: "Team-Member",
      bio: "--",
      avatar: "#",
      linkedin: "#",
      twitter: "#"
    }
  ];

  // const milestones = [
  //   {
  //     year: "2022",
  //     title: "Company Founded",
  //     description: "MediVault was born from a vision to democratize healthcare data access."
  //   },
  //   {
  //     year: "2023",
  //     title: "Series A Funding",
  //     description: "Raised $15M to accelerate platform development and security features."
  //   },
  //   {
  //     year: "2023",
  //     title: "HIPAA Certification",
  //     description: "Achieved full HIPAA compliance and SOC 2 Type II certification."
  //   },
  //   {
  //     year: "2024",
  //     title: "AI Integration",
  //     description: "Launched advanced AI-powered health insights and diagnostic assistance."
  //   },
  //   {
  //     year: "2024",
  //     title: "50K+ Users",
  //     description: "Reached milestone of 50,000 patients and 1,200+ healthcare providers."
  //   }
  // ];

  const values = [
    {
      icon: Shield,
      title: "Security First",
      description: "Your health data deserves the highest level of protection with bank-grade encryption."
    },
    {
      icon: Users,
      title: "Patient Empowerment",
      description: "Putting patients in control of their health journey with accessible, actionable insights."
    },
    {
      icon: Heart,
      title: "Compassionate Care",
      description: "Technology should enhance, not replace, the human connection in healthcare."
    },
    {
      icon: Globe,
      title: "Universal Access",
      description: "Making quality healthcare management accessible to everyone, everywhere."
    }
  ];

  const achievements = [
    "HIPAA & GDPR Compliant",
    "SOC 2 Type II Certified",
    "99.9% Uptime Guarantee",
    "AES-256 Encryption",
    "24/7 Security Monitoring",
    "ISO 27001 Certified"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Democratizing Healthcare with{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Secure, AI-Powered Solutions
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              At MediVault, we believe that every person deserves secure, accessible, and intelligent 
              healthcare management. Our mission is to bridge the gap between patients and providers 
              through innovative technology.
            </p>
            <div className="flex justify-center">
              <div className="relative">
                <Heart className="w-16 h-16 text-red-500 animate-pulse" />
                <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 animate-ping"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                To revolutionize healthcare by creating a secure, intelligent platform that empowers 
                patients to take control of their health data while enabling healthcare providers to 
                deliver more personalized, efficient care.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We envision a world where medical records are never lost, health insights are 
                accessible to everyone, and the doctor-patient relationship is strengthened through 
                technology, not hindered by it.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
                <Target className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-blue-100 leading-relaxed">
                  A future where healthcare is truly patient-centered, where every individual has 
                  complete control over their health journey, and where AI-powered insights help 
                  prevent diseases before they occur.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do at MediVault
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105"
              >
                <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      {/* <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600">
              Key milestones in our mission to transform healthcare
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-blue-600 to-purple-600"></div>
            
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`relative flex items-center mb-12 ${
                  index % 2 === 0 ? 'justify-start' : 'justify-end'
                }`}
              >
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="text-2xl font-bold text-blue-600 mb-2">{milestone.year}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
                
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full border-4 border-white shadow-lg"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Passionate healthcare and technology experts dedicated to improving lives
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group hover:scale-105"
              >
                <div className="relative">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{member.bio}</p>
                  <div className="flex space-x-3">
                    <a
                      href={member.linkedin}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Linkedin className="w-4 h-4 text-gray-600 hover:text-blue-600" />
                    </a>
                    <a
                      href={member.twitter}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Twitter className="w-4 h-4 text-gray-600 hover:text-blue-600" />
                    </a>
                    <a
                      href={`mailto:${member.name.toLowerCase().replace(' ', '.')}@medivault.com`}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Mail className="w-4 h-4 text-gray-600 hover:text-blue-600" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Security & Compliance</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your trust is our foundation. We maintain the highest standards of security and compliance.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center space-x-3 bg-green-50 p-4 rounded-lg border border-green-200"
              >
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                <span className="font-medium text-gray-900">{achievement}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Join the Healthcare Revolution?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Experience the future of healthcare management with MediVault
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 inline-flex items-center justify-center space-x-2 shadow-lg font-semibold">
                <span>Get Started Today</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-all inline-flex items-center justify-center space-x-2 font-semibold">
                <span>Schedule Demo</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
