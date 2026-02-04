
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import Logo from '../components/Layout/Logo';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Acesso restrito. Insira suas credenciais.');
      return;
    }

    const success = await login(email, password);
    if (success) {
      navigate('/');
    } else {
      setError('Credenciais inválidas ou sem permissão.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] -mr-48 -mt-48"></div>

      <div className="max-w-md w-full relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="flex flex-col items-center mb-10">
          <Logo size="lg" />
        </div>

        <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-2xl border border-white/10">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-primary tracking-tight">Autenticação</h2>
            <p className="text-slate-500 text-sm font-medium">Controle de acesso ao Evolutie Hub.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-[11px] font-black uppercase tracking-wider border border-red-100">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail Corporativo</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-secondary/5 focus:border-secondary outline-none transition-all text-primary font-bold placeholder:font-normal"
                placeholder="usuario@email.com"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Senha de Acesso</label>
                <button type="button" className="text-[10px] font-black text-secondary uppercase tracking-widest hover:underline">Esqueceu?</button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-secondary/5 focus:border-secondary outline-none transition-all text-primary font-bold placeholder:font-normal"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-secondary hover:bg-accent text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-secondary/20 active:scale-95 disabled:opacity-50 uppercase tracking-widest text-[11px]"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Acessar Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
            <p className="text-slate-400 text-xs font-medium">
              Não possui acesso? <Link to="/cadastro" className="text-primary font-black hover:text-secondary transition-colors">Solicitar Cadastro</Link>
            </p>

            <div className="flex items-center gap-2 text-slate-300 text-[9px] font-black uppercase tracking-[0.2em]">
              <ShieldCheck size={12} className="text-secondary" />
              Acesso Protegido por Criptografia.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
