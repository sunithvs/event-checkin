import QRCode from "@/components/QRCode";
import {createClient} from "../../../utils/supabase/client";

async function getAttendeeDetails(attendeeId) {
    const supabase = createClient();
    const {data, error} = await supabase.rpc("get_attendee_details", {
        attendee_id: attendeeId,
    });
    if (error) throw error;
    return data;
}

export default async function TicketPage({params}) {
    const attendee = await getAttendeeDetails(params.slug);

    if (!attendee || attendee.error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-zinc-50">
                <div className="text-2xl text-red-500">Ticket not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Main Content */}
                <div className="bg-white rounded-[32px] shadow-lg p-8">
                    {/* QR Code Section */}
                    <div className="flex justify-center mb-12">
                        <div className="bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)] rounded-2xl p-6">
                            <QRCode value={attendee.email}/>
                            <p className="text-center text-zinc-600 mt-4 text-sm tracking-wide font-medium">
                                SCAN HERE!
                            </p>
                        </div>
                    </div>

                    {/* Event Details */}
                    <div className="text-center space-y-3">
                        <h1 className="text-[28px] font-bold tracking-wider text-zinc-800 uppercase">
                            INTERNATIONAL CONCLAVE
                        </h1>
                        <p className="text-zinc-500 tracking-wide text-lg">
                            Next-Gen Higher Education
                        </p>
                    </div>

                    {/* Attendee Details */}
                    <div className="mt-12 text-center space-y-2">
                        <h2 className="text-2xl font-semibold text-zinc-800">
                            {attendee.name}
                        </h2>
                        <p className="text-zinc-500 text-lg">
                            {attendee.email}
                        </p>
                    </div>
                </div>

                {/* Bottom Card */}
                <div className="mt-4">
                    <div className="bg-white rounded-[32px] shadow-lg p-8">
                        <div className="text-center space-y-6">
                            <h3 className="text-xl text-zinc-700">
                                Next-Gen Higher Education
                            </h3>
                            <p className="text-zinc-500 text-lg">
                                {attendee.email}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
