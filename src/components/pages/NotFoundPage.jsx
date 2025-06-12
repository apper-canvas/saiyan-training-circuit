import React from 'react';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <ApperIcon name="AlertTriangle" className="h-24 w-24 text-saiyan-orange mx-auto mb-4" />
          <h1 className="text-6xl font-bold text-saiyan-gold mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-white mb-4">Page Not Found</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            This training ground doesn't exist! Even Goku couldn't find this page with his instant transmission.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-saiyan-orange to-saiyan-gold text-white font-semibold py-3 px-6 rounded-xl hover:shadow-power transition-all duration-300 transform hover:scale-105"
        >
          <ApperIcon name="Home" className="h-5 w-5" />
          <span>Return to Training</span>
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;