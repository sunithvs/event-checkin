'use client';

import { useCallback, useState } from 'react';
import { QRScanner } from '@/components/QRScanner';
import { EmailSearch } from '@/components/EmailSearch';
import { AttendeeProfile } from '@/components/AttendeeProfile';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import {redirect} from "next/navigation";

interface Attendee {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  checked_in: boolean;
  checked_in_at?: string;
}

export default async function CheckInPage() {
  const [isScanning, setIsScanning] = useState(true);
  const [attendee, setAttendee] = useState<Attendee | null>(null);
  const supabase = createClient();

  const handleEmailDetected = useCallback(async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('attendees')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

      if (error) {
        toast.error('Failed to find attendee');
        return;
      }

      if (data) {
        setAttendee(data);
      } else {
        toast.error('Attendee not found');
      }
    } catch (error) {
      toast.error('An error occurred while looking up attendee');
      console.error('Lookup error:', error);
    }
  }, [supabase]);

  const handleAttendeeSelect = (selectedAttendee: Attendee) => {
    setAttendee(selectedAttendee);
  };

  const resetScan = useCallback(() => {
    setAttendee(null);
    setIsScanning(true);
  }, []);

   const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }


  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="min-h-screen bg-[--background]">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Event Check-In
            </h1>
            <p className="text-lg text-[--muted]">
              Welcome attendees by scanning their QR code or searching by name
            </p>
          </div>

          {attendee ? (
            <div className="max-w-lg mx-auto space-y-6 animate-float">
              <AttendeeProfile 
                attendee={attendee} 
                onCheckInComplete={resetScan}
              />
              <button
                onClick={resetScan}
                className="btn-secondary w-full"
              >
                Check In Another Attendee
              </button>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="card space-y-8">
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setIsScanning(true)}
                    className={isScanning ? 'btn-primary' : 'btn-secondary'}
                  >
                    <svg 
                      className="w-5 h-5 mr-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2m0 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Scan QR
                  </button>
                  <button
                    onClick={() => setIsScanning(false)}
                    className={!isScanning ? 'btn-primary' : 'btn-secondary'}
                  >
                    <svg 
                      className="w-5 h-5 mr-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search
                  </button>
                </div>

                <div className="mt-8">
                  {isScanning ? (
                    <QRScanner onScan={handleEmailDetected} />
                  ) : (
                    <EmailSearch onSelect={handleAttendeeSelect} />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
