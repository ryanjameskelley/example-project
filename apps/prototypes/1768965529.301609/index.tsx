import { AuuiBanner } from '../../components/AuuiBanner';

import React from 'react';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const Badge = ({ children, variant = 'default', className = '' }: BadgeProps) => {
  const baseClasses = 'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
    outline: 'border border-gray-200 bg-white text-gray-900 hover:bg-gray-50',
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

function OriginalComponent() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Badge Component</h1>
        <p className="text-sm text-gray-600 mb-8">
          A simple badge component with multiple variants following shadcn/ui design patterns.
        </p>

        <div className="space-y-8">
          {/* Default Variant */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Default</h2>
              <p className="text-xs text-gray-500 mb-4">Primary badge variant with blue background</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge variant="default">Active</Badge>
              <Badge variant="default">New</Badge>
              <Badge variant="default">Featured</Badge>
              <Badge variant="default">Premium</Badge>
            </div>
          </div>

          {/* Secondary Variant */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Secondary</h2>
              <p className="text-xs text-gray-500 mb-4">Subtle gray background for less prominent badges</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary">Draft</Badge>
              <Badge variant="secondary">Pending</Badge>
              <Badge variant="secondary">In Review</Badge>
              <Badge variant="secondary">Archived</Badge>
            </div>
          </div>

          {/* Destructive Variant */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Destructive</h2>
              <p className="text-xs text-gray-500 mb-4">Red badge for errors, warnings, or critical states</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge variant="destructive">Error</Badge>
              <Badge variant="destructive">Failed</Badge>
              <Badge variant="destructive">Overdue</Badge>
              <Badge variant="destructive">Cancelled</Badge>
            </div>
          </div>

          {/* Outline Variant */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Outline</h2>
              <p className="text-xs text-gray-500 mb-4">Border-only variant for minimal emphasis</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline">Scheduled</Badge>
              <Badge variant="outline">Optional</Badge>
              <Badge variant="outline">Low Priority</Badge>
              <Badge variant="outline">Beta</Badge>
            </div>
          </div>

          {/* Use Case Examples */}
          <div className="mt-12 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Real-World Examples</h2>
            
            {/* Project Status Example */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">Website Redesign Project</h3>
                <Badge variant="default">Active</Badge>
              </div>
              <p className="text-sm text-gray-600">Complete overhaul of company website with modern design</p>
            </div>

            {/* Task Priority Example */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">Fix Critical Security Bug</h3>
                <Badge variant="destructive">Urgent</Badge>
              </div>
              <p className="text-sm text-gray-600">Address security vulnerability in authentication system</p>
            </div>

            {/* User Role Example */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">Sarah Chen</h3>
                <div className="flex gap-2">
                  <Badge variant="secondary">Admin</Badge>
                  <Badge variant="outline">Engineering</Badge>
                </div>
              </div>
              <p className="text-sm text-gray-600">s.chen@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Component(props: any) {
  return (
    <>
      <AuuiBanner galleryUrl="https://app.auui.ai/prototypes/1768965529.301609" />
      <div style={{ marginTop: '40px' }}>
        <OriginalComponent {...props} />
      </div>
    </>
  );
}