'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { Sparkles, Eye, EyeOff, CheckCircle2, XCircle, ArrowRight, Upload, Link2 } from 'lucide-react';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [imageType, setImageType] = useState<'url' | 'upload'>('url');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  // Password rules validation
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase;

  // ImgBB Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, WEBP)');
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      toast.error('ImgBB API key not configured. Please use Image URL instead or configure .env');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setImageUrl(data.data.url);
        toast.success('Profile image uploaded to ImgBB successfully!');
      } else {
        toast.error(data.error?.message || 'Failed to upload image to ImgBB');
      }
    } catch (err: any) {
      toast.error('Failed to upload image. Please check internet connection.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast.error('Please meet all password requirements before submitting.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          password,
          image: imageUrl,
          phone,
        }),
      });

      if (res.success && res.token && res.user) {
        toast.success('Welcome to SalonBook! Account created.');
        login(res.token, res.user);
        router.push('/dashboard/customer');
      } else {
        toast.error(res.message || 'Registration failed.');
      }
    } catch (err: any) {
      toast.error('Something went wrong during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  // Google OAuth Demo Login
  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      const res = await fetchApi('/auth/google', {
        method: 'POST',
        body: JSON.stringify({
          email: `google.user.${Date.now().toString().slice(-4)}@example.com`,
          name: 'Google Customer',
          image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        }),
      });

      if (res.success && res.token && res.user) {
        toast.success('Signed in with Google!');
        login(res.token, res.user);
        router.push('/dashboard/customer');
      } else {
        toast.error(res.message || 'Google sign-in failed');
      }
    } catch (err) {
      toast.error('Error during Google sign-in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-salon-100">
        <div className="text-center">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-salon-600 to-amber-500 items-center justify-center text-white shadow-lg shadow-salon-500/20 mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">Create your account</h2>
          <p className="mt-2 text-sm text-stone-500">
            Join SalonBook to unlock bespoke treatments and private bookings
          </p>
        </div>

        {/* Google Authentication */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-stone-200 rounded-2xl bg-white hover:bg-stone-50 text-stone-700 font-medium text-sm transition-all shadow-sm focus:outline-none"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.97 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-stone-400 font-semibold tracking-wider">
              Or register with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Eleanor Vance"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-salon-500 focus:ring-2 focus:ring-salon-200 outline-none text-sm transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="eleanor@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-salon-500 focus:ring-2 focus:ring-salon-200 outline-none text-sm transition-all"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-salon-500 focus:ring-2 focus:ring-salon-200 outline-none text-sm transition-all"
            />
          </div>

          {/* Profile Image (Upload or URL) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Profile Image
              </label>
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setImageType('url')}
                  className={`px-2 py-0.5 rounded-md ${
                    imageType === 'url' ? 'bg-salon-100 text-salon-700 font-semibold' : 'text-stone-400'
                  }`}
                >
                  <Link2 className="w-3 h-3 inline mr-1" />
                  URL
                </button>
                <button
                  type="button"
                  onClick={() => setImageType('upload')}
                  className={`px-2 py-0.5 rounded-md ${
                    imageType === 'upload' ? 'bg-salon-100 text-salon-700 font-semibold' : 'text-stone-400'
                  }`}
                >
                  <Upload className="w-3 h-3 inline mr-1" />
                  Upload
                </button>
              </div>
            </div>

            {imageType === 'url' ? (
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-salon-500 focus:ring-2 focus:ring-salon-200 outline-none text-sm transition-all"
              />
            ) : (
              <div className="border border-dashed border-stone-300 rounded-xl p-3 text-center bg-stone-50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="text-xs text-stone-600 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-salon-600 file:text-white hover:file:bg-salon-700 cursor-pointer"
                />
                {isUploading && <p className="text-xs text-salon-600 mt-1">Uploading to ImgBB...</p>}
                {imageUrl && !isUploading && (
                  <p className="text-xs text-green-600 mt-1">Image selected: {imageUrl.slice(0, 35)}...</p>
                )}
              </div>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-salon-500 focus:ring-2 focus:ring-salon-200 outline-none text-sm transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Live Password Rules Feedback (Page 10 Requirement) */}
            <div className="mt-2.5 p-3 rounded-xl bg-stone-50 border border-stone-100 space-y-1.5">
              <p className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider">
                Password Requirements:
              </p>
              <div className="flex items-center gap-2 text-xs">
                {hasMinLength ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-stone-300 shrink-0" />
                )}
                <span className={hasMinLength ? 'text-green-700 font-medium' : 'text-stone-500'}>
                  Minimum 6 characters
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {hasUppercase ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-stone-300 shrink-0" />
                )}
                <span className={hasUppercase ? 'text-green-700 font-medium' : 'text-stone-500'}>
                  One uppercase letter (A-Z)
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {hasLowercase ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-stone-300 shrink-0" />
                )}
                <span className={hasLowercase ? 'text-green-700 font-medium' : 'text-stone-500'}>
                  One lowercase letter (a-z)
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !isPasswordValid}
            className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-semibold bg-salon-600 hover:bg-salon-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-salon-600/20 transition-all text-sm"
          >
            {isLoading ? 'Creating Account...' : 'Complete Registration'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-stone-500">
          Already have an account?{' '}
          <Link href="/auth/signin" className="font-semibold text-salon-600 hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}
