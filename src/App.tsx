import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Layout, ProtectedRoute, PlanRequiredRoute, AuthInitializer } from "./components";
import { Agendamento } from "./screens/Agendamento/Agendamento";
import { CentralAjuda } from "./screens/CentralAjuda/CentralAjuda";
import { ConsultasAnteriores } from "./screens/ConsultasAnteriores/ConsultasAnteriores";
import { Emergencia } from "./screens/Emergencia/Emergencia";
import { Farmacia } from "./screens/Farmacia/Farmacia";

import { Cart } from "./screens/Farmacia/Cart";
import { MeuPerfil } from "./screens/MeuPerfil/MeuPerfil";
import { Pagamentos } from "./screens/Pagamentos/Pagamentos";
import { PortalProfissional } from "./screens/PortalProfissional/PortalProfissional";
import { Prescricoes } from "./screens/Prescricoes/Prescricoes";
import { TelaInicial } from "./screens/TelaInicial/TelaInicial";
import { Teleconsulta } from "./screens/Teleconsulta/Teleconsulta";
import { TesteVideochamada } from "./screens/Teleconsulta/TesteVideochamada";
import TrabalheConosco from "./screens/TrabalheConosco/TrabalheConosco";
import { TriagemOnline } from "./screens/TriagemOnline/TriagemOnline";
import ProductDetails from "./screens/Farmacia/ProductDetails";
import PharmacyDetails from "./screens/Farmacia/PharmacyDetails";
import Terms from "./screens/TelaInicial/Terms";
import Privacy from "./screens/TelaInicial/Privacy";
import Cookies from "./screens/TelaInicial/Cookies";
import PacienteDashboard from "./screens/Paciente/PacienteDashboard";
import ConsultasDashboard from "./screens/Consultas/ConsultasDashboard";
import AgendamentoIntro from "./screens/Agendamento/AgendamentoIntro";
import SobreNos from "./screens/TelaInicial/sections/SobreNos/SobreNos";
import Login from "./screens/Auth/Login";
import CadastroPaciente from "./screens/Auth/CadastroPaciente";
import CadastroSucesso from "./screens/Auth/CadastroSucesso";
import EsqueciSenha from "./screens/Auth/EsqueciSenha";
import { Resultados } from "./screens/Resultados/Resultados";
import { Checkout } from "./screens/Checkout/Checkout";
import { CheckoutSucesso } from "./screens/Checkout/CheckoutSucesso";
import DicasArtigos from './screens/DicasArtigos/DicasArtigos';
import ArtigoDetalhado from "./screens/DicasArtigos/ArtigoDetalhado";
import Historia from "./screens/TelaInicial/sections/SobreNos/Historia";
import MissaoValores from "./screens/TelaInicial/sections/SobreNos/MissaoValores";
import Equipe from "./screens/TelaInicial/sections/SobreNos/Equipe";
import Impacto from "./screens/TelaInicial/sections/SobreNos/Impacto";
import Premios from "./screens/TelaInicial/sections/SobreNos/Premios";

