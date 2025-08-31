'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CollaborationPage() {
  const router = useRouter();
  const [mode, setMode] = useState('client'); // 'server' or 'client'
  const [serverAddress, setServerAddress] = useState('');
  const [connectedClients, setConnectedClients] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const startServerMode = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/collaboration/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet_address: localStorage.getItem('walletAddress'),
          max_clients: 4
        })
      });

      const data = await response.json();
      if (data.success) {
        setSessionId(data.sessionId);
        setMode('server');
        // Start polling for connected clients
        pollForClients(data.sessionId);
      }
    } catch (error) {
      console.error('Error creating server session:', error);
    }
    setIsLoading(false);
  };

  const joinServerMode = async () => {
    if (!serverAddress) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/collaboration/join-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          server_address: serverAddress,
          client_address: localStorage.getItem('walletAddress')
        })
      });

      const data = await response.json();
      if (data.success) {
        setSessionId(data.sessionId);
        setMode('client');
        // Redirect to collaborative workspace
        router.push(`/workspace?collaboration=${data.sessionId}&mode=client`);
      }
    } catch (error) {
      console.error('Error joining session:', error);
    }
    setIsLoading(false);
  };

  const pollForClients = (sessionId) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/collaboration/session-status?sessionId=${sessionId}`);
        const data = await response.json();
        if (data.success) {
          setConnectedClients(data.clients);
        }
      } catch (error) {
        console.error('Error polling clients:', error);
      }
    }, 2000);

    return interval;
  };

  const startCollaborativeWorkspace = () => {
    if (sessionId) {
      router.push(`/workspace?collaboration=${sessionId}&mode=server`);
    }
  };

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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Collaborative Workspace
          </h1>
          <p className="text-gray-300 text-center mb-12">
            Work together in real-time on blockchain automation workflows
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Server Mode */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12l4-4m-4 4l4 4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Host Session</h3>
                <p className="text-gray-300">
                  Create a collaborative workspace for up to 4 clients
                </p>
              </div>

              {mode !== 'server' ? (
                <button
                  onClick={startServerMode}
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Creating Session...' : 'Start Server Mode'}
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-green-900/50 border border-green-700 rounded-lg">
                    <p className="text-green-400 font-semibold">Server Active</p>
                    <p className="text-gray-300 text-sm">Session ID: {sessionId}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-white font-semibold">Connected Clients ({connectedClients.length}/4)</h4>
                    {connectedClients.map((client, index) => (
                      <div key={index} className="flex items-center space-x-2 text-gray-300">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-sm">{client.slice(0, 10)}...{client.slice(-4)}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={startCollaborativeWorkspace}
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-600 transition-all"
                  >
                    Enter Workspace
                  </button>
                </div>
              )}
            </div>

            {/* Client Mode */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Join Session</h3>
                <p className="text-gray-300">
                  Connect to an existing collaborative workspace
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Server Wallet Address
                  </label>
                  <input
                    type="text"
                    value={serverAddress}
                    onChange={(e) => setServerAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <button
                  onClick={joinServerMode}
                  disabled={isLoading || !serverAddress}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-600 transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Joining...' : 'Join Session'}
                </button>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-white font-semibold mb-2">Real-time Sync</h4>
              <p className="text-gray-400 text-sm">All changes sync instantly across connected clients</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-white font-semibold mb-2">Blockchain Secured</h4>
              <p className="text-gray-400 text-sm">All sessions secured by wallet authentication</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="text-white font-semibold mb-2">Up to 4 Users</h4>
              <p className="text-gray-400 text-sm">Collaborate with multiple team members simultaneously</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}