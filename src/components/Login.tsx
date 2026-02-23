import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { SplashScreen } from './SplashScreen';
import logo from '@/assets/logo.png';

export function Login() {
  const [showSplash, setShowSplash] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const tokenResult = await result.user.getIdTokenResult();

      if (tokenResult.claims.role !== 'admin') {
        await auth.signOut();
        setError('No tienes permisos de administrador');
        setLoading(false);
        return;
      }
      // Login successful
    } catch (err: any) {
      console.error('Error en login Google:', err);
      setError(err.message || 'Error al iniciar sesión con Google');
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor ingresa correo y contraseña');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      // Check admin claim manually if needed, or rely on security rules/backend
      // For consistency, we verify claim:
      const tokenResult = await result.user.getIdTokenResult();

      if (tokenResult.claims.role !== 'admin') {
        // Optional: Allow non-admins? Based on previous code, NO.
        // But if user just created it, maybe they don't have claim yet.
        // We will show error but NOT sign out immediately to allow debugging if user wants to see "Access Denied" screen from App.tsx
        // Actually App.tsx handles "Access Denied" nicely. So we can just let it through.
        // But previous code signed out. Let's keep consistency:
        if (tokenResult.claims.role !== 'admin') {
          await auth.signOut();
          setError('Tu cuenta no tiene permisos de administrador (Role: admin faltante).');
          setLoading(false);
          return;
        }
      }

    } catch (err: any) {
      console.error('Error en login Email:', err);
      if (err.code === 'auth/invalid-credential') {
        setError('Credenciales incorrectas. Verifica tu correo y contraseña.');
      } else {
        setError('Error al iniciar sesión. Intenta nuevamente.');
      }
      setLoading(false);
    }
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center relative overflow-hidden">
      {/* Dark Overlay with Blur */}
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm z-0"></div>

      {/* Glass Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-fade-in-up">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-full bg-white/10 mb-4 border border-white/10 shadow-inner">
            <img src={logo} alt="TaxiPro" className="w-16 h-16 object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">taxi<span className="text-blue-400">pro</span></h1>
          <p className="text-gray-300 text-sm font-light tracking-wider uppercase">Panel de Control</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg backdrop-blur-sm animate-shake">
            <p className="text-sm text-red-200 text-center font-medium">{error}</p>
          </div>
        )}

        {/* Email Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
          <div>
            <label className="block text-xs uppercase text-gray-400 mb-1 ml-1 font-semibold tracking-wider">Correo</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              placeholder="admin@taxipro.com"
            />
          </div>

          <div>
            <label className="block text-xs uppercase text-gray-400 mb-1 ml-1 font-semibold tracking-wider">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-transparent text-gray-400 text-xs uppercase">O continúa con</span>
          </div>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-6 py-3 text-white font-medium transition-all duration-300 group"
        >
          <svg className="w-5 h-5 opacity-75 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </button>

        <p className="text-xs text-gray-500 text-center mt-8">
          Sistema Seguro • v2.0.0
        </p>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}
