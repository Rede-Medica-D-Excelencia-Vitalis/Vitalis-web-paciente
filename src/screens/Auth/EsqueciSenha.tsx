import React, { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MailIcon, CheckCircle, AlertCircle } from "lucide-react";

const EsqueciSenha: React.FC = () => {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);

  // Gera as partículas apenas uma vez ao montar o componente
  const particulas = useMemo(() => (
    Array.from({ length: 32 }).map((_, i) => ({
      key: i,
      className:
        `absolute rounded-full ` +
        (i % 4 === 0
          ? "bg-blue-400/30"
          : i % 4 === 1
          ? "bg-blue-200/30"
          : i % 4 === 2
          ? "bg-cyan-300/30"
          : "bg-white/20") +
        ` animate-float${(i % 3) + 1}`,
      style: {
        width: `${18 + (i % 5) * 14}px`,
        height: `${18 + (i % 5) * 14}px`,
        left: `${Math.random() * 95}%`,
        top: `${Math.random() * 95}%`,
        filter: i % 7 === 0 ? "blur(2px)" : "none",
        opacity: 0.7 - (i % 5) * 0.1,
      },
    }))
  ), []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    if (!email || !email.includes("@")) {
      setErro("Digite um e-mail válido.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEnviado(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 relative overflow-hidden">
      {/* Partículas animadas */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {particulas.map(p => (
          <div key={p.key} className={p.className} style={p.style} />
        ))}
      </div>
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center animate-fade-in">
          <MailIcon size={48} className="text-blue-700 mb-2" />
          <h1 className="text-2xl font-bold text-blue-900 mb-2">Recuperar senha</h1>
          <p className="text-blue-700 mb-6 text-center">Informe seu e-mail cadastrado e enviaremos um link para redefinir sua senha.</p>
          {!enviado ? (
            <form onSubmit={handleSubmit} className="w-full space-y-6">
              <div>
                <label className="block text-blue-900 font-semibold mb-1">E-mail</label>
                <input
                  ref={emailRef}
                  type="email"
                  className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none transition focus:border-blue-500"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  autoComplete="username"
                  required
                />
              </div>
              {erro && (
                <div className="flex items-center gap-2 text-red-600 text-sm font-semibold bg-red-50 border border-red-200 rounded px-3 py-2">
                  <AlertCircle size={18} /> {erro}
                </div>
              )}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-700 to-blue-900 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-transform duration-200 flex items-center justify-center gap-2 text-lg"
                disabled={loading}
              >
                {loading ? <span className="loader mr-2"></span> : null}
                Enviar link de recuperação
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center">
              <CheckCircle size={48} className="text-green-500 mb-2 animate-bounce" />
              <div className="text-blue-900 font-bold text-lg mb-2">Verifique seu e-mail!</div>
              <div className="text-blue-700 text-center mb-4">Enviamos um link para redefinir sua senha. Siga as instruções no seu e-mail.</div>
              <button
                className="px-8 py-3 bg-gradient-to-r from-blue-700 to-blue-900 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-transform duration-200"
                onClick={() => navigate("/login")}
              >Voltar ao login</button>
            </div>
          )}
          {!enviado && (
            <button
              className="mt-6 text-blue-700 font-bold hover:underline text-sm"
              onClick={() => navigate("/login")}
              type="button"
            >
              Voltar ao login
            </button>
          )}
        </div>
      </div>
      <style>{`
        .animate-fade-in {
          opacity: 0;
          animation: fadeIn 0.8s forwards;
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        .animate-bounce {
          animation: bounce 1.2s infinite alternate;
        }
        @keyframes bounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(-8px); }
        }
        .animate-float1 { animation: float1 8s ease-in-out infinite alternate; }
        .animate-float2 { animation: float2 10s ease-in-out infinite alternate; }
        .animate-float3 { animation: float3 12s ease-in-out infinite alternate; }
        @keyframes float1 { 0%{transform:translateY(0);} 100%{transform:translateY(-30px);} }
        @keyframes float2 { 0%{transform:translateY(0);} 100%{transform:translateY(40px);} }
        @keyframes float3 { 0%{transform:translateY(0);} 100%{transform:translateY(-20px);} }
        .loader {
          border: 3px solid #e0e7ef;
          border-top: 3px solid #2563eb;
          border-radius: 50%;
          width: 22px;
          height: 22px;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default EsqueciSenha; 