import React from 'react'

interface ProfileAvatarSVGProps {
  size?: number
  className?: string
  showOnlineIndicator?: boolean
}

export function ProfileAvatarSVG({ 
  size = 40, 
  className = "", 
  showOnlineIndicator = true 
}: ProfileAvatarSVGProps) {
  return (
    <div className={`relative ${className}`}>
      <div 
        className="rounded-full bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600 p-0.5 shadow-lg hover:shadow-xl transition-all duration-300"
        style={{ width: size, height: size }}
      >
        <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
          <svg
            width={size * 0.6}
            height={size * 0.6}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-sm"
          >
            {/* Head */}
            <circle 
              cx="12" 
              cy="8" 
              r="4" 
              fill="url(#avatarGradient)"
            />
            
            {/* Body */}
            <path 
              d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" 
              stroke="url(#avatarGradient)" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              fill="none"
            />
            
            {/* Gradient Definition */}
            <defs>
              <linearGradient id="avatarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="30%" stopColor="#3b82f6" />
                <stop offset="70%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      
      {/* Online Status Indicator */}
      {showOnlineIndicator && (
        <div 
          className="absolute bottom-0 right-0 bg-green-400 border-2 border-white rounded-full animate-pulse"
          style={{ 
            width: size * 0.25, 
            height: size * 0.25,
            transform: 'translate(25%, 25%)'
          }}
        />
      )}
    </div>
  )
}

// Enhanced version with custom styling options
export function ProfileAvatarSVGLarge({ 
  size = 60, 
  username = "User",
  className = "" 
}: ProfileAvatarSVGProps & { username?: string }) {
  return (
    <div className={`relative group ${className}`}>
      <div 
        className="rounded-full bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600 p-1 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105"
        style={{ width: size, height: size }}
      >
        <div className="h-full w-full rounded-full bg-white flex items-center justify-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-emerald-50 opacity-50" />
          
          <svg
            width={size * 0.55}
            height={size * 0.55}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10 drop-shadow-sm"
          >
            {/* Head */}
            <circle 
              cx="12" 
              cy="8" 
              r="4" 
              fill="url(#largeAvatarGradient)"
              className="group-hover:drop-shadow-md transition-all duration-300"
            />
            
            {/* Body */}
            <path 
              d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" 
              stroke="url(#largeAvatarGradient)" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              fill="none"
              className="group-hover:drop-shadow-md transition-all duration-300"
            />
            
            {/* Gradient Definition */}
            <defs>
              <linearGradient id="largeAvatarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="25%" stopColor="#0891b2" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="75%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      
      {/* Enhanced Status Indicator */}
      <div 
        className="absolute bottom-0 right-0 bg-gradient-to-br from-green-400 to-emerald-500 border-3 border-white rounded-full shadow-lg"
        style={{ 
          width: size * 0.25, 
          height: size * 0.25,
          transform: 'translate(20%, 20%)'
        }}
      >
        <div className="h-full w-full rounded-full bg-green-400 animate-ping opacity-75" />
      </div>
      
      {/* Tooltip on hover */}
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-gray-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap">
          {username}
        </div>
      </div>
    </div>
  )
}
