import React from 'react';

interface YoutubeTheatreProps {
  videoId: string;
}

const YoutubeTheatre: React.FC<YoutubeTheatreProps> = ({ videoId }) => {
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
        <iframe
          src={`https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${process.env.NEXT_PUBLIC_DOMAIN ?? 'localhost'}&dark_theme=1`}
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
};

export default YoutubeTheatre;
