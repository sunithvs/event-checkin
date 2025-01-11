'use client';
import QRCode from "@/components/QRCode";
import { createClient } from "../../../utils/supabase/client";
import {useState, useEffect, use} from "react";
import { X, User, Mail, Calendar, Clock, MapPin } from 'lucide-react';

function getAttendeeDetails(attendeeId) {
  const supabase = createClient();
  return supabase.rpc("get_attendee_details", {
    attendee_id: attendeeId,
  });
}

export default function TicketPage({ params }) {
  const resolvedParams = use(params);
  const [attendee, setAttendee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isQRExpanded, setIsQRExpanded] = useState(false);

  useEffect(() => {
    const fetchAttendee = async () => {
      try {
        const { data, error } = await getAttendeeDetails(resolvedParams.slug);
        if (error) throw error;
        setAttendee(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendee();
  }, [resolvedParams.slug]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (error || !attendee) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-2xl text-red-500">Ticket not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-[#530315] text-white p-6">
          <h1 className="text-2xl font-bold tracking-tight">International Conclave on</h1>
          <h2 className="text-3xl font-extrabold tracking-tight mt-1">Next-Gen Higher Education</h2>
        </div>

        {/* Main Content */}
        <div className="p-6 flex flex-col md:flex-row gap-6">
          {/* Left Section */}
          <div className="flex-grow space-y-6">
            {/* Attendee Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-[#530315]" />
                <div>
                  <p className="text-sm text-gray-500">Attendee</p>
                  <p className="font-semibold">{attendee.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#530315]" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold">{attendee.email}</p>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#530315]" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-semibold">January 15, 2024</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#530315]" />
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-semibold">9:00 AM - 5:00 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#530315]" />
                <div>
                  <p className="text-sm text-gray-500">Venue</p>
                  <p className="font-semibold">CUSAT Seminar Complex</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - QR Code */}
          <div className="flex flex-col items-center justify-center md:border-l md:pl-6">
            <button
              onClick={() => setIsQRExpanded(true)}
              className="bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <QRCode value={attendee.email} size={96} />
            </button>
            <p className="text-sm text-gray-500 mt-2">Ticket ID: {attendee.id}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 bg-gray-50">
          <p className="text-sm text-gray-500 text-center">
            This ticket is non-transferable and must be presented at the venue entrance
          </p>
        </div>
      </div>

      {/* QR Code Modal */}
      {isQRExpanded && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 relative max-w-lg w-full">
            <button
              onClick={() => setIsQRExpanded(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex flex-col items-center">
              <div className="bg-gray-100 p-8 rounded-lg mb-4">
                <QRCode value={attendee.email} size={192} />
              </div>
              <p className="text-lg font-semibold">Ticket ID: {attendee.id}</p>
              <p className="text-sm text-gray-500 mt-2">Scan this QR code at the venue entrance</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
