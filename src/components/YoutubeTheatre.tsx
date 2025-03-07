import React, { useEffect, useState } from 'react';

interface YoutubeTheatreProps {
  videoId: string;
}

const YoutubeTheatre: React.FC<YoutubeTheatreProps> = ({ videoId }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get auth status and token
        const response = await fetch('/api/youtube/auth/check');
        const data = await response.json();
        setIsAuthenticated(response.ok);
        if (data.accessToken) {
          setAccessToken(data.accessToken);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    void checkAuth();
  }, []);

  return (
    <div className="flex flex-row w-full h-full">
      {/* Video section */}
      <div className="flex-1 relative">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          className="absolute inset-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      
      {/* Chat section */}
      <div className="w-[400px] h-full bg-black border-l border-white/10">
        {isAuthenticated ? (
          <iframe
            src={`https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${window.location.hostname}&dark_theme=1${accessToken ? `&authorization=${accessToken}` : ''}`}
            className="w-full h-full border-0"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6 space-y-4">
            <p className="text-white/80 text-center">Sign in with YouTube to participate in chat</p>
            {/* Changed from button to anchor tag with direct href */}
            <a
              href="/api/youtube/auth"
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M10,14.598V9.402c0-0.385,0.417-0.625,0.75-0.433l4.5,2.598c0.333,0.192,0.333,0.674,0,0.866l-4.5,2.598 C10.417,15.224,10,14.983,10,14.598z"/>
              </svg>
              <span>Sign in with YouTube</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default YoutubeTheatre;
