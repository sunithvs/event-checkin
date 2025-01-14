import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

interface Attendee {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  checked_in: boolean;
  checked_in_at?: string;
  metadata?: any;
}

interface EmailSearchProps {
  onSelect: (attendee: Attendee) => void;
}

export function EmailSearch({ onSelect }: EmailSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Attendee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const searchAttendees = async () => {
      if (searchTerm.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('attendees')
          .select('*')
          .or(`email.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%`)
          .limit(5);

        if (error) {
          console.error('Search error:', error);
          return;
        }

        setResults(data || []);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchAttendees, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, supabase]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg 
            className="h-5 w-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-search pl-10"
          placeholder="Search by name or email..."
          autoComplete="off"
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg 
              className="animate-spin h-5 w-5 text-[--primary]" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="mt-1 bg-white rounded-xl shadow-lg max-h-[400px] overflow-auto divide-y divide-gray-100">
          {results.map((attendee) => (
            <button
              key={attendee.id}
              onClick={() => onSelect(attendee)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors duration-200 card-interactive"
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {attendee.name}
                  </p>
                  <p className="text-sm text-[--muted] truncate">
                    {attendee.email}
                  </p>
                  {attendee.phone_number && (
                    <p className="text-xs text-[--muted-foreground] mt-0.5">
                      {attendee.phone_number}
                    </p>
                  )}
{attendee.metadata && <p>{attendee.metadata['Institution Affl.']}</p>}
{attendee.metadata && <p>{attendee.metadata['Designation']}</p>}
                </div>
                {attendee.checked_in && (
                  <span className="ml-4 inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    <svg 
                      className="h-3 w-3" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                    Checked In
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {searchTerm.length >= 2 && results.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <svg 
            className="mx-auto h-12 w-12 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <p className="mt-4 text-sm text-[--muted]">
            No attendees found matching "{searchTerm}"
          </p>
        </div>
      )}
    </div>
  );
}
