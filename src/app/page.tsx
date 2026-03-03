export default function LandingPage() {
  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4">
      <div className="relative w-full h-[80vh] max-w-7xl">
        {/* 3D Background Frame */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-cyan-600/20 rounded-3xl transform rotate-1 scale-105 blur-xl"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-600/10 via-indigo-600/10 to-teal-600/10 rounded-3xl transform -rotate-1 scale-102 blur-lg"></div>
        
        {/* Main Frame - Empty */}
        <div className="relative w-full h-full bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl">
          {/* Empty content - just the frame */}
        </div>
      </div>
    </div>
  );
}
