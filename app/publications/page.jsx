'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PublicationsPage() {
  const [activeTab, setActiveTab] = useState('browse'); // 'browse', 'sell', 'collaborate'
  const [publications, setPublications] = useState([]);
  const [userWallet, setUserWallet] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [publishForm, setPublishForm] = useState({
    title: '',
    description: '',
    price: '',
    type: 'sell', // 'sell' or 'collaborate'
    workflow_data: null,
    collaboration_spots: 4
  });

  useEffect(() => {
    setUserWallet(localStorage.getItem('walletAddress') || '');
    loadPublications();
  }, []);

  const loadPublications = async () => {
    try {
      const response = await fetch('/api/publications/list');
      const data = await response.json();
      if (data.success) {
        setPublications(data.publications);
      }
    } catch (error) {
      console.error('Error loading publications:', error);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/publications/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...publishForm,
          creator_address: userWallet,
          price: publishForm.type === 'sell' ? parseFloat(publishForm.price) : 0
        })
      });

      const data = await response.json();
      if (data.success) {
        setPublishForm({
          title: '',
          description: '',
          price: '',
          type: 'sell',
          workflow_data: null,
          collaboration_spots: 4
        });
        loadPublications();
        setActiveTab('browse');
      }
    } catch (error) {
      console.error('Error publishing:', error);
    }
    setIsLoading(false);
  };

  const handlePurchase = async (publicationId, price) => {
    try {
      const response = await fetch('/api/publications/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publication_id: publicationId,
          buyer_address: userWallet,
          amount: price
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Purchase successful! Workflow downloaded.');
      }
    } catch (error) {
      console.error('Error purchasing:', error);
    }
  };

  const handleJoinCollaboration = async (publicationId) => {
    try {
      const response = await fetch('/api/publications/join-collaboration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publication_id: publicationId,
          collaborator_address: userWallet
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Joined collaboration! Check your dashboard.');
      }
    } catch (error) {
      console.error('Error joining collaboration:', error);
    }
  };

  const filteredPublications = publications.filter(pub => {
    if (activeTab === 'browse') return true;
    if (activeTab === 'sell') return pub.type === 'sell';
    if (activeTab === 'collaborate') return pub.type === 'collaborate';
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black">
      {/* Header */}
      <header className="p-6 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            <img src="/akroft-logo.png" alt="Akroft i8 Node" className="h-8" />
            <span className="text-xl font-bold text-white">Akroft i8 Node</span>
          </Link>
          <Link 
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Publications Marketplace
          </h1>
          <p className="text-gray-300 text-center mb-12">
            Share, sell, and collaborate on blockchain automation workflows
          </p>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-gray-800 rounded-xl p-2 mb-8 max-w-md mx-auto">
            {[
              { id: 'browse', label: 'Browse All', icon: '🔍' },
              { id: 'sell', label: 'For Sale', icon: '💰' },
              { id: 'collaborate', label: 'Collaborations', icon: '🤝' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Publications List */}
            <div className="lg:col-span-2">
              <div className="grid gap-6">
                {filteredPublications.map(pub => (
                  <div key={pub.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">{pub.title}</h3>
                        <p className="text-gray-300 mb-3">{pub.description}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-gray-400">
                            By {pub.creator_address.slice(0, 6)}...{pub.creator_address.slice(-4)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            pub.type === 'sell' 
                              ? 'bg-green-900 text-green-300' 
                              : 'bg-purple-900 text-purple-300'
                          }`}>
                            {pub.type === 'sell' ? 'For Sale' : 'Collaboration'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {pub.type === 'sell' ? (
                          <div>
                            <div className="text-2xl font-bold text-green-400 mb-2">
                              {pub.price} ETH
                            </div>
                            <button
                              onClick={() => handlePurchase(pub.id, pub.price)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Purchase
                            </button>
                          </div>
                        ) : (
                          <div>
                            <div className="text-sm text-gray-400 mb-2">
                              {pub.collaboration_spots} spots available
                            </div>
                            <button
                              onClick={() => handleJoinCollaboration(pub.id)}
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                              Join Collaboration
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Workflow Preview */}
                    <div className="mt-4 p-3 bg-gray-700/50 rounded-lg">
                      <div className="text-sm text-gray-400 mb-2">Workflow Preview:</div>
                      <div className="flex items-center space-x-2">
                        <div className="w-12 h-8 bg-blue-500 rounded text-white text-xs flex items-center justify-center">
                          INPUT
                        </div>
                        <div className="w-4 h-0.5 bg-gray-500"></div>
                        <div className="w-12 h-8 bg-purple-500 rounded text-white text-xs flex items-center justify-center">
                          LOGIC
                        </div>
                        <div className="w-4 h-0.5 bg-gray-500"></div>
                        <div className="w-12 h-8 bg-green-500 rounded text-white text-xs flex items-center justify-center">
                          OUTPUT
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredPublications.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-lg mb-4">No publications found</div>
                    <p className="text-gray-500">Be the first to publish a workflow!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Publish Form */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 sticky top-6">
                <h3 className="text-xl font-bold text-white mb-6">Publish Workflow</h3>

                <form onSubmit={handlePublish} className="space-y-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Title</label>
                    <input
                      type="text"
                      value={publishForm.title}
                      onChange={(e) => setPublishForm({...publishForm, title: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Description</label>
                    <textarea
                      value={publishForm.description}
                      onChange={(e) => setPublishForm({...publishForm, description: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Type</label>
                    <select
                      value={publishForm.type}
                      onChange={(e) => setPublishForm({...publishForm, type: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="sell">Sell Workflow</option>
                      <option value="collaborate">Seek Collaborators</option>
                    </select>
                  </div>

                  {publishForm.type === 'sell' ? (
                    <div>
                      <label className="block text-white font-semibold mb-2">Price (ETH)</label>
                      <input
                        type="number"
                        step="0.001"
                        value={publishForm.price}
                        onChange={(e) => setPublishForm({...publishForm, price: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-white font-semibold mb-2">Collaboration Spots</label>
                      <select
                        value={publishForm.collaboration_spots}
                        onChange={(e) => setPublishForm({...publishForm, collaboration_spots: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                      >
                        <option value={1}>1 Collaborator</option>
                        <option value={2}>2 Collaborators</option>
                        <option value={3}>3 Collaborators</option>
                        <option value={4}>4 Collaborators</option>
                      </select>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all disabled:opacity-50"
                  >
                    {isLoading ? 'Publishing...' : 'Publish Workflow'}
                  </button>
                </form>

                <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                  <div className="text-blue-400 font-semibold mb-2">💡 Pro Tip</div>
                  <p className="text-blue-300 text-sm">
                    Collaborate with others to build complex workflows or sell your 
                    proven automation solutions to the community!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}