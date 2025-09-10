import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { HeartPulseIcon, StethoscopeIcon, PillIcon, SmileIcon, EyeIcon, EyeOffIcon, AlertCircle } from "lucide-react";
import { authService } from "../../services/auth/authService";
import { useAuthStore } from "../../store/auth";

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

// Slides do carrossel de informações institucionais
const slides = [
  {
    titulo: "Bem-vindo à Vitalis!",
    texto: "A Vitalis conecta você à saúde de excelência, com tecnologia, humanização e cuidado em cada detalhe.",
    img: "/logo-small-1-1.png"
  },
  {
    titulo: "Consultas Ilimitadas",
    texto: "Tenha acesso a consultas médicas online sempre que precisar, sem sair de casa.",
    img: "/public/consulta.png"
  },
  {
    titulo: "Descontos em Medicamentos",
    texto: "Aproveite benefícios exclusivos em nossa farmácia parceira e cuide da sua saúde economizando.",
    img: "/public/etiqueta-de-preco.png"
  },
  {
    titulo: "Atendimento Humanizado",
    texto: "Nossa equipe está pronta para te atender com empatia e excelência, 24h por dia.",
    img: "/public/recursos-humanos.png"
  }
];

const Login: React.FC = () => {
  // Hook de navegação do React Router
  const navigate = useNavigate();
  // Estados para os campos do formulário
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrarSenha, setLembrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [credenciaisCarregadas, setCredenciaisCarregadas] = useState(false);
  // Estado para controlar o slide atual do carrossel
  const [slideAtual, setSlideAtual] = useState(0);
  const emailRef = React.useRef<HTMLInputElement>(null);

  // Store de autenticação
  const { login, setError, clearError } = useAuthStore();

  // Gerar bolinhas animadas apenas uma vez usando useMemo
  const bolinhasAnimadas = useMemo(() => {
    return Array.from({length: 48}).map((_, i) => ({
      id: i,
      tipo: i % 4,
      tamanho: 18 + (i % 5) * 14,
      left: Math.random() * 95,
      top: Math.random() * 95,
      blur: i % 7 === 0,
      opacity: 0.7 - (i % 5) * 0.1,
      animacao: (i % 3) + 1
    }));
  }, []); // Array vazio garante que só será executado uma vez

  // Carregar credenciais salvas ao inicializar
  useEffect(() => {
    const savedCredentials = localStorage.getItem('vitalis_remember_credentials');
    if (savedCredentials) {
      try {
        const { email: savedEmail, senha: savedSenha, lembrar } = JSON.parse(savedCredentials);
        if (lembrar) {
          setEmail(savedEmail || '');
          setSenha(savedSenha || '');
          setLembrarSenha(true);
          setCredenciaisCarregadas(true);
          
          // Remover a mensagem após 3 segundos
          setTimeout(() => setCredenciaisCarregadas(false), 3000);
        }
      } catch (error) {
        console.error('Erro ao carregar credenciais salvas:', error);
        localStorage.removeItem('vitalis_remember_credentials');
      }
    }
  }, []);

  // Efeito para trocar automaticamente o slide do carrossel a cada 4 segundos
  useEffect(() => {
    if (emailRef.current) emailRef.current.focus();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideAtual((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Função para salvar credenciais no localStorage
  const salvarCredenciais = (email: string, senha: string, lembrar: boolean) => {
    if (lembrar) {
      localStorage.setItem('vitalis_remember_credentials', JSON.stringify({
        email,
        senha,
        lembrar: true
      }));
    } else {
      localStorage.removeItem('vitalis_remember_credentials');
    }
  };

  // Função para tratar o envio do formulário de login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && senha) {
      setErro("");
      setLoading(true);
      clearError();
      
      try {
        const response = await authService.login({ email, password: senha });
        login(response.token, response.user);
        
        // Salvar credenciais se "lembrar senha" estiver ativo
        salvarCredenciais(email, senha, lembrarSenha);
        
        setLoading(false);
        navigate("/home");
      } catch (error: any) {
        setLoading(false);
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           "Erro ao fazer login. Verifique suas credenciais.";
        setErro(errorMessage);
        setError(errorMessage);
      }
    } else {
      setErro("Preencha todos os campos.");
    }
  };

  // Função para limpar credenciais salvas
  const limparCredenciaisSalvas = () => {
    localStorage.removeItem('vitalis_remember_credentials');
    setEmail('');
    setSenha('');
    setLembrarSenha(false);
  };

  // Navegação manual do carrossel
  const handlePrev = () => setSlideAtual((prev) => (prev - 1 + slides.length) % slides.length);
  const handleNext = () => setSlideAtual((prev) => (prev + 1) % slides.length);
  const handleDot = (idx: number) => setSlideAtual(idx);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600">
      {/* Partículas animadas - agora otimizadas */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {bolinhasAnimadas.map((bolinha) => (
          <div
            key={bolinha.id}
            className={`absolute rounded-full ${
              bolinha.tipo === 0 ? 'bg-blue-400/30' : 
              bolinha.tipo === 1 ? 'bg-blue-200/30' : 
              bolinha.tipo === 2 ? 'bg-cyan-300/30' : 'bg-white/20'
            } animate-float${bolinha.animacao}`}
            style={{
              width: `${bolinha.tamanho}px`,
              height: `${bolinha.tamanho}px`,
              left: `${bolinha.left}%`,
              top: `${bolinha.top}%`,
              filter: bolinha.blur ? 'blur(2px)' : 'none',
              opacity: bolinha.opacity
            }}
          />
        ))}
      </div>
      {/* Overlay escuro para contraste */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/70 to-blue-600/80 z-10" />
      {/* Container principal */}
      <div className="flex flex-col md:flex-row gap-10 items-center w-full max-w-4xl animate-fade-in relative z-20">
        {/* Formulário de login */}
        <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full animate-fade-in flex flex-col items-center">
          {/* Logo maior */}
          <img src="/logo-ext-b.png" alt="Logo Vitalis" className="w-64 h-24 mb-2 drop-shadow-2xl" />
          <div className="flex items-center gap-2 mb-6">
            <lord-icon src="https://cdn.lordicon.com/kthelypq.json" trigger="loop" colors="primary:#2563eb,secondary:#60a5fa" style={{ width: "48px", height: "48px" }}></lord-icon>
          </div>
          <p className="font-bold text-blue-700 mb-4">Bem-vindo de volta! Faça login para continuar.</p>
          <form onSubmit={handleLogin} className="space-y-6 w-full">
            <div>
              <label className="block text-blue-900 font-semibold mb-1">E-mail</label>
              <input
                ref={emailRef}
                type="email"
                className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none transition focus:border-blue-500"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="joao@email.com"
                autoComplete="username"
                required
              />
            </div>
            <div className="relative">
              <label className="block text-blue-900 font-semibold mb-1">Senha</label>
              <input
                type={mostrarSenha ? "text" : "password"}
                className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none transition focus:border-blue-500 pr-12"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-blue-400 hover:text-blue-700 focus:outline-none"
                tabIndex={-1}
                onClick={() => setMostrarSenha(v => !v)}
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                {mostrarSenha ? <EyeOffIcon size={22} /> : <EyeIcon size={22} />}
              </button>
            </div>
            
            {/* Checkbox Lembrar Senha */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={lembrarSenha}
                  onChange={(e) => setLembrarSenha(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  aria-describedby="lembrar-senha-help"
                />
                <span className="text-blue-900 text-sm font-medium">Lembrar senha</span>
                <div className="relative">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10">
                    Suas credenciais serão salvas localmente
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              </label>
              
              {/* Botão para limpar credenciais salvas */}
              {localStorage.getItem('vitalis_remember_credentials') && (
                <button
                  type="button"
                  onClick={limparCredenciaisSalvas}
                  className="text-blue-600 hover:text-blue-800 text-xs underline transition-colors"
                  title="Remove as credenciais salvas do navegador"
                >
                  Limpar dados salvos
                </button>
              )}
            </div>
            
            {/* Aviso de segurança */}
            {lembrarSenha && (
              <div className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded px-3 py-2">
                <div className="flex items-start gap-2">
                  <svg className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>
                    <strong>Segurança:</strong> Suas credenciais serão salvas apenas neste dispositivo. 
                    Não use esta opção em computadores públicos.
                  </span>
                </div>
              </div>
            )}
            
            {/* Mensagem de ajuda para acessibilidade */}
            <div id="lembrar-senha-help" className="sr-only">
              Marque esta opção para salvar suas credenciais no navegador e facilitar futuros logins.
            </div>
            
            {/* Mensagem de credenciais carregadas */}
            {credenciaisCarregadas && (
              <div className="flex items-center gap-2 text-green-600 text-sm font-medium bg-green-50 border border-green-200 rounded px-3 py-2 animate-pulse">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Credenciais carregadas automaticamente
              </div>
            )}
            
            {/* Mensagem de erro com ícone */}
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
              Entrar
            </button>
          </form>
          <div className="flex justify-between mt-6 w-full">
            <button
              className="text-blue-700 font-bold hover:underline text-sm"
              onClick={() => navigate("/EsqueciSenha")}
              type="button"
            >
              Esqueci minha senha
            </button>
          </div>
          <div className="mt-6 text-center">
            <span className="text-blue-700">Não tem uma conta?</span>
            <button
              className="ml-2 text-blue-900 font-bold hover:underline"
              onClick={() => navigate("/cadastro")}
            >
              Cadastre-se
            </button>
          </div>
        </div>
        {/* Carrossel de informações institucionais */}
        <div className="flex flex-col items-center justify-center w-full md:w-[380px] min-h-[420px] bg-gradient-to-br from-blue-700 via-blue-500 to-blue-300 rounded-2xl shadow-2xl p-8 relative overflow-hidden mt-8 md:mt-0">
          {/* Slides com efeito slide */}
          <div className="relative w-full h-[260px] flex items-center justify-center overflow-hidden">
            {slides.map((slide, idx) => (
              <div
                key={idx}
                className={`absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-center transition-all duration-700 ${slideAtual === idx ? 'translate-x-0 opacity-100 z-10' : slideAtual < idx ? 'translate-x-full opacity-0 z-0' : 'translate-x-[-100%] opacity-0 z-0'}`}
                style={{transitionProperty:'opacity, transform'}}
              >
                <div className="flex flex-col items-center mb-2">
                  <img src={slide.img} alt={slide.titulo} className="w-16 h-16 mx-auto mb-2 rounded-xl shadow-lg bg-white p-2" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 drop-shadow">{slide.titulo}</h2>
                <p className="text-blue-100 text-base mb-4 drop-shadow">{slide.texto}</p>
              </div>
            ))}
            {/* Remover setas de navegação */}
          </div>
          {/* Indicadores de slide clicáveis */}
          <div className="mt-6 flex justify-center gap-3">
            {slides.map((_, idx) => (
              <button
                key={idx}
                className={`w-4 h-4 rounded-full border-2 ${slideAtual === idx ? 'bg-white border-blue-900 shadow-lg' : 'bg-blue-300 border-blue-200'} transition-all duration-300`}
                style={{ boxShadow: slideAtual === idx ? '0 0 8px #fff' : undefined }}
                onClick={() => handleDot(idx)}
                aria-label={`Ir para slide ${idx+1}`}
                type="button"
              />
            ))}
          </div>
        </div>
      </div>
      {/* Loader animado */}
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
          100% { transform: translateY(-6px); }
        }
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
        .animate-float1 { animation: float1 8s ease-in-out infinite alternate; }
        .animate-float2 { animation: float2 10s ease-in-out infinite alternate; }
        .animate-float3 { animation: float3 12s ease-in-out infinite alternate; }
        @keyframes float1 { 0%{transform:translateY(0);} 100%{transform:translateY(-30px);} }
        @keyframes float2 { 0%{transform:translateY(0);} 100%{transform:translateY(40px);} }
        @keyframes float3 { 0%{transform:translateY(0);} 100%{transform:translateY(-20px);} }
      `}</style>
    </div>
  );
};

export default Login; 