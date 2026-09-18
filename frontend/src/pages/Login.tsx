import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { authService } from '@/services';
import { useAuthStore } from '@/store';
import { signinSchema } from '@/utils/validators';
import { ROUTES } from '@/utils/constants';
import { ChevronLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/store/toastStore';

type SigninFormData = {
  email: string;
  password: string;
};

export const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit = async (data: SigninFormData) => {
    try {
      setIsLoading(true);
      const response = await authService.signin(data);

      if (response.success) {
        const user = authService.getCurrentUser();
        setUser(user);
        navigate(ROUTES.HOME);
      } else {
        toast.error('Invalid credentials');
      }
    } catch (err: any) {
      const errData = err.response?.data;
      const explanation = errData?.error?.explanation;
      const message = Array.isArray(explanation)
        ? explanation.join(', ')
        : typeof explanation === 'string'
        ? explanation
        : errData?.message || 'Login failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        background: 'var(--bg-primary)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 440 }}
      >
        {/* Back link */}
        <Link
          to={ROUTES.WELCOME}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            color: 'var(--text-secondary)',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
            textDecoration: 'none',
          }}
        >
          <ChevronLeft size={16} />
          Back to Welcome
        </Link>

        <div className="glass-card" style={{ padding: '2.5rem 2rem', borderRadius: 16 }}>
          {/* Heading */}
          <h1
            className="text-gradient-gold"
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '1.75rem',
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: 8,
            }}
          >
            Welcome Back
          </h1>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
            Sign in to your Smart Sky account
          </p>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: 6, fontWeight: 500 }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={18}
                  style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
                <input
                  {...register('email')}
                  type="email"
                  className="input-dark"
                  placeholder="you@example.com"
                  style={{ paddingLeft: 40, width: '100%' }}
                />
              </div>
              {errors.email && (
                <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: 4 }}>{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: 6, fontWeight: 500 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="input-dark"
                  placeholder="••••••••"
                  style={{ paddingLeft: 40, paddingRight: 40, width: '100%' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    padding: 0,
                    display: 'flex',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: 4 }}>{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button type="submit" className="btn-primary" disabled={isLoading} style={{ width: '100%', marginTop: 8 }}>
              {isLoading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Footer link */}
          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Don't have an account?{' '}
            <Link to={ROUTES.SIGNUP} style={{ color: 'var(--accent-gold)', fontWeight: 600, textDecoration: 'none' }}>
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
