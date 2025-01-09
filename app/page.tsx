'use client';

import { useCallback, useState } from 'react';
import { QRScanner } from '@/components/QRScanner';
import { EmailSearch } from '@/components/EmailSearch';
import { AttendeeProfile } from '@/components/AttendeeProfile';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { Toaster } from 'sonner';

interface Attendee {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  checked_in: boolean;
  checked_in_at?: string;
}

export default function CheckInPage() {
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

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Attendee Check-In</h1>
            <p className="mt-2 text-sm text-gray-600">
              Scan a QR code or search by name/email to check in an attendee
            </p>
          </div>

          {attendee ? (
            <div className="space-y-4">
              <AttendeeProfile
                attendee={attendee}
                onCheckInComplete={resetScan}
              />
              <button
                onClick={resetScan}
                className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Search Another
              </button>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-6 space-y-6">
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setIsScanning(true)}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    isScanning
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300'
                  }`}
                >
                  Scan QR
                </button>
                <button
                  onClick={() => setIsScanning(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    !isScanning
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300'
                  }`}
                >
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
          )}
        </div>
      </div>
    </>
  );
}
