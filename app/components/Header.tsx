export default function Header() {
  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold">Panel de control</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">Marce Garrido</span>
        <img
          src="/avatar.png"
          alt="Avatar"
          className="w-8 h-8 rounded-full border"
        />
      </div>
    </header>
  );
}
