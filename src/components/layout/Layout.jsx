// src/components/Layout.jsx
import React from 'react';
import Sidebar from './Sidebar';
import { Wifi, LogOut, User, Shield } from 'lucide-react';

export default function Layout({ 
  children, 
  activeModule, 
  setActiveModule,
  user,
  onLogout 
}) {
  return (
    <div className="flex bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 min-h-screen">
      {/* Sidebar */}
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      
      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header Corporativo */}
        <header className="bg-gradient-to-r from-gray-800 to-blue-900 shadow-2xl border-b border-blue-700/30 flex-shrink-0">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {getModuleTitle(activeModule)}
                </h1>
                <p className="text-blue-200 font-medium">
                  {getModuleDescription(activeModule)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full shadow-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <div className="font-semibold text-white">{user?.nome || 'Usuário'}</div>
                  <div className="text-sm text-blue-200 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Técnico ID: {user?.id_tecnico || 'N/A'}
                  </div>
                </div>
              </div>
              
              <button 
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-600/90 text-white rounded-xl hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-red-500/25 hover:scale-105 border border-red-500/30"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>

          {/* Barra de progresso sutil */}
          <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-400 opacity-50"></div>
        </header>

        {/* Área de Conteúdo*/}
        <main className="flex-1 min-h-0 overflow-auto">
          {/* Container do conteúdo*/}
          <div className="h-full p-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 h-full w-full p-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Funções auxiliares para títulos e descrições
function getModuleTitle(module) {
  const titles = {
    'transferencia-endereco': 'Transferência de Endereço',
    'mudanca-ponto': 'Mudança de Ponto',
    'visita-tecnica': 'Visita Técnica',
    'outros': 'Outros Serviços'
  };
  return titles[module] || 'Sistema de Agendamentos';
}

function getModuleDescription(module) {
  const descriptions = {
    'transferencia-endereco': 'Agendamento para transferência de endereço do cliente',
    'mudanca-ponto': 'Agendamento para mudança de ponto interno',
    'visita-tecnica': 'Agendamento de visita técnica geral',
    'outros': 'Outros tipos de agendamento e serviços'
  };
  return descriptions[module] || 'Selecione um módulo para começar';
}