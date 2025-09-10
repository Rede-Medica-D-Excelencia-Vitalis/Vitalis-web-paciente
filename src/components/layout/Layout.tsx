import React from "react";
import { Outlet } from "react-router-dom";
import { FooterSection } from "../../screens/TelaInicial/sections/FooterSection/FooterSection";
import { HeaderSection } from "../../screens/TelaInicial/sections/HeaderSection";
import { NavigationSection } from "../../screens/TelaInicial/sections/NavigationSection";
import { FullscreenProvider } from "../../contexts/fullscreen/FullscreenContext";
import { useFullscreen } from "../../contexts/fullscreen/FullscreenContext";

const LayoutContent = () => {
  const { isVideoCallFullscreen } = useFullscreen();
  
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderSection />
      <div className="flex flex-1">
        <NavigationSection />
        <main className={`flex-1 bg-gray-50 ${isVideoCallFullscreen ? 'p-0' : 'p-8'}`}>
          <Outlet />
        </main>
      </div>
      <FooterSection />
      

    </div>
  );
};

export const Layout = () => {
  return (
    <FullscreenProvider>
      <LayoutContent />
    </FullscreenProvider>
  );
};