'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ChevronDown, X } from 'lucide-react';

interface Option {
  label: string;
  value: string;
}

interface FilterDropdownProps {
  label: string;
  icon: React.ReactNode;
  paramKey: string;     
  options: Option[];
}

export default function FilterDropdown({ label, icon, paramKey, options }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cek nilai yang sedang aktif di URL
  const currentValue = searchParams.get(paramKey);
  const activeLabel = options.find((o) => o.value === currentValue)?.label;

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fungsi Update URL
  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(paramKey, value);
    } else {
      params.delete(paramKey);
    }
    router.replace(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 border transition shadow-sm
          ${currentValue 
            ? 'bg-blue-50 border-blue-200 text-[#0F4C75]' 
            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
      >
        {/* Render Icon langsung */}
        {icon} 
        
        <span>{activeLabel || label}</span>
        
        {currentValue ? (
          <div 
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSelect('');
            }}
            className="ml-1 hover:bg-red-100 rounded-full p-0.5"
          >
            <X size={14} className="text-red-500" />
          </div>
        ) : (
          <ChevronDown size={14} className={`ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 overflow-hidden">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between
                ${currentValue === option.value ? 'text-[#0F4C75] font-semibold bg-blue-50' : 'text-gray-700'}
              `}
            >
              {option.label}
              {currentValue === option.value && <div className="w-1.5 h-1.5 rounded-full bg-[#0F4C75]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}