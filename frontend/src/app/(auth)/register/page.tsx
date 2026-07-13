'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { registerSchema } from '@/validations/auth';
import { useAuth } from '@/context/AuthContext';
import { z } from 'zod';

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await signup(data);
      router.push('/verify-email?email=' + encodeURIComponent(data.email));
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Create Account</h2>
        <p className="text-white/60 text-xs mt-1">Start your unified travel journey</p>
      </div>

      {errorMsg && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-200 text-xs rounded-xl p-3 mb-4 text-center">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/50">
              <User className="w-4 h-4" />
            </span>
            <input
              type="text"
              {...register('name')}
              placeholder="John Doe"
              className={`w-full bg-white/5 border rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-secondary-300 focus:border-transparent transition-all ${
                errors.name ? 'border-red-400 focus:ring-red-400' : 'border-white/10'
              }`}
            />
          </div>
          {errors.name && (
            <p className="text-red-300 text-xxs mt-1 pl-1">{errors.name.message}</p>
          )}
        </div>

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
              className={`w-full bg-white/5 border rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-secondary-300 focus:border-transparent transition-all ${
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
          <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/50">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              placeholder="••••••••"
              className={`w-full bg-white/5 border rounded-xl py-2 pl-10 pr-10 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-secondary-300 focus:border-transparent transition-all ${
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
            <p className="text-red-300 text-xxs mt-1 pl-1 leading-snug">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/50">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword')}
              placeholder="••••••••"
              className={`w-full bg-white/5 border rounded-xl py-2 pl-10 pr-10 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-secondary-300 focus:border-transparent transition-all ${
                errors.confirmPassword ? 'border-red-400 focus:ring-red-400' : 'border-white/10'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/50 hover:text-white transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-300 text-xxs mt-1 pl-1">{errors.confirmPassword.message}</p>
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
              Creating Account...
            </>
          ) : (
            'Sign Up'
          )}
        </button>
      </form>

      <div className="text-center mt-6 text-xs text-white/60">
        Already have an account?{' '}
        <Link href="/login" className="text-secondary-200 hover:text-white font-bold transition-all">
          Sign In
        </Link>
      </div>
    </div>
  );
}
