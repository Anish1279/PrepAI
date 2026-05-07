"use client";
import React from "react";
import Header from "@/components/Header";
import { useState } from "react";
import { WebCamContext } from "@/features/interviews/context/webcam-context";

const DashboardLayout = ({ children }) => {
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  return (
    <div className="min-h-screen text-slate-100">
      <Header />
      <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
        <WebCamContext.Provider value={{ webCamEnabled, setWebCamEnabled }}>
          {children}
        </WebCamContext.Provider>
      </div>
    </div>
  );
};

export default DashboardLayout;
