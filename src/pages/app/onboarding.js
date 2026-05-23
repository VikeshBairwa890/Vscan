"use client";

import { useRouter } from "next/router";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";

export default function OnboardingPage() {
  const router = useRouter();

  const handleComplete = () => {
    router.push("/app/dashboard");
  };

  return <OnboardingWizard onComplete={handleComplete} />;
}
