import React, { useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/auth/authService";
import { useAuthStore } from "../../store/auth";
import { RegisterRequest } from "../../types/api";

const planos = [
  {
    id: 1,
    nome: "Essencial Vitalis",
    valor: 39.9,
    beneficios: [
      "Consultas ilimitadas",
      "Descontos em medicamentos",
      "Acesso ao app Vitalis"
    ]
  },
  {
    id: 2,
    nome: "Vitalis Plus",
    valor: 59.9,
    beneficios: [
      "Tudo do Essencial",
      "Teleconsultas com especialistas",
      "Check-up anual gratuito"
    ]
  },
  {
    id: 3,
    nome: "Vitalis Premium",
    valor: 89.9,
    beneficios: [
      "Tudo do Plus",
      "Atendimento prioritário",
      "Suporte 24h"
    ]
  }
];

const mascaraCPF = (v: string) => v
  .replace(/\D/g, "")
  .replace(/(\d{3})(\d)/, "$1.$2")
  .replace(/(\d{3})(\d)/, "$1.$2")
  .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

const mascaraTelefone = (v: string) => v
  .replace(/\D/g, "")
  .replace(/(\d{2})(\d)/, "($1) $2")
  .replace(/(\d{5})(\d)/, "$1-$2")
  .slice(0, 15);

// Função para calcular idade
const calcularIdade = (dataNascimento: string): number => {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mesAtual = hoje.getMonth();
  const mesNascimento = nascimento.getMonth();
  
  if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  
  return idade;
};

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

// Geração das partículas fora do componente
const PARTICULAS = Array.from({length: 48}).map((_, i) => ({
  key: i,
  className: `absolute rounded-full ${i%4===0 ? 'bg-blue-400/30' : i%4===1 ? 'bg-blue-200/30' : i%4===2 ? 'bg-cyan-300/30' : 'bg-white/20'} animate-float${(i%3)+1}`,
  style: {
    width: `${18 + (i%5)*14}px`,
    height: `${18 + (i%5)*14}px`,
    left: `${Math.random()*95}%`,
    top: `${Math.random()*95}%`,
    filter: i%7===0 ? 'blur(2px)' : 'none',
    opacity: 0.7 - (i%5)*0.1
  }
}));

const CadastroPaciente: React.FC = () => {
  const [step, setStep] = useState(0);
  const [dados, setDados] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    dataNascimento: "",
    genero: "O",
    cep: "",
    rua: "",
    bairro: "",
    cidade: "",
    estado: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    plano: null as null | number,
    pagamento: false
  });
  const [erro, setErro] = useState("");
  const [carregandoCep, setCarregandoCep] = useState(false);
  const navigate = useNavigate();
  const { login, setError, clearError } = useAuthStore();
  const [loading, setLoading] = useState(false);
  // Novos estados para o checkout
  const [checkout, setCheckout] = useState({
    nomeCartao: "",
    numeroCartao: "",
    validade: "",
    cvv: ""
  });

  const mascaraNumeroCartao = (valor: string) => {
    return valor
      .replace(/\D/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim()
      .slice(0, 19);
  };

  const mascaraValidade = (valor: string) => {
    return valor
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d{0,2})/, '$1/$2')
      .slice(0, 5);
  };

  const mascaraCVV = (valor: string) => {
    // Remove caracteres não numéricos e limita a 3 ou 4 dígitos
    const numeros = valor.replace(/\D/g, '');
    return numeros.slice(0, 4);
  };

  const validarCheckout = () => {
    if (!checkout.nomeCartao.trim()) {
      setErro("Nome no cartão é obrigatório");
      return false;
    }
    if (checkout.numeroCartao.replace(/\s/g, '').length < 16) {
      setErro("Número do cartão inválido");
      return false;
    }
    if (!checkout.validade || !/^\d{2}\/\d{2}$/.test(checkout.validade)) {
      setErro("Data de validade inválida");
      return false;
    }
    // Validação específica para CVV
    const cvvNumeros = checkout.cvv.replace(/\D/g, '');
    if (cvvNumeros.length < 3 || cvvNumeros.length > 4) {
      setErro("CVV deve ter 3 ou 4 dígitos");
      return false;
    }
    return true;
  };

  // Busca endereço pelo CEP usando API IBGE
  const buscarCep = async () => {
    if (dados.cep.length < 8) return;
    setCarregandoCep(true);
    try {
      const res = await axios.get(`https://viacep.com.br/ws/${dados.cep.replace(/\D/g, "")}/json/`);
      if (res.data.erro) throw new Error("CEP não encontrado");
      setDados(prev => ({
        ...prev,
        rua: res.data.logradouro,
        bairro: res.data.bairro,
        cidade: res.data.localidade,
        estado: res.data.uf
      }));
      setErro("");
    } catch {
      setErro("CEP não encontrado.");
    }
    setCarregandoCep(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDados(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDados(prev => ({ ...prev, [name]: value }));
  };

  const handleCpf = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDados(prev => ({ ...prev, cpf: mascaraCPF(e.target.value) }));
  };

  const handleTelefone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDados(prev => ({ ...prev, telefone: mascaraTelefone(e.target.value) }));
  };

  const validarStep = () => {
    setErro("");
    if (step === 1) {
      if (!dados.nome || dados.cpf.length < 14 || dados.telefone.length < 14 || dados.genero === "O" || !dados.dataNascimento) {
        setErro("Preencha todos os campos corretamente.");
        return false;
      }
      
      // Validar idade mínima de 18 anos
      const idade = calcularIdade(dados.dataNascimento);
      if (idade < 18) {
        setErro("Você deve ter pelo menos 18 anos para se cadastrar.");
        return false;
      }
    }
    if (step === 2) {
      if (!dados.cep || !dados.rua || !dados.bairro || !dados.cidade || !dados.estado) {
        setErro("Preencha todos os campos de endereço.");
        return false;
      }
    }
    if (step === 3) {
      if (!dados.email || !dados.senha || dados.senha.length < 6 || dados.senha !== dados.confirmarSenha) {
        setErro("Preencha corretamente o e-mail e as senhas.");
        return false;
      }
    }
    return true;
  };

  const avancar = () => {
    if (validarStep()) setStep(step + 1);
  };

  const voltar = () => {
    setErro("");
    setStep(step - 1);
  };

  const escolherPlano = (idx: number) => {
    setDados(prev => ({ ...prev, plano: idx }));
    setTimeout(() => setStep(5), 400); // animação
  };

  const pularAssinatura = () => {
    setDados(prev => ({ ...prev, plano: null }));
    finalizarCadastro();
  };

  const finalizarCadastro = async () => {
    // Se tem plano selecionado, valida checkout. Se não tem plano, pula validação
    if (dados.plano !== null && !validarCheckout()) {
      return;
    }
    
    setLoading(true);
    clearError();
    
    try {
      // Preparar dados para o registro
      const userData: RegisterRequest = {
        name: dados.nome,
        email: dados.email,
        password: dados.senha,
        cpf: dados.cpf.replace(/\D/g, ''),
        phone: dados.telefone.replace(/\D/g, ''),
        birthdate: dados.dataNascimento,
        genero: dados.genero === 'M' ? 'masculino' : dados.genero === 'F' ? 'feminino' : '',
        address: {
          cep: dados.cep.replace(/\D/g, ''),
          street: dados.rua,
          number: '1', // Você pode adicionar campo de número
          neighborhood: dados.bairro,
          city: dados.cidade,
          state: dados.estado,
        },
        planId: dados.plano !== null ? planos[dados.plano].id.toString() : undefined,
      };

      const response = await authService.register(userData);
      login(response.token, response.user);
      setLoading(false);
      navigate('/cadastro-sucesso');
    } catch (error: any) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         "Erro ao criar conta. Tente novamente.";
      setErro(errorMessage);
      setError(errorMessage);
    }
  };

  // Cards de cada etapa
  const steps = [
    // 0 - Apresentação inicial
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full animate-fade-in flex flex-col items-center text-center">
      <lord-icon src="https://cdn.lordicon.com/egmlnyku.json" trigger="loop" colors="primary:#2563eb,secondary:#60a5fa" style={{width:70,height:70}} />
      <h2 className="text-3xl font-extrabold text-blue-900 mb-2 mt-4">Bem-vindo à Vitalis!</h2>
      <p className="text-blue-800 mb-4 text-lg">Vamos criar sua conta para você acessar consultas, benefícios e cuidar da sua saúde de forma simples e segura.</p>
      <div className="w-full flex flex-col gap-3 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🧑</span>
          <div className="text-left">
            <span className="font-bold text-blue-900">1. Dados pessoais</span><br/>
            <span className="text-blue-700 text-sm">Nome, CPF, telefone e data de nascimento. Você deve ter pelo menos 18 anos.</span>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-2xl">🏠</span>
          <div className="text-left">
            <span className="font-bold text-blue-900">2. Endereço</span><br/>
            <span className="text-blue-700 text-sm">Informe seu CEP e endereço completo. Buscamos o endereço automaticamente para você!</span>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-2xl">🔒</span>
          <div className="text-left">
            <span className="font-bold text-blue-900">3. Conta de acesso</span><br/>
            <span className="text-blue-700 text-sm">E-mail e senha para acessar a plataforma. Dica: use uma senha forte.</span>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-2xl">💳</span>
          <div className="text-left">
            <span className="font-bold text-blue-900">4. Escolha de plano (opcional)</span><br/>
            <span className="text-blue-700 text-sm">Você pode escolher um plano de assinatura Vitalis ou pular essa etapa.</span>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-2xl">✅</span>
          <div className="text-left">
            <span className="font-bold text-blue-900">5. Pagamento</span><br/>
            <span className="text-blue-700 text-sm">Se escolher um plano, finalize com pagamento seguro e criptografado.</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-blue-700 text-sm mb-4">
        <lord-icon src="https://cdn.lordicon.com/yeallgsa.json" trigger="loop" colors="primary:#2563eb,secondary:#60a5fa" style={{width:'24px',height:'24px'}}></lord-icon>
        Seus dados estão protegidos e criptografados.
      </div>
      <p className="text-blue-600 mb-6 font-semibold">Fique tranquilo! Você pode avançar ou voltar entre as etapas a qualquer momento.</p>
      <div className="flex w-full justify-between">
        <button onClick={() => navigate(-1)} className="px-8 py-3 bg-blue-100 text-blue-900 font-bold rounded-lg shadow hover:bg-blue-200 transition">Voltar</button>
        <button onClick={() => setStep(1)} className="px-8 py-3 bg-gradient-to-r from-blue-700 to-blue-900 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-transform duration-200 animate-bounce text-lg">Começar cadastro</button>
      </div>
    </div>,
    // 1 - Dados pessoais
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full animate-fade-in">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Dados Pessoais</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-blue-900 font-semibold mb-1">Nome completo</label>
          <input name="nome" value={dados.nome} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none transition" placeholder="Digite seu nome completo" />
        </div>
        <div>
          <label className="block text-blue-900 font-semibold mb-1">CPF</label>
          <input name="cpf" value={dados.cpf} onChange={handleCpf} maxLength={14} className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none transition" placeholder="000.000.000-00" />
        </div>
        <div>
          <label className="block text-blue-900 font-semibold mb-1">Telefone</label>
          <input name="telefone" value={dados.telefone} onChange={handleTelefone} maxLength={15} className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none transition" placeholder="(11) 91234-5678" />
        </div>
        <div>
          <label className="block text-blue-900 font-semibold mb-1">Data de Nascimento</label>
          <input 
            name="dataNascimento" 
            type="date" 
            value={dados.dataNascimento} 
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none transition" 
          />
          {dados.dataNascimento && (
            <div className="text-sm text-blue-700 mt-1">
              Idade: {calcularIdade(dados.dataNascimento)} anos
              {calcularIdade(dados.dataNascimento) < 18 && (
                <span className="text-red-600 font-semibold ml-2">⚠️ Menor de 18 anos</span>
              )}
            </div>
          )}
        </div>
        <div>
          <label className="block text-blue-900 font-semibold mb-1">Sexo</label>
          <select 
            name="genero" 
            value={dados.genero} 
            onChange={handleSelectChange}
            className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none transition"
          >
            <option value="O">Selecione o Sexo</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
          </select>
        </div>
      </div>
      {erro && <div className="text-red-600 text-sm font-semibold mt-2">{erro}</div>}
      <div className="flex justify-between mt-6">
        <button onClick={voltar} className="px-8 py-3 bg-blue-100 text-blue-900 font-bold rounded-lg shadow hover:bg-blue-200 transition">Voltar</button>
        <button onClick={avancar} className="px-8 py-3 bg-gradient-to-r from-blue-700 to-blue-900 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-transform duration-200 animate-bounce">Próximo</button>
      </div>
    </div>,
    // 2 - Endereço
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full animate-fade-in">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Endereço</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-blue-900 font-semibold mb-1">CEP</label>
          <input name="cep" value={dados.cep} onChange={handleChange} onBlur={buscarCep} maxLength={9} className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none transition" placeholder="00000-000" />
          {carregandoCep && <span className="text-blue-700 text-xs ml-2">Buscando endereço...</span>}
        </div>
        <div>
          <label className="block text-blue-900 font-semibold mb-1">Rua</label>
          <input name="rua" value={dados.rua} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none transition" placeholder="Rua" />
        </div>
        <div>
          <label className="block text-blue-900 font-semibold mb-1">Bairro</label>
          <input name="bairro" value={dados.bairro} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none transition" placeholder="Bairro" />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-blue-900 font-semibold mb-1">Cidade</label>
            <input name="cidade" value={dados.cidade} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none transition" placeholder="Cidade" />
          </div>
          <div className="w-32">
            <label className="block text-blue-900 font-semibold mb-1">Estado</label>
            <input name="estado" value={dados.estado} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none transition" placeholder="UF" maxLength={2} />
          </div>
        </div>
      </div>
      {erro && <div className="text-red-600 text-sm font-semibold mt-2">{erro}</div>}
      <div className="flex justify-between mt-6">
        <button onClick={voltar} className="px-8 py-3 bg-blue-100 text-blue-900 font-bold rounded-lg shadow hover:bg-blue-200 transition">Voltar</button>
        <button onClick={avancar} className="px-8 py-3 bg-gradient-to-r from-blue-700 to-blue-900 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-transform duration-200 animate-bounce">Próximo</button>
      </div>
    </div>,
    // 3 - Acesso
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full animate-fade-in">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Acesso</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-blue-900 font-semibold mb-1">E-mail</label>
          <input name="email" value={dados.email} onChange={handleChange} type="email" className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none transition" placeholder="Digite seu e-mail" />
        </div>
        <div>
          <label className="block text-blue-900 font-semibold mb-1">Senha</label>
          <input name="senha" value={dados.senha} onChange={handleChange} type="password" className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none transition" placeholder="Crie uma senha" />
        </div>
        <div>
          <label className="block text-blue-900 font-semibold mb-1">Confirmar Senha</label>
          <input name="confirmarSenha" value={dados.confirmarSenha} onChange={handleChange} type="password" className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none transition" placeholder="Confirme a senha" />
        </div>
      </div>
      {erro && <div className="text-red-600 text-sm font-semibold mt-2">{erro}</div>}
      <div className="flex justify-between mt-6">
        <button onClick={voltar} className="px-8 py-3 bg-blue-100 text-blue-900 font-bold rounded-lg shadow hover:bg-blue-200 transition">Voltar</button>
        <button onClick={avancar} className="px-8 py-3 bg-gradient-to-r from-blue-700 to-blue-900 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-transform duration-200 animate-bounce">Próximo</button>
      </div>
    </div>,
    // 4 - Assinatura
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full animate-fade-in">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Escolha sua Assinatura</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {planos.map((plano, idx) => (
          <div key={plano.nome} className={`rounded-xl border-2 p-6 shadow-lg flex flex-col items-center transition-all duration-200 cursor-pointer ${dados.plano === idx ? 'border-blue-800 bg-blue-50 scale-105' : 'border-blue-200 bg-white hover:scale-105'}`} onClick={() => escolherPlano(idx)}>
            <h3 className="text-xl font-bold text-blue-900 mb-2">{plano.nome}</h3>
            <div className="text-3xl font-extrabold text-blue-800 mb-2">R$ {plano.valor.toFixed(2)}</div>
            <ul className="text-blue-700 text-sm mb-4 space-y-1">
              {plano.beneficios.map(b => <li key={b}>• {b}</li>)}
            </ul>
            <button className={`mt-auto px-6 py-2 rounded-full font-bold text-white shadow transition-all duration-200 ${dados.plano === idx ? 'bg-gradient-to-r from-blue-700 to-blue-900 animate-bounce' : 'bg-blue-700 hover:bg-blue-800'}`}>Assinar</button>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center gap-4 mt-6">
        <button onClick={pularAssinatura} className="px-6 py-2 text-blue-700 font-medium hover:text-blue-900 transition-colors text-sm">Continuar sem assinatura</button>
        <button onClick={voltar} className="px-8 py-3 bg-blue-100 text-blue-900 font-bold rounded-lg shadow hover:bg-blue-200 transition">Voltar</button>
      </div>
    </div>,
    // 5 - Checkout de cartão de crédito
    <div className="bg-white rounded-2xl shadow-xl p-10 max-w-lg w-full animate-fade-in flex flex-col items-center relative">
      <lord-icon
        src="https://cdn.lordicon.com/qghrdngw.json"
        trigger="loop"
        colors="primary:#2563eb,secondary:#60a5fa"
        style={{ width: "70px", height: "70px", marginBottom: 16 }}
      ></lord-icon>
      <h2 className="text-2xl font-bold text-blue-900 mb-2 text-center">Pagamento com Cartão de Crédito</h2>
      <div className="bg-blue-50 rounded-xl p-4 mb-6 w-full">
        <div className="text-blue-800 font-bold text-lg">{planos[dados.plano ?? 0].nome}</div>
        <div className="text-blue-700 text-base mb-1">{planos[dados.plano ?? 0].beneficios.join(' • ')}</div>
        <div className="text-2xl font-extrabold text-blue-900">R$ {planos[dados.plano ?? 0].valor.toFixed(2)}</div>
      </div>
      <form className="w-full space-y-4" onSubmit={e => { e.preventDefault(); finalizarCadastro(); }}>
        <div>
          <label className="block text-blue-900 font-semibold mb-1">Nome no cartão</label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none transition"
            placeholder="Como está no cartão"
            value={checkout.nomeCartao}
            onChange={e => setCheckout({ ...checkout, nomeCartao: e.target.value.toUpperCase() })}
            required
          />
        </div>
        <div>
          <label className="block text-blue-900 font-semibold mb-1">Número do cartão</label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none transition"
            placeholder="0000 0000 0000 0000"
            maxLength={19}
            value={checkout.numeroCartao}
            onChange={e => setCheckout({ ...checkout, numeroCartao: mascaraNumeroCartao(e.target.value) })}
            required
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-blue-900 font-semibold mb-1">Validade</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none transition"
              placeholder="MM/AA"
              maxLength={5}
              value={checkout.validade}
              onChange={e => setCheckout({ ...checkout, validade: mascaraValidade(e.target.value) })}
              required
            />
          </div>
          <div className="w-24">
            <label className="block text-blue-900 font-semibold mb-1">CVV</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none transition"
              placeholder="123"
              maxLength={4}
              value={checkout.cvv}
              onChange={e => {
                const valor = mascaraCVV(e.target.value);
                setCheckout({ ...checkout, cvv: valor });
                // Limpa o erro se o CVV estiver válido
                if (valor.length >= 3) {
                  setErro("");
                }
              }}
              required
            />
          </div>
        </div>
        {erro && <div className="text-red-600 text-sm font-semibold mt-2">{erro}</div>}
        <div className="flex items-center gap-2 text-blue-700 text-sm mt-2">
          <lord-icon src="https://cdn.lordicon.com/yeallgsa.json" trigger="loop" colors="primary:#2563eb,secondary:#60a5fa" style={{width:'24px',height:'24px'}}></lord-icon>
          Seus dados estão protegidos e criptografados.
        </div>
        <button type="submit" className="w-full py-3 mt-4 bg-gradient-to-r from-blue-700 to-blue-900 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-transform duration-200 animate-bounce text-lg">Finalizar pagamento</button>
      </form>
      <div className="flex justify-between mt-6 w-full">
        <button onClick={voltar} className="px-8 py-3 bg-blue-100 text-blue-900 font-bold rounded-lg shadow hover:bg-blue-200 transition">Voltar</button>
      </div>
    </div>
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 relative overflow-hidden">
      {/* Partículas animadas no fundo */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {PARTICULAS.map((particula) => (
          <div
            key={particula.key}
            className={particula.className}
            style={particula.style}
          />
        ))}
      </div>
      {/* Conteúdo principal */}
      <div className="relative z-10 w-full flex items-center justify-center">
        {steps[step]}
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
      `}</style>
    </div>
  );
};

export default CadastroPaciente; 