'use client';

import { Search } from 'lucide-react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce'; 

export default function SearchInput() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  
  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }

    // Update URL tanpa reload halaman penuh
    replace(`${pathname}?${params.toString()}`);
  };

  // Debounce manual
  let timeoutId: NodeJS.Timeout;
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      handleSearch(e.target.value);
    }, 300); 
  };

  return (
    <div className="relative flex-1">
      <span className="absolute left-3 top-2.5 text-gray-400">
        <Search size={18} />
      </span>
      <input
        type="text"
        placeholder="Cari ID, subjek, kategori..."
        className="w-full bg-white border border-gray-200 rounded-lg pl-10 py-2.5 focus:ring-2 focus:ring-[#0F4C75] outline-none text-sm shadow-sm"
        onChange={onInputChange}
        defaultValue={searchParams.get('q')?.toString()} 
      />
    </div>
  );
}