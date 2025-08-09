// src/components/ui/SearchBar.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search...",
  className = "",
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  const handleClear = () => {
    onChange("");
    onSearch("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      inputRef.current?.blur();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div
        className={`
        relative flex items-center bg-white border-2 transition-all duration-200
        ${
          isFocused
            ? "border-blue-600"
            : "border-gray-400 hover:border-gray-500"
        }
      `}
      >
        <Search className="absolute left-3 w-4 h-4 text-gray-600" />

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 bg-white border-none outline-none text-gray-900 placeholder-gray-500"
        />

        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-8 p-1 text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          className="absolute right-2 p-1 text-gray-600 hover:text-blue-600"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
