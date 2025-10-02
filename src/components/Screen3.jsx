import React, { useRef, useEffect } from "react";
import IMask from "imask";
import { House, MapPin, ArrowUp10, MapPinned, EthernetPort, Search } from "lucide-react";

export default function Screen3({ formData, setFormData, nextStep, prevStep }) {
  const oldCepRef = useRef();

  useEffect(() => {
    if (oldCepRef.current) {
      IMask(oldCepRef.current, { mask: "00000-000" });
    }
  }, []);

  const buscarCepAntigo = async () => {
    const cep = (formData.oldCep || "").replace(/\D/g, "");
    if (cep.length !== 8) {
      alert("Digite um CEP válido.");
      return;
    }
    try {
      /* const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`); */
      const res = await fetch(`https://cep.awesomeapi.com.br/json/${cep}`);
      const dados = await res.json();
      if (dados.erro) {
        alert("CEP não encontrado.");
        return;
      }
      setFormData(prev => ({
        ...prev,
        oldAddress: dados.address	 || "",
        oldNeighborhood: dados.district	 || "",
        oldCity: dados.city || ""
      }));
    } catch (err) {
      console.error(err);
      alert("Erro ao buscar CEP.");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Informe o Endereço Antigo</h2>
        <p className="text-gray-600">Preencha os dados do endereço anterior do cliente</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">CEP Antigo</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                ref={oldCepRef}
                type="text"
                placeholder="00000-000"
                value={formData.oldCep || ""}
                onChange={e => setFormData({ ...formData, oldCep: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              />
            </div>
            <button 
              onClick={buscarCepAntigo}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Buscar
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
          <div className="relative">
            <House className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rua, Avenida, etc."
              value={formData.oldAddress || ""}
              onChange={e => setFormData({ ...formData, oldAddress: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
          <div className="relative">
            <MapPinned className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Nome do bairro"
              value={formData.oldNeighborhood || ""}
              onChange={e => setFormData({ ...formData, oldNeighborhood: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Número</label>
          <div className="relative">
            <ArrowUp10 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Número do imóvel"
              value={formData.oldNumber || ""}
              onChange={e => setFormData({ ...formData, oldNumber: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Complemento</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Apartamento, bloco, etc. (opcional)"
              value={formData.oldComplement || ""}
              onChange={e => setFormData({ ...formData, oldComplement: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
            />
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="mb-4">
            <span className="text-sm font-medium text-gray-700">Existe porta para desativar?</span>
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, hasPorta: true })}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                formData.hasPorta === true
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Sim
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, hasPorta: false })}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                formData.hasPorta === false
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Não
            </button>
          </div>
        </div>

        {formData.hasPorta && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Qual Porta?</label>
            <div className="relative">
              <EthernetPort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Número da porta"
                value={formData.portaNumber || ""}
                onChange={e => setFormData({ ...formData, portaNumber: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              />
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