// src/pages/app/dashboard.tsx

import UserLayout from '@/components/layouts/UserLayout';
import ChatbotOverlay from "@/components/onboarding/ChatbotOverlay";

export default function UserDashboard() {
  const isFirstLogin = true;

  return <div> {isFirstLogin && <ChatbotOverlay />}
  </div>;
}

UserDashboard.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <UserLayout>
      {page}
    </UserLayout>
  );
};