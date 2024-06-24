import "../styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import { TokenProvider } from "../contexts/TokenContext";

export const metadata = {
  title: "ClearHealth",
  description: "Analyze medical reports",
  icons: {
    icon: ["icon3.png"],
  },
};

const RootLayout = ({ children }) => {
  return (
    <ClerkProvider>
      <Script
        src="https://js.stripe.com/v3/pricing-table.js"
        strategy="lazyOnload"
      />
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
