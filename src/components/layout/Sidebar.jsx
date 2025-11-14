import React from 'react';
import { MapPin, Home, Users, Settings, Wifi, Building, Calendar, BarChart3, Shield } from 'lucide-react';

const menuItems = [
  {
    id: 'transferencia-endereco',
    label: 'Transferência de Endereço',
    icon: MapPin,
    description: 'Agendamento para mudança de endereço',
    active: true
  },
  {
    id: 'mudanca-ponto',
    label: 'Mudança de Ponto',
    icon: Home,
    description: 'Alteração de ponto interno',
    active: true
  },
  {
    id: 'visita-tecnica',
    label: 'Visita Técnica',
    icon: Users,
    description: 'Agendamento geral de visita',
    active: false
  },
  {
    id: 'outros',
    label: 'Outros Serviços',
    icon: Settings,
    description: 'Demais tipos de agendamento',
    active: false
  },
  /* {
    id: 'agenda',
    label: 'Agenda Completa',
    icon: Calendar,
    description: 'Visualizar todos os agendamentos',
    active: false
  },
  {
    id: 'relatorios',
    label: 'Relatórios',
    icon: BarChart3,
    description: 'Relatórios e métricas do sistema',
    active: false
  } */
];

export default function Sidebar({ activeModule, setActiveModule }) {
  return (
    <div className="w-[20%] bg-gradient-to-b from-gray-800 to-gray-900 shadow-2xl border-r border-blue-700/30 flex flex-col">
      {/* Header do Sidebar */}
      <div className="p-6 border-b border-blue-700/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <Wifi className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">NMultiFibra</h2>
            <p className="text-blue-200 text-sm">Painel Corporativo</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="text-xs text-blue-300/60 uppercase font-semibold tracking-wider">
            Módulos do Sistema
          </div>
        </div>
      </div>

      {/* Menu de Navegação */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => item.active && setActiveModule(item.id)}
              disabled={!item.active}
              className={`w-full text-left p-4 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-500/25 border border-blue-500/30'
                  : item.active
                  ? 'bg-gray-700/50 hover:bg-gray-700/80 border border-transparent hover:border-blue-500/20'
                  : 'bg-gray-800/30 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-white/20' 
                    : item.active
                    ? 'bg-gray-600/50 group-hover:bg-blue-500/20'
                    : 'bg-gray-700/30'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    isActive 
                      ? 'text-white' 
                      : item.active
                      ? 'text-gray-300 group-hover:text-white'
                      : 'text-gray-500'
                  }`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className={`font-semibold transition-colors text-left ${
                    isActive 
                      ? 'text-white' 
                      : item.active
                      ? 'text-gray-200 group-hover:text-white'
                      : 'text-gray-500'
                  }`}>
                    {item.label}
                  </div>
                  <div className={`text-sm transition-colors text-left ${
                    isActive 
                      ? 'text-blue-100' 
                      : item.active
                      ? 'text-gray-400 group-hover:text-blue-200'
                      : 'text-gray-500'
                  }`}>
                    {item.description}
                  </div>
                </div>

                {/* Indicadores */}
                <div className="flex items-center gap-2">
                  {isActive && (
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                  
                  {!item.active && (
                    <span className="text-xs bg-gray-700 text-gray-400 px-2 py-1 rounded border border-gray-600">
                      Em breve
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer do Sidebar */}
      {/* <div className="p-4 border-t border-blue-700/30"> */}
        {/* <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/30">
          <div className="text-xs text-gray-300 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Shield className="w-3 h-3 text-green-400" />
              <span className="font-semibold text-blue-300">Sistema Protegido</span>
            </div>
            <div className="flex items-center justify-center gap-1 text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Todos os sistemas operacionais
            </div>
          </div>
        </div> */}

        {/* Versão e Status */}
        {/* <div className="mt-3 text-center">
          <div className="text-xs text-gray-400">
            v2.0 • {new Date().getFullYear()}
          </div>
        </div> */}
      {/* </div> */}
    </div>
  );
}