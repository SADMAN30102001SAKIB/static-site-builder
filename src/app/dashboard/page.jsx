"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import WebsiteCard from '@/components/dashboard/WebsiteCard';
import StatCard from '@/components/dashboard/StatCard';
import ActivityLog from '@/components/dashboard/ActivityLog';
import NotificationsPanel from '@/components/dashboard/NotificationsPanel';
import useUserStore from '@/store/useUserStore';

export default function Dashboard() {
  const { data: session } = useSession();
  const [websites, setWebsites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Get dashboard widget settings from user store
  const { dashboardWidgets, addRecentWebsite, recentlyVisitedWebsites } = useUserStore();
  
  // Sample data for activity log
  const [activities, setActivities] = useState([
    {
      id: '1',
      action: 'Website published: Portfolio',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'success'
    },
    {
      id: '2',
      action: 'New page created: Services',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      status: 'success'
    },
    {
      id: '3',
      action: 'Template applied: Business',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      status: 'info'
    }
  ]);
  
  // Sample data for notifications
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Website published',
      message: 'Your website "Portfolio" has been successfully published.',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false,
      type: 'success'
    },
    {
      id: '2',
      title: 'New feature available',
      message: 'Try our new SEO optimization tools to improve your website ranking.',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      read: false,
      type: 'info'
    },
    {
      id: '3',
      title: 'Scheduled maintenance',
      message: 'The builder will be in maintenance mode on Sunday from 2AM to 4AM UTC.',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      read: true,
      type: 'warning'
    }
  ]);

  useEffect(() => {
    async function fetchWebsites() {
      try {
        setIsLoading(true);
        setError('');
        
        const response = await fetch('/api/websites');
        
        if (!response.ok) {
          throw new Error('Failed to fetch websites');
        }
        
        const data = await response.json();
        const websiteData = data.websites || [];
        setWebsites(websiteData);
        
        // Update recent websites in the store
        if (websiteData.length > 0) {
          websiteData.slice(0, 3).forEach(website => {
            addRecentWebsite({
              id: website.id,
              name: website.name,
              lastEdited: website.updatedAt || new Date().toISOString()
            });
          });
        }
      } catch (err) {
        console.error('Error fetching websites:', err);
        setError('Failed to load your websites. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchWebsites();
  }, [addRecentWebsite]);
  
  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
  };
  
  const handleDismissNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  const handleEditWebsite = (id) => {
    window.location.href = `/builder/${id}`;
  };
  
  const handleManageWebsite = (id) => {
    window.location.href = `/dashboard/websites/${id}`;
  };
  
  const handlePreviewWebsite = (id) => {
    window.open(`/preview/${id}`, '_blank');
  };

  return (
    <Container maxWidth="max-w-6xl">
      <header className="mb-8 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome, {session?.user?.name || 'User'}!
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your websites or create a new one.
          </p>
        </div>
        
        <Button
          href="/dashboard/websites/new"
          variant="primary"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Create New Website
        </Button>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Total Websites"
              value={websites.length.toString()}
              icon={
                <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              }
            />
            <StatCard
              title="Published"
              value={websites.filter(w => w.published).length.toString()}
              trend="up"
              trendValue="20%"
              icon={
                <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatCard
              title="Total Pages"
              value={(websites.reduce((sum, website) => sum + (website.pages?.length || 0), 0)).toString()}
              icon={
                <svg className="h-5 w-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />
            <StatCard
              title="This Month"
              value="5"
              trend="up"
              trendValue="3"
              icon={
                <svg className="h-5 w-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>
          
          <Card 
            title="Recent Websites"
            headerAction={
              <Button 
                href="/dashboard/websites" 
                variant="ghost"
                size="sm"
              >
                View All
              </Button>
            }
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[rgb(var(--primary))]"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your websites...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg">
                {error}
              </div>
            ) : websites.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-4">
                  <svg 
                    className="h-8 w-8 text-gray-400 dark:text-gray-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" 
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  No websites yet
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  Get started by creating a new website with our drag and drop builder.
                </p>
                <div className="mt-6">
                  <Button 
                    href="/dashboard/websites/new" 
                    variant="primary"
                  >
                    <svg 
                      className="mr-2 h-5 w-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M12 4v16m8-8H4" 
                      />
                    </svg>
                    Create New Website
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {websites.slice(0, 4).map((website) => (
                  <WebsiteCard
                    key={website.id}
                    website={website}
                    onEdit={() => handleEditWebsite(website.id)}
                    onManage={() => handleManageWebsite(website.id)}
                    onPreview={() => handlePreviewWebsite(website.id)}
                  />
                ))}
                
                {websites.length > 4 && (
                  <div className="sm:col-span-2 flex justify-center mt-2">
                    <Button 
                      href="/dashboard/websites" 
                      variant="ghost"
                    >
                      View All Websites
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Card>
          
          {dashboardWidgets?.activityLog !== false && (
            <Card 
              title="Recent Activity" 
              className="mt-6"
              headerAction={
                <Button 
                  href="/dashboard/activity" 
                  variant="ghost"
                  size="sm"
                >
                  View All
                </Button>
              }
            >
              <ActivityLog activities={activities} maxItems={5} />
            </Card>
          )}
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          {dashboardWidgets?.notifications !== false && (
            <NotificationsPanel 
              notifications={notifications}
              onMarkAllRead={handleMarkAllNotificationsRead}
              onDismiss={handleDismissNotification}
            />
          )}
          
          <Card title="Quick Actions">
            <div className="space-y-2">
              <Button
                href="/dashboard/websites/new"
                variant="outline"
                fullWidth
                className="justify-start"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Create New Website
              </Button>
              
              <Button
                href="/dashboard/templates"
                variant="outline"
                fullWidth
                className="justify-start"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                Browse Templates
              </Button>
              
              <Button
                href="/dashboard/domains"
                variant="outline"
                fullWidth
                className="justify-start"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
                Manage Domains
              </Button>
              
              <Button
                href="/dashboard/profile"
                variant="outline"
                fullWidth
                className="justify-start"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Update Profile
              </Button>
            </div>
          </Card>
          
          {recentlyVisitedWebsites.length > 0 && (
            <Card title="Recently Visited">
              <div className="space-y-2">
                {recentlyVisitedWebsites.map(website => (
                  <div key={website.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-medium">
                        {website.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {website.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(website.lastEdited).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      href={`/builder/${website.id}`}
                      variant="ghost"
                      size="sm"
                    >
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
      
      {dashboardWidgets?.quickTips !== false && (
        <Card
          title="Quick Tips"
          description="Helpful advice to get the most out of the website builder"
          className="mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">Drag and Drop</h4>
                  <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                    Use drag and drop to easily arrange components on your pages
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-purple-500 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-purple-800 dark:text-purple-300">Preview Mode</h4>
                  <p className="mt-1 text-sm text-purple-700 dark:text-purple-400">
                    Preview your website before publishing to see how it looks to visitors
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-green-800 dark:text-green-300">Form Components</h4>
                  <p className="mt-1 text-sm text-green-700 dark:text-green-400">
                    Add form components to collect information from your website visitors
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-amber-500 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.172 2.172a2 2 0 010 2.828l-8.486 8.486a4 4 0 01-5.656 0M7 17h.01" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300">Customize Style</h4>
                  <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
                    Customize colors and fonts to match your brand identity
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
      
      <Card
        title="Getting Started"
        description="How to create your first website in minutes"
        className="mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
              <span className="text-xl font-bold">1</span>
            </div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Choose a Template</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Select from a variety of professionally designed templates or start from scratch.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
              <span className="text-xl font-bold">2</span>
            </div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Customize Content</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Drag and drop elements to create your perfect layout with your own content.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
              <span className="text-xl font-bold">3</span>
            </div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Publish & Share</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Publish your site with one click and share it with the world.
            </p>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Button 
            href="/dashboard/websites/new" 
            variant="primary"
          >
            Start Building Now
          </Button>
        </div>
      </Card>
    </Container>
  );
}
