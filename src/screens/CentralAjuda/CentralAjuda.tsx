import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { SearchIcon, MessageCircleIcon, BookOpenIcon, PhoneIcon, XIcon, SendIcon, PlusIcon } from 'lucide-react';
import { ScrollArea } from '../../components/ui/scroll-area';
import { suporteService, Artigo, Categoria, Ticket, Mensagem } from '../../services/support/suporteService';
import { useChatWebSocket } from '../../hooks/communication/useWebSocket';
import { useAuthStore } from '../../store/auth';

export const CentralAjuda = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Artigo | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [artigos, setArtigos] = useState<Artigo[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newTicketData, setNewTicketData] = useState({
    titulo: '',
    descricao: '',
    categoria_id: 1,
    prioridade: 'normal' as const
  });
  const [showTicketResolvedModal, setShowTicketResolvedModal] = useState(false);
  const [resolvedTicketInfo, setResolvedTicketInfo] = useState<any>(null);

  const { user } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // WebSocket para chat
  const { 
    mensagens: mensagensWebSocket,
    enviarMensagem, 
    usuarioDigitando, 
    isConnected 
  } = useChatWebSocket(selectedTicket?.id);

  // Carregar dados iniciais
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [artigosData, categoriasData, ticketsData] = await Promise.all([
        suporteService.listarArtigos(),
        suporteService.listarCategorias(),
        suporteService.listarTickets()
      ]);
      
      setArtigos(artigosData);
      setCategorias(categoriasData);
      setTickets(ticketsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar mensagens quando selecionar ticket
  useEffect(() => {
    if (selectedTicket && !isConnected) {
      // Só carregar via API se o WebSocket não estiver conectado
      carregarMensagens();
    }
  }, [selectedTicket, isConnected]);

  // Atualizar mensagens quando chegarem via WebSocket
  useEffect(() => {
    if (mensagensWebSocket.length > 0) {
      console.log(`📨 Recebidas ${mensagensWebSocket.length} mensagens via WebSocket`);
      // Usar as mensagens do WebSocket que já incluem as iniciais + novas
      setMensagens(mensagensWebSocket);
      scrollToBottom();
      
      // Verificar se há uma mensagem de ticket resolvido
      const ticketResolvedMessage = mensagensWebSocket.find(msg => 
        msg.comentario?.includes('🎉 **TICKET RESOLVIDO**')
      );
      
      if (ticketResolvedMessage && !showTicketResolvedModal) {
        setResolvedTicketInfo({
          ticketId: selectedTicket?.id,
          titulo: selectedTicket?.titulo,
          resolvedAt: new Date().toLocaleString('pt-BR')
        });
        setShowTicketResolvedModal(true);
      }
    }
  }, [mensagensWebSocket, selectedTicket, showTicketResolvedModal]);

  const carregarMensagens = async () => {
    if (!selectedTicket) return;
    
    try {
      console.log(`📥 Carregando mensagens iniciais do ticket ${selectedTicket.id}`);
      const mensagensData = await suporteService.listarMensagens(selectedTicket.id);
      console.log(`📥 ${mensagensData.length} mensagens carregadas via API`);
      setMensagens(mensagensData);
      scrollToBottom();
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  // Scroll para baixo quando novas mensagens chegarem
  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  // Limpar timeout quando componente for desmontado
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filtrar artigos por pesquisa
  const artigosFiltrados = artigos.filter(artigo => {
    const matchesSearch = artigo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artigo.conteudo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || artigo.categoria_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Enviar mensagem
  const handleEnviarMensagem = async () => {
    if (!novaMensagem.trim() || !selectedTicket) return;

    try {
      console.log(`📤 Enviando mensagem: "${novaMensagem}" para ticket ${selectedTicket.id}`);
      
      // Limpar timeout de digitação se existir
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      
      // Parar de digitar
      usuarioDigitando(false);
      
      // Enviar via WebSocket para tempo real
      enviarMensagem(novaMensagem);
      
      // Limpar input imediatamente para melhor UX
      setNovaMensagem('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  // Criar novo ticket
  const handleCriarTicket = async () => {
    try {
      const ticket = await suporteService.criarTicket(newTicketData);
      setTickets(prev => [ticket, ...prev]);
      setSelectedTicket(ticket);
      setShowNewTicket(false);
      setNewTicketData({
        titulo: '',
        descricao: '',
        categoria_id: 1,
        prioridade: 'normal'
      });
    } catch (error) {
      console.error('Erro ao criar ticket:', error);
    }
  };

  // Detectar digitação
  const handleInputChange = (value: string) => {
    setNovaMensagem(value);
    
    // Limpar timeout anterior se existir
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    if (value.length > 0) {
      // Notificar que está digitando
      usuarioDigitando(true);
      
      // Parar de digitar após 2 segundos de inatividade
      typingTimeoutRef.current = setTimeout(() => {
        usuarioDigitando(false);
      }, 2000);
    } else {
      // Parar de digitar se o campo estiver vazio
      usuarioDigitando(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aberto': return 'bg-blue-100 text-blue-800';
      case 'em_andamento': return 'bg-yellow-100 text-yellow-800';
      case 'resolvido': return 'bg-green-100 text-green-800';
      case 'fechado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'baixa': return 'bg-green-100 text-green-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'alta': return 'bg-orange-100 text-orange-800';
      case 'urgente': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Categories */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Categorias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button
                variant={selectedCategory === null ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedCategory(null)}
              >
                <BookOpenIcon className="w-4 h-4" />
                <span className="ml-2">Todas</span>
              </Button>
              {categorias.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <BookOpenIcon className="w-4 h-4" />
                  <span className="ml-2">{category.nome}</span>
                  <span className="ml-auto text-xs bg-gray-200 px-2 py-1 rounded-full">
                    {category.total_artigos}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content - Articles */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Central de Ajuda</CardTitle>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Pesquisar artigos..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">Carregando...</div>
                ) : artigosFiltrados.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum artigo encontrado
                  </div>
                ) : (
                  artigosFiltrados.map((article) => (
                    <Card
                      key={article.id}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setSelectedArticle(article)}
                    >
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{article.titulo}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{article.conteudo}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {article.categoria_nome}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(article.data_criacao).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Support */}
        {showChat ? (
          <div className="fixed bottom-4 right-4 w-96 max-h-[70vh] bg-white rounded-lg shadow-xl border flex flex-col">
            <div className="p-4 border-b bg-blue-600 text-white rounded-t-lg">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Suporte Vitalis</h3>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowChat(false)}
                    className="text-white hover:bg-blue-700"
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Lista de Tickets */}
            {!selectedTicket ? (
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Meus Tickets</h4>
                  <Button
                    size="sm"
                    onClick={() => setShowNewTicket(true)}
                    className="flex items-center gap-1"
                  >
                    <PlusIcon className="w-3 h-3" />
                    Novo
                  </Button>
                </div>
                
                {tickets.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum ticket encontrado
                  </div>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {tickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        <div className="flex justify-between items-start">
                          <h5 className="font-medium text-sm">{ticket.titulo}</h5>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(ticket.status)}`}>
                            {ticket.status === 'aberto' ? '🔄 Aberto' :
                             ticket.status === 'em_andamento' ? '⏳ Em Andamento' :
                             ticket.status === 'resolvido' ? '✅ Resolvido' :
                             ticket.status === 'fechado' ? '🔒 Fechado' : ticket.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{ticket.descricao}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getPrioridadeColor(ticket.prioridade)}`}>
                            {ticket.prioridade}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(ticket.data_criacao).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Header do Chat */}
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{selectedTicket.titulo}</h4>
                      <p className="text-sm text-gray-600">{selectedTicket.categoria_nome}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTicket(null)}
                    >
                      <XIcon className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Indicador de Status do Ticket */}
                  <div className="mt-3">
                    {selectedTicket.status === 'resolvido' ? (
                      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-green-800">✅ Ticket Resolvido</span>
                        <span className="text-xs text-green-600">
                          {selectedTicket.data_fechamento ? 
                            new Date(selectedTicket.data_fechamento).toLocaleString('pt-BR') : 
                            'Resolvido recentemente'
                          }
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium text-blue-800">🔄 Ticket em Andamento</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mensagens */}
                <ScrollArea className="flex-1 p-4 min-h-0">
                  <div className="space-y-3">
                    {mensagens.map((mensagem) => {
                      // Verificar se é uma mensagem do sistema (ticket resolvido)
                      const isSystemMessage = mensagem.comentario?.includes('🎉 **TICKET RESOLVIDO**');
                      
                      // Se for mensagem do sistema, renderizar de forma especial
                      if (isSystemMessage) {
                        return (
                          <div key={mensagem.id} className="flex justify-center mb-4">
                            <div className="max-w-[85%] bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl px-6 py-4 shadow-lg">
                              <div className="text-center">
                                <div className="text-2xl mb-2">🎉</div>
                                <div className="text-sm font-semibold text-green-800 mb-2">
                                  TICKET RESOLVIDO
                                </div>
                                <div className="text-xs text-green-600 leading-relaxed whitespace-pre-line">
                                  {mensagem.comentario}
                                </div>
                                <div className="text-xs text-green-500 mt-3">
                                  {new Date(mensagem.criado_em).toLocaleString('pt-BR', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      
                      return (
                        <div
                          key={mensagem.id}
                          className={`flex ${mensagem.usuario_id === (user?.id || 0) ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs p-3 rounded-lg ${
                              mensagem.usuario_id === (user?.id || 0)
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{mensagem.comentario}</p>
                            <p className="text-xs mt-1 opacity-70">
                              {new Date(mensagem.criado_em).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Input de mensagem */}
                <div className="p-4 border-t">
                  {!isConnected && (
                    <div className="text-yellow-600 text-sm mb-2">
                      Reconectando ao chat, aguarde...
                    </div>
                  )}
                  
                  {/* Aviso de ticket resolvido */}
                  {selectedTicket.status === 'resolvido' && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="text-green-600">✅</div>
                        <span className="text-sm font-medium text-green-800">
                          Este ticket foi resolvido. Não é possível enviar novas mensagens.
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      placeholder={
                        selectedTicket.status === 'resolvido' 
                          ? "Ticket resolvido - não é possível enviar mensagens" 
                          : "Digite sua mensagem..."
                      }
                      value={novaMensagem}
                      onChange={(e) => {
                        if (selectedTicket.status === 'resolvido') return; // Bloquear edição
                        handleInputChange(e.target.value);
                      }}
                      onKeyPress={(e) => {
                        if (selectedTicket.status === 'resolvido') return; // Bloquear envio
                        if (e.key === 'Enter') {
                          handleEnviarMensagem();
                        }
                      }}
                      disabled={!isConnected || selectedTicket.status === 'resolvido'}
                      className={selectedTicket.status === 'resolvido' ? 'bg-gray-100 cursor-not-allowed' : ''}
                    />
                    <Button 
                      onClick={() => {
                        if (selectedTicket.status === 'resolvido') return; // Bloquear envio
                        handleEnviarMensagem();
                      }} 
                      disabled={!isConnected || !novaMensagem.trim() || selectedTicket.status === 'resolvido'}
                      className={selectedTicket.status === 'resolvido' ? 'bg-gray-400 cursor-not-allowed' : ''}
                    >
                      <SendIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <Button
            className="fixed bottom-4 right-4"
            onClick={() => setShowChat(true)}
          >
            <MessageCircleIcon className="w-4 h-4 mr-2" />
            Suporte Online
          </Button>
        )}

        {/* Modal de Novo Ticket */}
        {showNewTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Novo Ticket de Suporte</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Título</label>
                  <Input
                    value={newTicketData.titulo}
                    onChange={(e) => setNewTicketData(prev => ({ ...prev, titulo: e.target.value }))}
                    placeholder="Descreva brevemente o problema"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Descrição</label>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    value={newTicketData.descricao}
                    onChange={(e) => setNewTicketData(prev => ({ ...prev, descricao: e.target.value }))}
                    placeholder="Descreva detalhadamente o problema"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Categoria</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={newTicketData.categoria_id}
                    onChange={(e) => setNewTicketData(prev => ({ ...prev, categoria_id: parseInt(e.target.value) }))}
                  >
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.nome}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Prioridade</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={newTicketData.prioridade}
                    onChange={(e) => setNewTicketData(prev => ({ ...prev, prioridade: e.target.value as any }))}
                  >
                    <option value="baixa">Baixa</option>
                    <option value="normal">Normal</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowNewTicket(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCriarTicket}
                  disabled={!newTicketData.titulo || !newTicketData.descricao}
                  className="flex-1"
                >
                  Criar Ticket
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Artigo */}
        {selectedArticle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{selectedArticle.titulo}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedArticle(null)}
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap">{selectedArticle.conteudo}</div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Categoria: {selectedArticle.categoria_nome}</span>
                  <span>•</span>
                  <span>Autor: {selectedArticle.autor_nome}</span>
                  <span>•</span>
                  <span>{new Date(selectedArticle.data_criacao).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Ticket Resolvido */}
        {showTicketResolvedModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <div className="text-3xl">🎉</div>
                </div>
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  Ticket Resolvido!
                </h3>
                <div className="text-gray-600 mb-6 space-y-2">
                  <p><strong>Ticket:</strong> {resolvedTicketInfo?.titulo}</p>
                  <p><strong>Data/Hora:</strong> {resolvedTicketInfo?.resolvedAt}</p>
                  <p className="text-sm text-gray-500 mt-3">
                    Seu problema foi resolvido com sucesso! 
                    Se precisar de mais ajuda, pode criar um novo ticket.
                  </p>
                </div>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => {
                      setShowTicketResolvedModal(false);
                      setSelectedTicket(null);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Fechar Chat
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowTicketResolvedModal(false)}
                  >
                    Continuar no Chat
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};