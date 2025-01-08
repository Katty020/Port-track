import React from 'react';
import { Link } from 'react-router-dom';
import { LineChart, TrendingUp, Shield } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      <main className="flex-1">
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Track Your Investments with Confidence
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              A powerful portfolio tracking platform that helps you monitor your investments,
              analyze performance, and make informed decisions.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
              <TrendingUp className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>

        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Key Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<LineChart className="h-8 w-8 text-blue-500" />}
                title="Real-time Tracking"
                description="Monitor your portfolio value with real-time stock price updates"
              />
              <FeatureCard
                icon={<TrendingUp className="h-8 w-8 text-green-500" />}
                title="Performance Analytics"
                description="Analyze your portfolio's performance with detailed metrics and charts"
              />
              <FeatureCard
                icon={<Shield className="h-8 w-8 text-purple-500" />}
                title="Secure & Private"
                description="Your data is encrypted and stored securely with industry-standard protection"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-700 text-center">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

export default LandingPage;