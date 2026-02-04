
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus, Loader2, CheckCircle2, ShieldCheck, Network } from 'lucide-react';
import Logo from '../components/Layout/Logo';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({ nome: '', email: '', password: '', confirm: '' });
  const [isLoadingState, setIsLoadingState] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const getPasswordStrength = () => {
    if (formData.password.length === 0) return 0;
    if (formData.password.length < 6) return 1;
    if (formData.password.length < 10) return 2;
    return 3;
  };

  const strengthLabels = ['Muito curta', 'Fraca', 'Média', 'Forte'];
  const strengthColors = ['bg-gray-200', 'bg-red-500', 'bg-orange-500', 'bg-green-500'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirm) return alert('Senhas não conferem');

    setIsLoadingState(true);
    try {
      await register(formData.email, formData.nome, formData.password);
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingState(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050B14] p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
          <div className="flex-1 p-8 md:p-12">
            <div className="mb-10">
              <div className="bg-secondary/10 w-12 h-12 rounded-xl flex items-center justify-center text-secondary mb-6">
                <Network size={24} />
              </div>
              <h2 className="text-3xl font-bold text-primary mb-2">Novo Cadastro</h2>
              <p className="text-gray-500 text-sm">Inicie sua jornada no hub contábil de maior evolução tecnológica.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nome Completo"
                required
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-primary transition-all text-sm"
                value={formData.nome}
                onChange={e => setFormData({ ...formData, nome: e.target.value })}
              />
              <input
                type="email"
                placeholder="E-mail Profissional"
                required
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-primary transition-all text-sm"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
              <div>
                <input
                  type="password"
                  placeholder="Senha Segura"
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-primary transition-all text-sm"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
                <div className="mt-3 flex gap-1 h-1">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`flex-1 rounded-full transition-all duration-500 ${getPasswordStrength() >= i ? strengthColors[getPasswordStrength()] : 'bg-gray-100'}`} />
                  ))}
                </div>
                {formData.password && <p className="text-[9px] uppercase font-bold text-gray-400 mt-2 tracking-widest">{strengthLabels[getPasswordStrength()]}</p>}
              </div>
              <input
                type="password"
                placeholder="Confirmar Senha"
                required
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-primary transition-all text-sm"
                value={formData.confirm}
                onChange={e => setFormData({ ...formData, confirm: e.target.value })}
              />

              <button
                type="submit"
                disabled={isLoadingState}
                className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 mt-4 shadow-xl shadow-secondary/20"
              >
                {isLoadingState ? <Loader2 className="animate-spin" /> : <><UserPlus size={18} /> Criar Conta</>}
              </button>
            </form>

            <p className="text-center text-xs text-gray-500 mt-8">
              Já possui acesso? <Link to="/login" className="text-primary font-bold hover:underline">Efetuar login</Link>
            </p>
          </div>

          <div className="hidden md:flex flex-1 bg-primary p-12 text-white flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
              <Logo size="sm" />
            </div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none -mr-32 -mb-32"></div>

            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                <ShieldCheck size={32} className="text-secondary-light" />
              </div>
              <h3 className="text-2xl font-bold mb-6">Controle Profissional</h3>
              <ul className="space-y-5">
                {[
                  'Dashboard em tempo real',
                  'Gestão de impostos simplificada',
                  'Indicadores financeiros precisos',
                  'Segurança de dados bancários',
                  'Integração com Alterdata'
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                    <CheckCircle2 size={18} className="text-secondary shrink-0" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative z-10">
              <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold">Enterprise Cloud Platform</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
