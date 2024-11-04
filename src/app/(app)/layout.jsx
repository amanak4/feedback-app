// import type { Metadata } from "next";
import localFont from "next/font/local";
import { Navbar } from "../../components/Navbar";


export default function RootLayout({
  children,
}) {
  return (
   
     <>
       <Navbar />
       {children}
     </>
      
  );
}
