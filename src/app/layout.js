import AuthProvider from "@/components/AuthProvider";
import "./globals.css";

export const metadata = {
  title: "Private Notes Vault",
  description: "Securely store your private notes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning={true}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}