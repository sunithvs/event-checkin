'use client';
import QRCode from "@/components/QRCode";
import { createClient } from "../../../utils/supabase/client";
import {useState} from "react";

async function getAttendeeDetails(attendeeId) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_attendee_details", {
    attendee_id: attendeeId,
  });
  if (error) throw error;
  return data;
}

export default async function TicketPage({ params }) {
  const attendee = await getAttendeeDetails(params.slug);
  const [isQRExpanded, setIsQRExpanded] = useState(false);

  if (!attendee || attendee.error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-2xl text-red-500">Ticket not found</div>
      </div>
    );
  }

  return (
       <>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="bg-[#530315] text-white p-6">
            <h1 className="text-2xl font-bold tracking-tight">International Conclave on</h1>
            <h2 className="text-3xl font-extrabold tracking-tight mt-1">Next-Gen Higher Education</h2>
          </div>

          {/* Main Content */}
          <div className="p-6 flex gap-6">
            {/* Left Section */}
            <div className="flex-grow space-y-4">
              {/* Attendee Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-[#530315]" />
                  <div>
                    <p className="text-sm text-gray-500">Attendee</p>
                    <p className="font-semibold">{attendee.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#530315]" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold">{attendee.email}</p>
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#530315]" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-semibold"></p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#530315]" />
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-semibold">time</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#530315]" />
                  <div>
                    <p className="text-sm text-gray-500">Venue</p>
                    <p className="font-semibold">cusat</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - QR Code */}
            <div className="flex flex-col items-center justify-center border-l pl-6">
              <button
                onClick={() => setIsQRExpanded(true)}
                className="bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
              >
             <QRCode value={attendee.email} className="w-24 h-24 text-[#530315]" />

              </button>
              <p className="text-sm text-gray-500 mt-2">Ticket ID: is</p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4 bg-gray-50">
            <p className="text-sm text-gray-500 text-center">
              This ticket is non-transferable and must be presented at the venue entrance
            </p>
          </div>
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
                <QrCode className="w-48 h-48 text-[#530315]" />
              </div>
              <p className="text-lg font-semibold">Ticket ID: {ticketData.ticketId}</p>
              <p className="text-sm text-gray-500 mt-2">Scan this QR code at the venue entrance</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
