import React from "react";
import { CalendarDays } from "lucide-react";

export default function Screen5({ formData, setFormData, nextStep, prevStep }) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Informe Data e Período</h2>
        <p className="text-gray-600">Selecione a data e o período para agendamento do serviço</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Data do Agendamento</label>
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <input
              type="date"
              value={formData.scheduledDate || ""}
              onChange={e => setFormData({ ...formData, scheduledDate: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700 bg-white"
            />
          </div>
          <small className="block mt-1.5 text-sm text-gray-500">Escolha a data desejada para a visita técnica</small>
        </div>

        <div>
          <div className="mb-4">
            <span className="text-sm font-medium text-gray-700">Período:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {["comercial", "manha", "tarde"].map(period => (
              <button
                key={period}
                type="button"
                onClick={() => setFormData({ ...formData, period })}
                className={`px-6 py-4 rounded-lg font-medium transition-all ${
                  formData.period === period
                    ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-600 ring-offset-2'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
          <small className="block mt-2 text-sm text-gray-500">
            Comercial: 8h às 17h | Manhã: 8h às 12h | Tarde: 13h às 17h
          </small>
        </div>

        {formData.scheduledDate && formData.period && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CalendarDays className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">Agendamento confirmado</p>
                <p className="text-sm text-green-700 mt-1">
                  Data: {new Date(formData.scheduledDate + 'T00:00:00').toLocaleDateString('pt-BR')} - 
                  Período: {formData.period.charAt(0).toUpperCase() + formData.period.slice(1)}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4">
          <button 
            onClick={prevStep}
            className="px-8 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors shadow-sm hover:shadow-md"
          >
            ← Voltar
          </button>
          <button 
            onClick={nextStep}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
          >
            Próximo →
          </button>
        </div>
      </div>
    </div>
  );
}