import "../styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { TokenProvider } from "../contexts/TokenContext";
import { neobrutalism } from "@clerk/themes";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "ClearHealth",
  description: "Analyze medical reports",
  icons: {
    icon: ["icon3.png"],
  },
};

const RootLayout = ({ children }) => {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: neobrutalism,
      }}
    >
      <TokenProvider>
        <html lang="en">
          <body>
            <main className="app">{children}</main>
          </body>
        </html>
      </TokenProvider>
    </ClerkProvider>
  );
};

export default RootLayout;
