import {Geist} from "next/font/google";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: "Eventsradar",
    description: "The eventsradar",
};

const geistSans = Geist({
    display: "swap",
    subsets: ["latin"],
});

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={geistSans.className} suppressHydrationWarning>
        <body>

        <main className="min-h-screen flex flex-col items-center">

            {children}

        </main>
        {/*</ThemeProvider>*/}
        </body>
        </html>
    );
}
