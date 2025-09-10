import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { consultaService } from '../../services/consultation/consultaService';
import { useAuth } from '../../hooks/auth/useAuth';
import { AlertCircleIcon, CheckCircleIcon, LoaderIcon } from 'lucide-react';

export const TesteVideochamada = () => {
  const { user } = useAuth();
  const [roomId, setRoomId] = useState('');
  const [consultaId, setConsultaId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [salaInfo, setSalaInfo] = useState<any>(null);

  const handleCriarSala = async () => {
    if (!consultaId) {
      setError('Digite o ID da consulta');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const sala = await consultaService.criarSalaVideochamada(parseInt(consultaId));
      setRoomId(sala.roomId);
      setSalaInfo(sala);
      setSuccess(`Sala criada com sucesso! Room ID: ${sala.roomId}`);
    } catch (err) {
      console.error('Erro ao criar sala:', err);
      setError(err instanceof Error ? err.message : 'Erro ao criar sala');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEntrarSala = async () => {
    if (!roomId) {
      setError('Digite o Room ID');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const info = await consultaService.entrarSalaVideochamada(roomId);
      setSalaInfo(info);
      setSuccess(`Entrou na sala com sucesso! É host: ${info.isHost}`);
    } catch (err) {
      console.error('Erro ao entrar na sala:', err);
      setError(err instanceof Error ? err.message : 'Erro ao entrar na sala');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetInfoSala = async () => {
    if (!roomId) {
      setError('Digite o Room ID');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const info = await consultaService.getInfoSala(roomId);
      setSalaInfo(info);
      setSuccess('Informações da sala obtidas com sucesso!');
    } catch (err) {
      console.error('Erro ao obter informações da sala:', err);
      setError(err instanceof Error ? err.message : 'Erro ao obter informações da sala');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSairSala = async () => {
    if (!roomId) {
      setError('Digite o Room ID');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await consultaService.sairSalaVideochamada(roomId);
      setSuccess('Saiu da sala com sucesso!');
      setSalaInfo(null);
    } catch (err) {
      console.error('Erro ao sair da sala:', err);
      setError(err instanceof Error ? err.message : 'Erro ao sair da sala');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Teste de Videochamada</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controles */}
        <Card>
          <CardHeader>
            <CardTitle>Controles de Teste</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID da Consulta
              </label>
              <Input
                type="number"
                value={consultaId}
                onChange={(e) => setConsultaId(e.target.value)}
                placeholder="Digite o ID da consulta"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room ID
              </label>
              <Input
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Digite o Room ID"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleCriarSala}
                disabled={isLoading || !consultaId}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  'Criar Sala'
                )}
              </Button>

              <Button
                onClick={handleEntrarSala}
                disabled={isLoading || !roomId}
                className="flex-1"
                variant="outline"
              >
                {isLoading ? (
                  <>
                    <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar na Sala'
                )}
              </Button>

              <Button
                onClick={handleGetInfoSala}
                disabled={isLoading || !roomId}
                className="flex-1"
                variant="outline"
              >
                {isLoading ? (
                  <>
                    <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  'Info da Sala'
                )}
              </Button>

              <Button
                onClick={handleSairSala}
                disabled={isLoading || !roomId}
                className="flex-1"
                variant="destructive"
              >
                {isLoading ? (
                  <>
                    <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                    Saindo...
                  </>
                ) : (
                  'Sair da Sala'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertCircleIcon className="w-5 h-5 text-red-600" />
                  <span className="text-red-800">{error}</span>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  <span className="text-green-800">{success}</span>
                </div>
              </div>
            )}

            {salaInfo && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Informações da Sala</h3>
                <pre className="text-sm text-blue-700 overflow-auto">
                  {JSON.stringify(salaInfo, null, 2)}
                </pre>
              </div>
            )}

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Informações do Usuário</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p><strong>ID:</strong> {user?.id}</p>
                <p><strong>Nome:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Tipo:</strong> {user?.plan ? 'Paciente com plano' : 'Paciente sem plano'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 