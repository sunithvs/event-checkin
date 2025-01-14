import React from 'react';
import {toast} from 'sonner';
import {createClient} from '@/utils/supabase/client';

interface AttendeeProfileProps {
    attendee: {
        id: string;
        name: string;
        email: string;
        phone_number?: string;
        checked_in: boolean;
        checked_in_at?: string;
        metadata?: any;
    };
    onCheckInComplete: () => void;
}

export function AttendeeProfile({attendee, onCheckInComplete}: AttendeeProfileProps) {
    const supabase = createClient();

    const handleCheckIn = async () => {
        try {
            const {data: {user}} = await supabase.auth.getUser();

            if (!user) {
                toast.error('You must be logged in to check in attendees');
                return;
            }

            const {data, error} = await supabase.rpc('check_in_attendee', {
                p_email: attendee.email,
                p_volunteer_id: user.id
            });

            if (error) {
                toast.error(error.message);
                return;
            }

            if (data.success) {
                toast.success('Check-in successful!');
                onCheckInComplete();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('An error occurred during check-in');
            console.error('Check-in error:', error);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">{attendee.name}</h3>
                <div className="text-sm text-gray-500 space-y-1">
                    <p>Email: {attendee.email}</p>
                    {attendee.phone_number && <p>Phone: {attendee.phone_number}</p>}
                    {attendee.metadata && <p> {attendee.metadata['Institution Affl.']}</p>}
                    {attendee.metadata && <p> {attendee.metadata['Designation']}</p>}
                </div>
            </div>

            <div className="pt-2">
                {attendee.checked_in ? (
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-green-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                            </svg>
                            <span className="font-medium">Already checked in</span>
                        </div>
                        {attendee.checked_in_at && (
                            <p className="text-sm text-gray-500">
                                Checked in at: {new Date(attendee.checked_in_at).toLocaleString()}
                            </p>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={handleCheckIn}
                        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Check In
                    </button>
                )}
            </div>
        </div>
    );
}
