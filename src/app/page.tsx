export default function LandingPage() {
  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4">
      <div className="relative w-full max-w-4xl">
        {/* 3D Background Frame */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-cyan-600/20 rounded-3xl transform rotate-1 scale-105 blur-xl"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-600/10 via-indigo-600/10 to-teal-600/10 rounded-3xl transform -rotate-1 scale-102 blur-lg"></div>
        
        {/* Main Frame */}
        <div className="relative bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-12 shadow-2xl">
          {/* Content */}
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
              <span className="bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                WELCOME TO
              </span>
              <br />
              <span className="text-white">NEXTWEB</span>
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed">
              เว็บไซต์สมัยใหม่ที่มาพร้อมด้วยเทคโนโลยีล่าสุด 
              พร้อมสร้างประสบการณ์ที่ยอดเยี่ยมให้กับผู้ใช้งาน
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <button className="px-8 py-4 bg-red-600 text-white font-black rounded-full hover:bg-red-500 transition-all hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] transform hover:scale-105">
                เริ่มต้นใช้งาน
              </button>
              <button className="px-8 py-4 border border-white/20 text-white font-black rounded-full hover:bg-white/10 transition-all transform hover:scale-105">
                ดูเพิ่มเติม
              </button>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-4 left-4 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-75"></div>
          <div className="absolute bottom-4 left-4 w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-150"></div>
          <div className="absolute bottom-4 right-4 w-2 h-2 bg-cyan-500 rounded-full animate-pulse delay-300"></div>
        </div>
      </div>
    </div>
  );
}
