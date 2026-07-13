'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { loginSchema } from '@/validations/auth';
import { useAuth } from '@/context/AuthContext';
import { z } from 'zod';

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'user1@gmail.com',
      password: 'Rachana#Tunga@2026!',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await login(data);
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Invalid email or password. Hint: user1@gmail.com / Rachana#Tunga@2026!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Welcome Back</h2>
        <p className="text-white/60 text-xs mt-1">Sign in to your RouteReserve account</p>
      </div>

      {errorMsg && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-200 text-xs rounded-xl p-3 mb-4 text-center">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/50">
              <Mail className="w-4 h-4" />
            </span>
            <input
              type="email"
              {...register('email')}
              placeholder="name@example.com"
              className={`w-full bg-white/5 border rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-secondary-300 focus:border-transparent transition-all ${
                errors.email ? 'border-red-400 focus:ring-red-400' : 'border-white/10'
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-red-300 text-xxs mt-1 pl-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xxs text-secondary-200 hover:text-white transition-all font-medium"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/50">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              placeholder="••••••••"
              className={`w-full bg-white/5 border rounded-xl py-2.5 pl-10 pr-10 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-secondary-300 focus:border-transparent transition-all ${
                errors.password ? 'border-red-400 focus:ring-red-400' : 'border-white/10'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/50 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-300 text-xxs mt-1 pl-1">{errors.password.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-secondary-400 to-primary-500 hover:from-secondary-500 hover:to-primary-600 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2 mt-6"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="text-center mt-6 text-xs text-white/60">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-secondary-200 hover:text-white font-bold transition-all">
          Sign Up
        </Link>
      </div>

      <div className="border-t border-white/10 mt-6 pt-4 text-center">
        <p className="text-[10px] text-white/40 leading-relaxed">
          Demo Account:<br />
          Email: <span className="font-mono text-white/60 select-all">user1@gmail.com</span><br />
          Password: <span className="font-mono text-white/60 select-all">Rachana#Tunga@2026!</span>
        </p>
      </div>
    </div>
  );
}
