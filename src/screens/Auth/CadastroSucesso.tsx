import React from "react";
import { useNavigate } from "react-router-dom";

// Adiciona suporte ao elemento customizado 'lord-icon' no JSX/TSX
// Isso evita erro de linter/TypeScript
// Pode ser removido se já existir em outro lugar do projeto
// @ts-ignore
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lord-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        trigger?: string;
        colors?: string;
        style?: React.CSSProperties;
      };
    }
  }
}

const CadastroSucesso: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-400 relative overflow-hidden">
      {/* Animação de fundo com gradiente animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-blue-300 to-blue-500 animate-bg-move z-0" />
      {/* Card principal com animação de entrada */}
      <div className="relative z-20 w-full max-w-2xl">
        <div className="bg-white/90 rounded-3xl shadow-2xl px-8 py-8 flex flex-col items-center animate-fade-slide-in border-2 border-blue-100 max-w-md mx-auto">
          {/* Ícone animado Lordicon de sucesso */}
          <lord-icon
            src="https://cdn.lordicon.com/lupuorrc.json"
            trigger="loop"
            colors="primary:#2563eb,secondary:#60a5fa"
            style={{ width: "70px", height: "70px", marginBottom: 16 }}
          ></lord-icon>
          <h2 className="text-4xl font-extrabold text-blue-900 mb-3 text-center drop-shadow">Cadastro realizado com sucesso!</h2>
          <p className="text-blue-700 mb-6 text-xl text-center">Seja muito bem-vindo(a) à Vitalis.<br/>Sua jornada de saúde começa agora.</p>
          <ul className="bg-blue-50 rounded-xl p-4 mb-6 text-blue-800 text-base w-full shadow-inner flex flex-col gap-2">
            <li className="flex items-center gap-2"><lord-icon src='https://cdn.lordicon.com/lecprnjb.json' trigger='loop' colors='primary:#2563eb,secondary:#60a5fa' style={{width:'24px',height:'24px'}}></lord-icon> Acesse a plataforma com seu login e senha</li>
            <li className="flex items-center gap-2"><lord-icon src='https://cdn.lordicon.com/ajkxzzfb.json' trigger='loop' colors='primary:#2563eb,secondary:#60a5fa' style={{width:'24px',height:'24px'}}></lord-icon> Complete seu perfil para um atendimento personalizado</li>
            <li className="flex items-center gap-2"><lord-icon src='https://cdn.lordicon.com/egiwmiit.json' trigger='loop' colors='primary:#2563eb,secondary:#60a5fa' style={{width:'24px',height:'24px'}}></lord-icon> Aproveite todos os benefícios Vitalis!</li>
          </ul>
          <button
            onClick={() => navigate("/login")}
            className="px-10 py-4 bg-gradient-to-r from-blue-700 to-blue-900 text-white text-lg font-bold rounded-2xl shadow-xl hover:scale-105 transition-transform duration-200 animate-bounce mt-2"
          >
            Ir para o login
          </button>
        </div>
      </div>
      {/* Estilos de animação para fade/slide e gradiente animado */}
      <style>{`
        .animate-fade-slide-in {
          opacity: 0;
          transform: translateY(40px) scale(0.98);
          animation: fadeSlideIn 1s cubic-bezier(.4,1,.4,1) 0.2s forwards;
        }
        @keyframes fadeSlideIn {
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-bounce {
          animation: bounce 1.2s infinite alternate;
        }
        @keyframes bounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(-8px); }
        }
        .animate-bg-move {
          animation: bgMove 8s ease-in-out infinite alternate;
        }
        @keyframes bgMove {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
};

export default CadastroSucesso; 