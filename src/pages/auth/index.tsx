import { motion } from 'framer-motion';
import AuthFormContainer from '@/components/auth/auth-form-container';
import AuthLayout from '@/components/auth/AuthLayout';
import { useRouter } from 'next/router';
import { ShieldAlert } from 'lucide-react';

export default function AuthIndexPage() {
  const router = useRouter();
  const { error, redirect } = router.query;

  const handleLoginRedirect = () => {
    const loginUrl = {
      pathname: '/auth/login',
      query: redirect ? { redirect } : {},
    };
    router.push(loginUrl);
  };

  const errorMessage = error 
    ? (typeof error === 'string' ? decodeURIComponent(error) : error[0])
    : 'Your session has expired or is invalid. Please log in again to continue.';

  return (
    <AuthLayout>
      <AuthFormContainer>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center text-center py-4"
        >
          {/* Visual Icon Container with Pulse effect */}
          <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
            <ShieldAlert className="h-8 w-8" />
            <span className="absolute inset-0 rounded-2xl bg-red-500/5 animate-ping opacity-75" />
          </div>

          {/* Header */}
          <h1 className="text-2xl font-bold tracking-tight text-white font-syne mb-2">
            Session Expired
          </h1>
          
          <p className="text-sm text-app-text-muted max-w-sm mb-8 leading-relaxed">
            {errorMessage}
          </p>

          {/* CTA Button */}
          <button 
            onClick={handleLoginRedirect}
            className="w-full btn-primary py-3 text-sm font-semibold text-white rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/45 transition duration-200 active:scale-[0.98]"
          >
            Log In to Continue
          </button>

          {/* Additional Help Text */}
          <p className="mt-6 text-xs text-app-text-dimmed">
            If you believe this is an error, please try logging in again.
          </p>
        </motion.div>
      </AuthFormContainer>
    </AuthLayout>
  );
}
