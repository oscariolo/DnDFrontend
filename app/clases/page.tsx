export default function ClasesPage() {
  return (
    <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FEFEFC' }}>
      <div className="max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-semibold mb-4">Clases</h1>
        <p className="text-gray-700 mb-6">
          Browse available classes, learn abilities and start building your hero.
        </p>
        <a href="/classShowcase" className="inline-block px-6 py-3 bg-[#E40712] text-white rounded-lg">
          Explore Classes
        </a>
      </div>
    </main>
  );
}