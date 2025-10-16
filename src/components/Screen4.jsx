import React from "react";
import { DollarSign } from "lucide-react";

export default function Screen4({ formData, setFormData, nextStep, prevStep }) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Informe o Valor</h2>
        <p className="text-gray-600">Selecione o tipo de valor e informe o montante quando necessário</p>
      </div>

      <div className="space-y-6">
        <div>
          <div className="mb-4">
            <span className="text-sm font-medium text-gray-700">Tipo de Valor:</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, valueType: "renovacao" })}
              className={`flex-1 px-6 py-4 rounded-lg font-medium transition-all ${
                formData.valueType === "renovacao"
                  ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-600 ring-offset-2'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Renovação de Contrato
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, valueType: "taxa" })}
              className={`flex-1 px-6 py-4 rounded-lg font-medium transition-all ${
                formData.valueType === "taxa"
                  ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-600 ring-offset-2'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Taxa
            </button>
          </div>
        </div>

        {formData.valueType === "taxa" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 animate-fadeIn">
            <label className="block text-sm font-medium text-gray-700 mb-4">Valor da Taxa</label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {["R$150,00", "R$100,00", "R$75,00", "R$50,00"].map((valor) => (
                <button
                  key={valor}
                  type="button"
                  onClick={() => setFormData({ ...formData, taxValue: valor })}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-lg transition-all border
                    ${
                      formData.taxValue === valor
                        ? "bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-600 ring-offset-2"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-blue-100"
                    }`}
                >
                  <DollarSign className="w-5 h-5" />
                  {valor}
                </button>
              ))}
            </div>

            <small className="block mt-3 text-sm text-gray-600 text-center">
              Selecione o valor da taxa a ser cobrada
            </small>
          </div>
        )}

        {!formData.valueType && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-sm text-blue-800">Selecione um tipo de valor para continuar</p>
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

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}