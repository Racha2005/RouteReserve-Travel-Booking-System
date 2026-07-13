'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { authService } from '@/services/auth.service';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'your email';

  const [code, setCode] = useState<string[]>(new Array(6).fill(''));
  const [activeInput, setActiveInput] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [timer, setTimer] = useState(30);

  const inputRefs = useRef<HTMLInputElement[]>([]);

  // Count down resend timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Handle value change
  const handleChange = (val: string, index: number) => {
    const newCode = [...code];
    newCode[index] = val.slice(-1); // Only capture the last digit
    setCode(newCode);

    if (val && index < 5) {
      // Focus next input
      inputRefs.current[index + 1]?.focus();
      setActiveInput(index + 1);
    }
  };

  // Handle backspace/key down
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!code[index] && index > 0) {
        // Focus previous input
        const newCode = [...code];
        newCode[index - 1] = '';
        setCode(newCode);
        inputRefs.current[index - 1]?.focus();
        setActiveInput(index - 1);
      } else {
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
      }
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const verificationCode = code.join('');
    if (verificationCode.length < 6) {
      setErrorMsg('Please enter all 6 digits of the code.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      await authService.verifyEmail(verificationCode);
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2500);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Verification code is invalid or has expired. Hint: enter any 6 digits');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setTimer(30);
    setErrorMsg(null);
    try {
      await authService.forgotPassword(email);
    } catch (err) {
      console.error(err);
    }
  };

  // Automatically submit when all inputs are filled
  useEffect(() => {
    if (code.every((digit) => digit !== '')) {
      handleVerify();
    }
  }, [code]);

  if (isSuccess) {
    return (
      <div className="text-center py-4">
        <div className="flex justify-center mb-4 text-secondary-300">
          <CheckCircle2 className="w-16 h-16 animate-bounce" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Email Verified!</h3>
        <p className="text-white/70 text-xs px-2 leading-relaxed mb-6">
          Your RouteReserve account is now active. We are logging you in and routing you to the dashboard...
        </p>
        <button
          onClick={() => router.push('/dashboard')}
          className="bg-gradient-to-r from-secondary-400 to-primary-500 hover:from-secondary-500 hover:to-primary-600 text-white font-bold py-2.5 px-6 rounded-xl text-xs tracking-wider transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
        >
          GO TO DASHBOARD <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Verify Your Email</h2>
        <p className="text-white/60 text-xs mt-2 px-1">
          We sent a verification code to:<br />
          <span className="font-semibold text-white/90 text-xs break-all">{email}</span>
        </p>
      </div>

      {errorMsg && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-200 text-xs rounded-xl p-3 mb-4 text-center">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-6">
        {/* Verification code digits */}
        <div className="flex justify-between gap-2 max-w-xs mx-auto">
          {code.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              maxLength={1}
              ref={(el) => {
                if (el) inputRefs.current[idx] = el;
              }}
              value={digit}
              onChange={(e) => handleChange(e.target.value, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onFocus={() => setActiveInput(idx)}
              className={`w-11 h-12 bg-white/5 border rounded-xl text-center text-lg font-bold text-white focus:outline-none focus:ring-2 focus:ring-secondary-300 focus:border-transparent transition-all ${
                idx === activeInput ? 'ring-2 ring-secondary-300 border-transparent' : 'border-white/10'
              }`}
            />
          ))}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-secondary-400 to-primary-500 hover:from-secondary-500 hover:to-primary-600 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify Email'
          )}
        </button>
      </form>

      <div className="text-center mt-6 text-xs text-white/60">
        Didn&apos;t receive the code?{' '}
        <button
          type="button"
          onClick={handleResend}
          disabled={timer > 0}
          className={`font-bold transition-all ${
            timer > 0 ? 'text-white/40 cursor-not-allowed' : 'text-secondary-200 hover:text-white'
          }`}
        >
          Resend {timer > 0 ? `(${timer}s)` : ''}
        </button>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center p-6 text-white/50 text-xs">
        <Loader2 className="w-5 h-5 animate-spin mb-1 text-secondary-300" />
        Loading...
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
