import React from 'react';
import { ShieldCheck, Stethoscope, Banknote } from 'lucide-react';

const insurancePlans = [
  {
    title: 'Essential Care',
    icon: <ShieldCheck size={32} className="text-blue-600" />,
    price: '₹249/month',
    benefits: ['Up to ₹2L coverage', 'OPD Visits', 'Emergency Cashless'],
  },
  {
    title: 'Smart Health+',
    icon: <Stethoscope size={32} className="text-green-600" />,
    price: '₹499/month',
    benefits: ['Up to ₹5L coverage', 'Free Annual Checkup', 'Teleconsultations'],
  },
  {
    title: 'Ultimate Shield',
    icon: <Banknote size={32} className="text-purple-600" />,
    price: '₹999/month',
    benefits: ['₹10L coverage', 'Dental + Vision', 'All Premium Features'],
  }
];

const HealthInsurance = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 text-gray-800 dark:text-white px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Choose a Health Insurance Plan</h1>
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {insurancePlans.map((plan, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:scale-[1.02] transition">
            <div className="flex items-center gap-3 mb-4">
              {plan.icon}
              <h3 className="text-xl font-semibold">{plan.title}</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{plan.price}</p>
            <ul className="mt-4 text-sm list-disc pl-5 text-gray-600 dark:text-gray-300">
              {plan.benefits.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
            <button className="mt-6 bg-blue-700 hover:bg-blue-800 text-white w-full py-2 rounded shadow">
              Apply Now →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthInsurance;
