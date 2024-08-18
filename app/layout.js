import { Inter } from "next/font/google";
import "./globals.css";
import ReduxProvider from './ReduxProvider';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Demo",
  description: "Demo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
