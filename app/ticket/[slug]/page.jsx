import QRCode from "@/components/QRCode";
import { createClient } from "../../../utils/supabase/client";

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

  if (!attendee || attendee.error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-2xl text-red-500">Ticket not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-customDark to-customLight flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Ticket Container */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[#530315] to-[#26010b] p-6 text-center text-white">
            <h1 className="text-2xl font-bold tracking-widest uppercase text-gray-800">
              International Conclave
            </h1>
            <p className="text-sm mt-2 font-medium tracking-wide">
              Next-Gen Higher Education
            </p>
          </div>

          {/* QR Code and Attendee Info */}
          <div className="p-6 space-y-6">
            {/* QR Code */}
            <div className="flex justify-center">
              <div className="bg-gray-100 shadow-md rounded-lg p-4">
                <QRCode value={attendee.email} />
                <p className="text-center text-gray-600 mt-2 text-xs font-semibold tracking-wide">
                  SCAN HERE!
                </p>
              </div>
            </div>

            {/* Attendee Details */}
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-gray-800">
                {attendee.name}
              </h2>
              <p className="text-sm text-gray-500">{attendee.email}</p>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="bg-gray-100 px-6 py-4 text-center">
            <p className="text-sm text-gray-600">
              This ticket is valid for one person only.
            </p>
            <p className="text-sm text-gray-600">
              Keep this ticket safe and secure.
            </p>
          </div>
        </div>

        {/* Footer Section */}
        <div className="mt-4 text-center text-white">
          <p className="text-sm">Thank you for joining us!</p>
        </div>
      </div>
    </div>
  );
}
