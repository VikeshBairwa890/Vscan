// src/pages/admin/dashboard.tsx

import AdminLayout from '@/components/layouts/AdminLayout';

export default function AdminDashboard() {
  return <div>Admin Dashboard</div>;
}

AdminDashboard.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <AdminLayout>
      {page}
    </AdminLayout>
  );
};