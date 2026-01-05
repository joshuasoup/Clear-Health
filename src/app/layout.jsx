import "../styles/globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "Clear Health",
  description: "Analyze medical reports",
  icons: {
    icon: ["icon2.png"],
  },
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <main className="app">{children}</main>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
};

export default RootLayout;
