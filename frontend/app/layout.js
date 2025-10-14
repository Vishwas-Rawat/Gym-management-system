// app/layout.jsx
import "./globals.css";
import { AuthProvider } from "./LoginAndReg/Context/page"; // Adjust path if needed
import { ThemeProvider } from "./LoginAndReg/Context/ThemeContext"; // Import ThemeProvider
import NavbarWrapper from "./components/NavbarWrapper"; // Import the new Client Component
// import NavBar from "./NavBarLandingPage/page";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <body>
        <ThemeProvider>
          <AuthProvider>
            <NavbarWrapper />
            {/* Conditionally renders Navbar based on isLoggedIn */}
            <main className="pt-20">
              {children}
            </main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
