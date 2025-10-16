import React, { useState } from 'react';
import { User, Lock, LogIn } from 'lucide-react';

// Usuários pré-definidos
const USUARIOS_TECNICOS = [
  { id: 367, nome: 'Rodrigo Akira', senha: '367' },
  { id: 359, nome: 'Pedro Santos', senha: '359' },
  { id: 390, nome: 'Pedro Guedes', senha: '390' },
  { id: 381, nome: 'Lucca Ramos', senha: '381' },
  { id: 387, nome: 'Kayky Cabral', senha: '387' },
  { id: 345, nome: 'João Miyake', senha: '345' },
  { id: 313, nome: 'João Gomes', senha: '313' },
  { id: 307, nome: 'Gabriel Rosa', senha: '307' },
  { id: 306, nome: 'Gabriel Marques', senha: '306' },
  { id: 386, nome: 'Gabriel Lima', senha: '386' },
  { id: 377, nome: 'Diego Sousa', senha: '377' },
  { id: 202, nome: 'Cesar Bragança', senha: '202' }
];

export default function LoginScreen({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = () => {
    setErrorMsg('');

    if (!username.trim() || !password.trim()) {
      setErrorMsg('Por favor, preencha usuário e senha.');
      return;
    }

    setLoading(true);

    // Simula um pequeno delay de autenticação
    setTimeout(() => {
      // Busca o usuário pelo nome (case-insensitive)
      const usuario = USUARIOS_TECNICOS.find(
        u => u.nome.toLowerCase() === username.toLowerCase().trim()
      );

      if (!usuario) {
        setErrorMsg('Usuário não encontrado.');
        setLoading(false);
        return;
      }

      // Verifica a senha
      if (usuario.senha !== password.trim()) {
        setErrorMsg('Senha incorreta.');
        setLoading(false);
        return;
      }

      // Login bem-sucedido
      const tecnicoData = {
        id_responsavel_tecnico: usuario.id,
        nome_tecnico: usuario.nome
      };

      // Chama callback de sucesso passando os dados do técnico
      onLoginSuccess(tecnicoData);
      setLoading(false);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Bem-vindo
            </h2>
            <p className="text-gray-600">
              Acesso restrito para técnicos autorizados
            </p>
          </div>

          {/* Campos de Login */}
          <div className="space-y-6">
            {/* Campo Usuário */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuário
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite seu nome"
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua senha"
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                />
              </div>
            </div>

            {/* Mensagem de Erro */}
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 font-medium">{errorMsg}</p>
              </div>
            )}

            {/* Botão Login */}
            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm hover:shadow-md"
            >
              {loading ? (
                'Entrando...'
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Entrar
                </>
              )}
            </button>
          </div>

          {/* Dica */}
          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800 text-center">
              <strong>Dica:</strong> Use seu nome completo como usuário e seu ID como senha
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Sistema de Gestão Técnica v1.0
        </p>
      </div>
    </div>
  );
}

// Exemplo de uso:
// <LoginScreen onLoginSuccess={(tecnicoData) => {
//   console.log('Técnico logado:', tecnicoData);
//   // tecnicoData terá: { id_responsavel_tecnico: 367, nome_tecnico: 'Rodrigo Akira' }
// }} />