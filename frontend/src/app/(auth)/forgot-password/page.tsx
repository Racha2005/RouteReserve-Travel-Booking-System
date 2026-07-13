'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { forgotPasswordSchema } from '@/validations/auth';
import { authService } from '@/services/auth.service';
import { z } from 'zod';

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await authService.forgotPassword(data.email);
      setIsSuccess(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Error occurred. Please verify your email address.');
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
        <h3 className="text-xl font-bold text-white mb-2">Check Your Email</h3>
        <p className="text-white/70 text-xs px-2 leading-relaxed mb-6">
          We have sent a temporary recovery link to your email address. Follow the instructions to choose a new password.
        </p>
        <Link
          href="/login"
          className="inline-block bg-white/20 hover:bg-white/30 border border-white/30 text-white font-bold py-2.5 px-6 rounded-xl text-xs tracking-wider transition-all duration-200"
        >
          BACK TO SIGN IN
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Forgot Password?</h2>
        <p className="text-white/60 text-xs mt-1">
          No worries! We will send you reset instructions.
        </p>
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-secondary-400 to-primary-500 hover:from-secondary-500 hover:to-primary-600 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2 mt-6"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending Link...
            </>
          ) : (
            'Send Reset Link'
          )}
        </button>
      </form>

      <div className="text-center mt-6 text-xs text-white/60">
        Remember your password?{' '}
        <Link href="/login" className="text-secondary-200 hover:text-white font-bold transition-all">
          Sign In
        </Link>
      </div>
    </div>
  );
}
