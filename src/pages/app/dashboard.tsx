// src/pages/app/dashboard.tsx

import UserLayout from '@/components/layouts/UserLayout';

export default function UserDashboard() {
  return <div>User Dashboard</div>;
}

UserDashboard.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <UserLayout>
      {page}
    </UserLayout>
  );
};