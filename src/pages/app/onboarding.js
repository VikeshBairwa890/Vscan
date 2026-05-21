"use client";

import { useRouter } from "next/router";
import ChatbotOverlay from "@/components/onboarding/ChatbotOverlay";

export default function OnboardingPage() {
  const router = useRouter();

  const handleComplete = () => {
    router.push("/app/dashboard");
  };

  return <ChatbotOverlay onComplete={handleComplete} />;
}
