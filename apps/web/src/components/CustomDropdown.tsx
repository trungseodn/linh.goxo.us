import React, { useState, useRef, useEffect } from 'react';

export interface DropdownOption {
  value: string | number;
  label: string | React.ReactNode;
}

interface CustomDropdownProps {
  value: string | number;
  onChange: (value: any) => void;
  options: DropdownOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function CustomDropdown({ value, onChange, options, placeholder, disabled, className }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setTimeout(() => searchInputRef.current?.focus(), 60);
    }
  }, [isOpen]);

  const selectedOption = options.find(opt => String(opt.value) === String(value));

  const filteredOptions = searchQuery.trim()
    ? options.filter(opt => {
        const text = typeof opt.label === 'string' ? opt.label : String(opt.value);
        return text.toLowerCase().includes(searchQuery.toLowerCase().trim());
      })
    : options;

  return (
    <div className={`relative ${className || ''}`} ref={dropdownRef}>
      <div 
        className={`w-full bg-fb-surface border ${isOpen ? 'border-fb-blue ring-1 ring-fb-blue/50' : 'border-fb-surface-hover/80'} rounded-lg px-3 py-1.5 min-h-[32px] text-xs flex justify-between items-center cursor-pointer transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-fb-blue/50'}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? 'text-fb-text truncate' : 'text-fb-text-muted font-medium truncate'}>
          {selectedOption ? selectedOption.label : (placeholder || 'Chọn...')}
        </span>
        <span className="material-symbols-outlined text-[16px] text-fb-text-muted transition-transform duration-200 shrink-0 ml-2" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
          expand_more
        </span>
      </div>
      
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-fb-surface border border-fb-surface-hover/80 rounded-lg shadow-xl shadow-black/10 max-h-72 overflow-hidden flex flex-col py-1 animate-in fade-in zoom-in-95 duration-100">
          {options.length > 8 && (
            <div className="p-1.5 border-b border-fb-surface-hover/80 bg-fb-surface shrink-0">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-fb-text-muted text-[15px]">
                  search
                </span>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Gõ để tìm nhanh mẫu..."
                  className="w-full pl-7 pr-2.5 py-1 text-[11px] bg-fb-surface-hover/60 border border-white/10 rounded-md text-fb-text placeholder-fb-text-muted focus:outline-hidden focus:border-fb-blue"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}
          <div className="overflow-y-auto custom-scrollbar flex-1">
            {filteredOptions.length === 0 && (
              <div className="px-3 py-3 text-[11px] text-fb-text-muted italic text-center">Không tìm thấy kết quả</div>
            )}
            {filteredOptions.map((opt, i) => {
              const isSelected = String(opt.value) === String(value);
              return (
                <div 
                  key={i} 
                  className={`px-3 py-2 text-[11px] cursor-pointer flex justify-between items-center transition-colors ${isSelected ? 'bg-fb-blue/10 text-fb-blue font-bold' : 'text-fb-text hover:bg-fb-surface-hover'}`}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                >
                  <span className="truncate pr-2">{opt.label}</span>
                  {isSelected && <span className="material-symbols-outlined text-[14px]">check</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
