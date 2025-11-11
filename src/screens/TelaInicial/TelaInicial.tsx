import React from "react";
import { MainContentSection } from "./sections/MainContentSection";
import { StatsSection } from "./sections/StatsSection";
import { WelcomeSection } from "./sections/WelcomeSection";
import { PlanBanner } from "../../components";

export const TelaInicial = (): JSX.Element => {
  return (
    <div className="space-y-3">
      <PlanBanner />
      <WelcomeSection />
      <StatsSection />
      <MainContentSection />
    </div>
  );
};