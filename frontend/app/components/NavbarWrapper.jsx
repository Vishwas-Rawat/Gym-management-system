// app/components/NavbarWrapper.jsx
"use client";

import { useAuth } from "../LoginAndReg/Context/page";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar"; // Use the proper Navbar component

export default function NavbarWrapper() {
  const { isLoggedIn } = useAuth(); // Access isLoggedIn from AuthContext
  const pathname = usePathname();

  // Debug logging
  console.log('NavbarWrapper - pathname:', pathname);
  console.log('NavbarWrapper - isLoggedIn:', isLoggedIn);

  // Don't show navbar on login and register pages only
  const hideNavbar = pathname.includes('/LoginAndReg/Login') || 
                    pathname.includes('/LoginAndReg/Register');

  console.log('NavbarWrapper - hideNavbar:', hideNavbar);

  return !hideNavbar ? <Navbar /> : null;
}