export const App = () => {
  return (
    <AuthInitializer>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<CadastroPaciente />} />
        <Route path="/sobre" element={<SobreNos />} />
        <Route path="/historia" element={<Historia />} />
        <Route path="/missao-valores" element={<MissaoValores />} />
        <Route path="/equipe" element={<Equipe />} />
        <Route path="/impacto" element={<Impacto />} />
        <Route path="/premios" element={<Premios />} />
        <Route path="/trabalhe-conosco" element={<TrabalheConosco />} />
        <Route path="/privacidade" element={<Privacy />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/termos-de-uso" element={<Terms />} />
        <Route path="/EsqueciSenha" element={<EsqueciSenha />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/cadastro-sucesso" element={<CadastroSucesso />} />
        
        {/* Rotas de Checkout */}
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/checkout-sucesso" element={<ProtectedRoute><CheckoutSucesso /></ProtectedRoute>} />
        
        {/* Rotas da Farmácia - Sempre acessíveis */}
        <Route path="/farmacia" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Farmacia />} />
        </Route>
        <Route path="/farmacia/produto/:id" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<ProductDetails />} />
        </Route>
        <Route path="/farmacia/parceira/:id" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<PharmacyDetails />} />
        </Route>
        <Route path="/cart" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Cart />} />
        </Route>
        <Route path="/carrinho" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Cart />} />
        </Route>

        {/* Rotas que requerem plano */}
        <Route path="/agendamento" element={
          <ProtectedRoute>
            <PlanRequiredRoute featureName="Agendamento de Consultas">
              <Layout />
            </PlanRequiredRoute>
          </ProtectedRoute>
        }>
          <Route index element={<AgendamentoIntro />} />
        </Route>
        <Route path="/agendamento/iniciar" element={
          <ProtectedRoute>
            <PlanRequiredRoute featureName="Agendamento de Consultas">
              <Layout />
            </PlanRequiredRoute>
          </ProtectedRoute>
        }>
          <Route index element={<Agendamento />} />
        </Route>

        <Route path="/triagem-online" element={
          <ProtectedRoute>
            <PlanRequiredRoute featureName="Triagem Online">
              <TriagemOnline />
            </PlanRequiredRoute>
          </ProtectedRoute>
        } />

        <Route path="/paciente" element={
          <ProtectedRoute>
            <PlanRequiredRoute featureName="Área do Paciente">
              <Layout />
            </PlanRequiredRoute>
          </ProtectedRoute>
        }>
          <Route index element={<PacienteDashboard />} />
        </Route>

        <Route path="/teleconsulta" element={
          <ProtectedRoute>
            <PlanRequiredRoute featureName="Teleconsulta">
              <Layout />
            </PlanRequiredRoute>
          </ProtectedRoute>
        }>
          <Route index element={<Teleconsulta />} />
        </Route>

        <Route path="/teste-videochamada" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<TesteVideochamada />} />
        </Route>

        <Route path="/prescricoes" element={
          <ProtectedRoute>
            <PlanRequiredRoute featureName="Prescrições Médicas">
              <Layout />
            </PlanRequiredRoute>
          </ProtectedRoute>
        }>
          <Route index element={<Prescricoes />} />
        </Route>

        <Route path="/consultas" element={
          <ProtectedRoute>
            <PlanRequiredRoute featureName="Área de Consultas">
              <Layout />
            </PlanRequiredRoute>
          </ProtectedRoute>
        }>
          <Route index element={<ConsultasDashboard />} />
        </Route>

        <Route path="/consultas-anteriores" element={
          <ProtectedRoute>
            <PlanRequiredRoute featureName="Histórico de Consultas">
              <Layout />
            </PlanRequiredRoute>
          </ProtectedRoute>
        }>
          <Route index element={<ConsultasAnteriores />} />
        </Route>

        {/* Rota de histórico - redireciona para consultas anteriores */}
        <Route path="/historico" element={<Navigate to="/consultas-anteriores" replace />} />

        {/* Rotas de perfil e ajuda - Sempre acessíveis */}
        <Route path="/meu-perfil" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<MeuPerfil />} />
        </Route>

        <Route path="/central-ajuda" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<CentralAjuda />} />
        </Route>

        <Route path="/dicas-artigos" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<DicasArtigos />} />
        </Route>

        <Route path="/artigo/:id" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<ArtigoDetalhado />} />
        </Route>

        <Route path="/resultados" element={
          <ProtectedRoute>
            <PlanRequiredRoute featureName="Resultados de Exames">
              <Layout />
            </PlanRequiredRoute>
          </ProtectedRoute>
        }>
          <Route index element={<Resultados />} />
        </Route>
        
        {/* Rotas do home com proteções */}
        <Route path="/home" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<TelaInicial />} />
          <Route path="farmacia" element={<Farmacia />} />
          <Route path="agendamento" element={
            <PlanRequiredRoute featureName="Agendamento de Consultas">
              <AgendamentoIntro />
            </PlanRequiredRoute>
          } />
          <Route path="agendamento/iniciar" element={
            <PlanRequiredRoute featureName="Agendamento de Consultas">
              <Agendamento />
            </PlanRequiredRoute>
          } />
          <Route path="teleconsulta" element={
            <PlanRequiredRoute featureName="Teleconsulta">
              <Teleconsulta />
            </PlanRequiredRoute>
          } />
          <Route path="prescricoes" element={
            <PlanRequiredRoute featureName="Prescrições Médicas">
              <Prescricoes />
            </PlanRequiredRoute>
          } />
          <Route path="triagem-online" element={
            <PlanRequiredRoute featureName="Triagem Online">
              <TriagemOnline />
            </PlanRequiredRoute>
          } />
          <Route path="pagamentos" element={<Pagamentos />} />
          <Route path="trabalhe-conosco" element={<TrabalheConosco />} />
          <Route path="portal-profissional" element={<PortalProfissional />} />
          <Route path="meu-perfil" element={<MeuPerfil />} />
          <Route path="emergencia" element={<Emergencia />} />
          <Route path="central-ajuda" element={<CentralAjuda />} />
          <Route path="consultas-anteriores" element={
            <PlanRequiredRoute featureName="Histórico de Consultas">
              <ConsultasAnteriores />
            </PlanRequiredRoute>
          } />
          <Route path="termos-de-uso" element={<Terms />} />
          <Route path="privacidade" element={<Privacy />} />
          <Route path="cookies" element={<Cookies />} />
          <Route path="paciente" element={
            <PlanRequiredRoute featureName="Área do Paciente">
              <PacienteDashboard />
            </PlanRequiredRoute>
          } />
          <Route path="consultas" element={
            <PlanRequiredRoute featureName="Área de Consultas">
              <ConsultasDashboard />
            </PlanRequiredRoute>
          } />
          <Route path="resultados" element={
            <PlanRequiredRoute featureName="Resultados de Exames">
              <Resultados />
            </PlanRequiredRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
    </AuthInitializer>
  );
};