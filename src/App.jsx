// src/App.jsx
import React, { useState } from 'react';
import './App.css';
import 'boxicons/css/boxicons.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import LoginScreen from './components/common/LoginScreen';
import Layout from './components/layout/Layout';
import TransferenciaEndereco from './components/agendamentos/transferencia-endereco/TransferenciaEndereco';

function App() {
  const [user, setUser] = useState(null);
  const [activeModule, setActiveModule] = useState('transferencia-endereco');
  const [resetKey, setResetKey] = useState(0); // Chave para forçar reset do formulário

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setResetKey(0); // Resetar a chave ao fazer logout
  };

  // Função para resetar o formulário de transferência
  const handleResetTransferencia = () => {
    setResetKey(prev => prev + 1); // Altera a chave para forçar remontagem do componente
  };

  // Renderizar o módulo ativo
  const renderActiveModule = () => {
    switch (activeModule) {
      case 'transferencia-endereco':
        return (
          <TransferenciaEndereco 
            key={resetKey} // Usa a chave para forçar reset quando mudar
            user={user} 
            onReset={handleResetTransferencia}
          />
        );
      
      // Para outros módulos (em desenvolvimento)
      case 'mudanca-ponto':
      case 'instalacao-nova':
      case 'visita-tecnica':
      case 'transferencia-equipamento':
      case 'manutencao':
      default:
        return (
          <div className="w-full h-full flex items-center justify-center p-8">
            <div className="max-w-2xl w-full text-center">
              <div className="bg-blue-100 w-24 h-24 rounded-full flex items-center justify-center mb-8 mx-auto">
                <div className="text-3xl">🚧</div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Módulo em Desenvolvimento
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Esta funcionalidade estará disponível em breve. 
                Estamos trabalhando para trazer mais opções de agendamento.
              </p>
              <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200 max-w-md mx-auto">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <p className="text-yellow-800 font-medium text-center">
                    No momento, utilize o módulo <strong>Transferência de Endereço</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <Layout 
      activeModule={activeModule} 
      setActiveModule={setActiveModule}
      user={user}
      onLogout={handleLogout}
    >
      {renderActiveModule()}
    </Layout>
  );
}

export default App;