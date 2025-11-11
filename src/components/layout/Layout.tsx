import React from "react";
import { Outlet } from "react-router-dom";
import { FooterSection } from "../../screens/TelaInicial/sections/FooterSection/FooterSection";
import { HeaderSection } from "../../screens/TelaInicial/sections/HeaderSection";
import { NavigationSection } from "../../screens/TelaInicial/sections/NavigationSection";
import { FullscreenProvider } from "../../contexts/fullscreen/FullscreenContext";
import { useFullscreen } from "../../contexts/fullscreen/FullscreenContext";

const LayoutContent = () => {
  const { isVideoCallFullscreen, isSidebarVisible } = useFullscreen();
  
  return (
    <div className="h-screen flex flex-col">
      <HeaderSection />
      <div className="flex flex-1 relative overflow-hidden">
        <div className={`transition-all duration-300 ease-in-out ${isSidebarVisible ? 'w-[280px]' : 'w-0'} overflow-hidden`}>
        <NavigationSection />
        </div>
        <main className={`flex-1 bg-gray-50 transition-all duration-300 overflow-y-auto`}>
          {!isVideoCallFullscreen ? (
            <div className="px-4 pt-3 pb-6">
              <Outlet />
            </div>
          ) : (
          <Outlet />
          )}
          <div className={!isVideoCallFullscreen ? "px-4 pb-4 mt-4" : ""}>
            <FooterSection />
          </div>
        </main>
      </div>
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