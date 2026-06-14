import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../api/client';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Enter your password'),
});

type FormValues = z.infer<typeof schema>;

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: Location })?.from?.pathname || '/admin';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  if (isAuthenticated) {
    navigate('/admin', { replace: true });
  }

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      await login(values.email, values.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Login failed'));
    }
  };

  return (
    <div className="min-h-screen bg-black grain relative flex items-center justify-center px-5">
      <div className="relative z-10 w-full max-w-md">
        <Link to="/" className="block text-center mb-8">
          <span className="font-display text-5xl tracking-wider text-white">
            GRIND<span className="text-red">HOUSE</span>
          </span>
          <p className="label text-white/40 mt-2">Staff access</p>
        </Link>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-grey border-2 border-grey-mid p-8 space-y-5"
          noValidate
        >
          <div className="flex items-center gap-2 text-red mb-2">
            <Lock size={18} />
            <h1 className="font-display text-3xl text-white tracking-wide">Admin Login</h1>
          </div>

          {error && (
            <div className="bg-red/10 border border-red px-4 py-2.5 text-red text-sm font-mono">
              {error}
            </div>
          )}

          <Input
            label="Email"
            id="email"
            type="email"
            placeholder="admin@grindhouse.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            id="password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
          <Button type="submit" variant="red" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        <Link
          to="/"
          className="block text-center mt-6 label text-white/40 hover:text-red transition-colors"
        >
          ← Back to site
        </Link>
      </div>
    </div>
  );
}
