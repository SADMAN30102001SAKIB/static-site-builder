"use client";

import { useState } from 'react';

export default function SeoPanel({ pageData, onUpdate }) {
  const [seoData, setSeoData] = useState({
    title: pageData?.seo?.title || '',
    description: pageData?.seo?.description || '',
    keywords: pageData?.seo?.keywords || '',
    canonical: pageData?.seo?.canonical || '',
    ogTitle: pageData?.seo?.ogTitle || '',
    ogDescription: pageData?.seo?.ogDescription || '',
    ogImage: pageData?.seo?.ogImage || '',
    twitterCard: pageData?.seo?.twitterCard || 'summary',
    twitterTitle: pageData?.seo?.twitterTitle || '',
    twitterDescription: pageData?.seo?.twitterDescription || '',
    twitterImage: pageData?.seo?.twitterImage || '',
    noIndex: pageData?.seo?.noIndex || false,
    noFollow: pageData?.seo?.noFollow || false,
    advancedRobots: pageData?.seo?.advancedRobots || '',
    structuredData: pageData?.seo?.structuredData || '',
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [titleScore, setTitleScore] = useState(0);
  const [descriptionScore, setDescriptionScore] = useState(0);
  const [overallScore, setOverallScore] = useState(0);
  const [recommendations, setRecommendations] = useState([]);

  // Handle field changes
  const handleChange = (field, value) => {
    const updatedSeoData = { ...seoData, [field]: value };
    setSeoData(updatedSeoData);
    onUpdate(updatedSeoData);
    analyzeSeo(updatedSeoData);
  };

  // SEO score analysis
  const analyzeSeo = (data) => {
    let newTitleScore = 0;
    let newDescriptionScore = 0;
    let newRecommendations = [];

    // Title analysis
    if (data.title) {
      const titleLength = data.title.length;
      if (titleLength >= 30 && titleLength <= 60) {
        newTitleScore = 100;
      } else if (titleLength > 0) {
        newTitleScore = 50;
        newRecommendations.push({
          type: 'warning',
          text: `Title length (${titleLength} characters) is ${titleLength < 30 ? 'too short' : 'too long'}. Optimal is 30-60 characters.`,
        });
      } else {
        newRecommendations.push({
          type: 'error',
          text: 'Page title is missing.',
        });
      }
    }

    // Description analysis
    if (data.description) {
      const descLength = data.description.length;
      if (descLength >= 120 && descLength <= 160) {
        newDescriptionScore = 100;
      } else if (descLength > 0) {
        newDescriptionScore = 50;
        newRecommendations.push({
          type: 'warning',
          text: `Description length (${descLength} characters) is ${descLength < 120 ? 'too short' : 'too long'}. Optimal is 120-160 characters.`,
        });
      } else {
        newRecommendations.push({
          type: 'error',
          text: 'Meta description is missing.',
        });
      }
    }

    // Keywords analysis
    if (!data.keywords) {
      newRecommendations.push({
        type: 'warning',
        text: 'No keywords specified.',
      });
    }

    // Social media analysis
    if (!data.ogTitle || !data.ogDescription || !data.ogImage) {
      newRecommendations.push({
        type: 'info',
        text: 'Social sharing metadata incomplete. Add Open Graph tags for better sharing experience.',
      });
    }

    const newOverallScore = Math.floor((newTitleScore + newDescriptionScore) / 2);

    setTitleScore(newTitleScore);
    setDescriptionScore(newDescriptionScore);
    setOverallScore(newOverallScore);
    setRecommendations(newRecommendations);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {/* Header with Score */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">SEO Settings</h2>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-600 dark:text-gray-400">SEO Score:</div>
          <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-medium ${
            overallScore >= 80 ? 'bg-green-500' : 
            overallScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
          }`}>
            {overallScore}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'basic'
                ? 'border-b-2 border-[rgb(var(--primary))] text-[rgb(var(--primary))]'
                : 'text-gray-500 dark:text-gray-400'
            }`}
            onClick={() => setActiveTab('basic')}
          >
            Basic SEO
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'social'
                ? 'border-b-2 border-[rgb(var(--primary))] text-[rgb(var(--primary))]'
                : 'text-gray-500 dark:text-gray-400'
            }`}
            onClick={() => setActiveTab('social')}
          >
            Social Media
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'advanced'
                ? 'border-b-2 border-[rgb(var(--primary))] text-[rgb(var(--primary))]'
                : 'text-gray-500 dark:text-gray-400'
            }`}
            onClick={() => setActiveTab('advanced')}
          >
            Advanced
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'analytics'
                ? 'border-b-2 border-[rgb(var(--primary))] text-[rgb(var(--primary))]'
                : 'text-gray-500 dark:text-gray-400'
            }`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow p-6 overflow-y-auto">
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Page Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={seoData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter page title (30-60 characters recommended)"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
              />
              <div className="mt-1 flex justify-between">
                <span className="text-xs text-gray-500">{seoData.title.length} characters</span>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 mr-1">Score:</span>
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center text-white text-xs ${
                    titleScore >= 80 ? 'bg-green-500' : 
                    titleScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}>
                    {titleScore}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Meta Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={seoData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter meta description (120-160 characters recommended)"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
              />
              <div className="mt-1 flex justify-between">
                <span className="text-xs text-gray-500">{seoData.description.length} characters</span>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 mr-1">Score:</span>
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center text-white text-xs ${
                    descriptionScore >= 80 ? 'bg-green-500' : 
                    descriptionScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}>
                    {descriptionScore}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Keywords
              </label>
              <input
                type="text"
                value={seoData.keywords}
                onChange={(e) => handleChange('keywords', e.target.value)}
                placeholder="Enter keywords separated by commas"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
              />
              <p className="mt-1 text-xs text-gray-500">Separate keywords with commas</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Canonical URL
              </label>
              <input
                type="text"
                value={seoData.canonical}
                onChange={(e) => handleChange('canonical', e.target.value)}
                placeholder="https://yourwebsite.com/page"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
              />
              <p className="mt-1 text-xs text-gray-500">Used to prevent duplicate content issues</p>
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-md font-medium text-gray-800 dark:text-white mb-4">Open Graph (Facebook, LinkedIn)</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    OG Title
                  </label>
                  <input
                    type="text"
                    value={seoData.ogTitle}
                    onChange={(e) => handleChange('ogTitle', e.target.value)}
                    placeholder="Enter Open Graph title"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    OG Description
                  </label>
                  <textarea
                    value={seoData.ogDescription}
                    onChange={(e) => handleChange('ogDescription', e.target.value)}
                    placeholder="Enter Open Graph description"
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    OG Image URL
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={seoData.ogImage}
                      onChange={(e) => handleChange('ogImage', e.target.value)}
                      placeholder="Enter Open Graph image URL"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md"
                    />
                    <button
                      type="button"
                      className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md"
                    >
                      Browse
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Recommended size: 1200 x 630 pixels</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <h3 className="text-md font-medium text-gray-800 dark:text-white mb-4">Twitter Card</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Card Type
                  </label>
                  <select
                    value={seoData.twitterCard}
                    onChange={(e) => handleChange('twitterCard', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  >
                    <option value="summary">Summary</option>
                    <option value="summary_large_image">Summary with Large Image</option>
                    <option value="app">App</option>
                    <option value="player">Player</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Twitter Title
                  </label>
                  <input
                    type="text"
                    value={seoData.twitterTitle}
                    onChange={(e) => handleChange('twitterTitle', e.target.value)}
                    placeholder="Enter Twitter title"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Twitter Description
                  </label>
                  <textarea
                    value={seoData.twitterDescription}
                    onChange={(e) => handleChange('twitterDescription', e.target.value)}
                    placeholder="Enter Twitter description"
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Twitter Image URL
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={seoData.twitterImage}
                      onChange={(e) => handleChange('twitterImage', e.target.value)}
                      placeholder="Enter Twitter image URL"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md"
                    />
                    <button
                      type="button"
                      className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md"
                    >
                      Browse
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="noindex"
                  checked={seoData.noIndex}
                  onChange={(e) => handleChange('noIndex', e.target.checked)}
                  className="h-4 w-4 text-[rgb(var(--primary))] rounded border-gray-300"
                />
                <label htmlFor="noindex" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  No Index (hide page from search engines)
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="nofollow"
                  checked={seoData.noFollow}
                  onChange={(e) => handleChange('noFollow', e.target.checked)}
                  className="h-4 w-4 text-[rgb(var(--primary))] rounded border-gray-300"
                />
                <label htmlFor="nofollow" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  No Follow (tell search engines not to follow links)
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Advanced Robots Directives
              </label>
              <input
                type="text"
                value={seoData.advancedRobots}
                onChange={(e) => handleChange('advancedRobots', e.target.value)}
                placeholder="e.g., noarchive, nosnippet, max-snippet:50"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
              />
              <p className="mt-1 text-xs text-gray-500">Comma-separated list of additional directives</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                JSON-LD Structured Data
              </label>
              <textarea
                value={seoData.structuredData}
                onChange={(e) => handleChange('structuredData', e.target.value)}
                placeholder='{"@context": "https://schema.org", "@type": "WebPage", ...}'
                rows="6"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md font-mono text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">Add structured data in JSON-LD format</p>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-md font-medium text-gray-800 dark:text-white mb-2">Google Analytics</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Google Analytics Measurement ID
                </label>
                <input
                  type="text"
                  placeholder="e.g., G-XXXXXXXXXX"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                />
                <p className="mt-1 text-xs text-gray-500">Enter your Google Analytics 4 Measurement ID</p>
              </div>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-800 dark:text-white mb-2">Google Tag Manager</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  GTM Container ID
                </label>
                <input
                  type="text"
                  placeholder="e.g., GTM-XXXXXXX"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                />
                <p className="mt-1 text-xs text-gray-500">Enter your Google Tag Manager container ID</p>
              </div>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-800 dark:text-white mb-2">Facebook Pixel</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Facebook Pixel ID
                </label>
                <input
                  type="text"
                  placeholder="e.g., 1234567890"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                />
                <p className="mt-1 text-xs text-gray-500">Enter your Facebook Pixel ID</p>
              </div>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-800 dark:text-white mb-2">Custom Scripts</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Head Scripts
                </label>
                <textarea
                  placeholder="<script>...</script>"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md font-mono text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">Scripts to be included in the &lt;head&gt; section</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SEO Recommendations</h3>
          <ul className="space-y-2">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start">
                <span className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center mr-2 ${
                  recommendation.type === 'error' ? 'bg-red-100 text-red-500' :
                  recommendation.type === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-500'
                }`}>
                  {recommendation.type === 'error' ? '!' :
                   recommendation.type === 'warning' ? '⚠' : 'ℹ'}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-300">{recommendation.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
