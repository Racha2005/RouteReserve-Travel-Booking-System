'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { resetPasswordSchema } from '@/validations/auth';
import { authService } from '@/services/auth.service';
import { z } from 'zod';

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || 'mock-reset-token';

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordValues) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await authService.resetPassword({ token, password: data.password });
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to reset password. Link might be expired.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-4">
        <div className="flex justify-center mb-4 text-secondary-300">
          <CheckCircle2 className="w-16 h-16 animate-bounce" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Password Reset Successful</h3>
        <p className="text-white/70 text-xs px-2 leading-relaxed mb-6">
          Your password has been changed. You are being redirected to the sign in page in a moment...
        </p>
        <Link
          href="/login"
          className="inline-block bg-white/20 hover:bg-white/30 border border-white/30 text-white font-bold py-2.5 px-6 rounded-xl text-xs tracking-wider transition-all duration-200"
        >
          GO TO SIGN IN NOW
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Reset Password</h2>
        <p className="text-white/60 text-xs mt-1">Enter your new secure password below</p>
      </div>

      {errorMsg && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-200 text-xs rounded-xl p-3 mb-4 text-center">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* New Password */}
        <div>
          <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
            New Password
          </label>
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
            <p className="text-red-300 text-xxs mt-1 pl-1 leading-snug">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
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
              className={`w-full bg-white/5 border rounded-xl py-2.5 pl-10 pr-10 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-secondary-300 focus:border-transparent transition-all ${
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
              Resetting Password...
            </>
          ) : (
            'Reset Password'
          )}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center p-6 text-white/50 text-xs">
        <Loader2 className="w-5 h-5 animate-spin mb-1 text-secondary-300" />
        Loading...
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
