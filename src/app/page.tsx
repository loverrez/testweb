export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="mt-12 flex gap-4">
        <div className="w-12 h-12 rounded-full border border-red-900/50 bg-zinc-950 flex items-center justify-center box-red-glow animate-bounce">
          <div className="w-2 h-2 bg-red-600 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
