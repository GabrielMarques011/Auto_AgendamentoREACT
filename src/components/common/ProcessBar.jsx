// src/components/ProgressBar.jsx
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function ProgressBar({ step }) {
  const steps = [1, 2, 3, 4, 5, 6];
  const stepLabels = ['Cliente', 'Novo Endereço', 'Antigo Endereço', 'Valor', 'Agendamento', 'Revisão'];

  return (
    <div className="w-full">
      {/* Barra de Progresso Principal */}
      <div className="flex items-center justify-center relative w-[80%] mx-auto">
        {/* Linha de fundo */}
        <div className="absolute top-1/2 left-0 right-0 h-0.2 bg-gray-200 -translate-y-1/2 z-0"></div>
        
        {/* Linha ativa */}
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-10 transition-all duration-500 ease-in-out"
          style={{ 
            width: `${((step - 1) / (steps.length - 1)) * 100}%` 
          }}
        ></div>

        {steps.map((num, idx) => (
          <React.Fragment key={num}>
            {/* Ponto do progresso */}
            <div className="flex flex-col items-center relative z-20">
              <div
                className={`
                  flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300
                  ${step === num 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                    : step > num 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                  }
                `}
              >
                {step > num ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <span className={`text-sm font-medium ${step === num ? 'text-white' : 'text-gray-500'}`}>
                    {num}
                  </span>
                )}
              </div>
              
              {/* Label da etapa */}
              <div className={`
                mt-2 text-xs font-medium transition-all duration-300 whitespace-nowrap
                ${step === num 
                  ? 'text-blue-600 font-semibold' 
                  : step > num 
                  ? 'text-green-600' 
                  : 'text-gray-500'
                }
              `}>
                {stepLabels[num - 1]}
              </div>
            </div>

            {/* Linha conectora */}
            {idx < 5 && (
              <div
                className={`
                  flex-1 h-0.5 transition-all duration-500
                  ${step > num ? 'bg-green-500' : 'bg-gray-200'}
                `}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Indicador de Progresso Atual */}
      <div className="mt-6 flex justify-center">
        {/* <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-700">
              Etapa {step} de {steps.length}
            </span>
          </div>
          <div className="w-px h-4 bg-blue-200"></div>
          <span className="text-sm text-blue-600">
            {stepLabels[step - 1]}
          </span>
        </div> */}
      </div>
    </div>
  );
}