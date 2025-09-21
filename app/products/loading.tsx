export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-white to-blue-50/50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-emerald-400 rounded-full animate-spin animate-pulse mx-auto"></div>
        </div>
        <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          Loading Products
        </h2>
        <p className="text-gray-600">
          Discovering sustainable finds for you...
        </p>
      </div>
    </div>
  )
}
