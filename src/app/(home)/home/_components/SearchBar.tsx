"use client";

import React, { useState, useRef, useEffect } from 'react'
import { Search } from "lucide-react"

export default function SearchBar() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const recentSearches = [
    "machine learning in healthcare",
    "clinical trials 2024"
  ]

  const suggestions = [
    "cardiology research",
    "medical conferences",
    "pharmaceutical innovations",
    "drug discovery trends"
  ]

  return (
    <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 z-10 mb-0">
      <div ref={searchRef} className="relative">
        <div className="relative bg-gray-100 rounded-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
          <input
            type="text"
            placeholder="Search PharmaConnect..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            className="w-full bg-transparent border-0 rounded-full py-3 pl-12 pr-4 text-base placeholder:text-gray-500 focus:outline-none focus:ring-0"
          />
        </div>
        
        {searchOpen && searchValue && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden z-20">
            <div className="max-h-96 overflow-y-auto">
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Recent searches
                </div>
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center"
                    onClick={() => {
                      setSearchValue(search)
                      setSearchOpen(false)
                    }}
                  >
                    <Search className="mr-3 h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{search}</span>
                  </div>
                ))}
              </div>
              
              <div className="py-2 border-t border-gray-100">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Suggestions
                </div>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center"
                    onClick={() => {
                      setSearchValue(suggestion)
                      setSearchOpen(false)
                    }}
                  >
                    <Search className="mr-3 h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {searchOpen && !searchValue && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden z-20">
            <div className="py-6 text-center text-gray-500">
              Start typing to search...
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
