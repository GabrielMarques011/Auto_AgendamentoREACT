// src/components/Screen3.jsx
import React, { useRef, useEffect, useState } from "react";
import IMask from "imask";
import { House, MapPin, ArrowUp10, MapPinned, EthernetPort, Search } from "lucide-react";

export default function Screen3({ formData, setFormData, nextStep, prevStep }) {
  const oldCepRef = useRef();
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (oldCepRef.current) {
      IMask(oldCepRef.current, { mask: "00000-000" });
    }
  }, []);

  // função utilitária para limpar dígitos
  const cleanDigits = (s) => (String(s || "").replace(/\D/g, "") || "");

  // formata para XXXXX-XXX quando possível
  const formatCepPretty = (raw) => {
    try {
      const digits = cleanDigits(raw);
      if (digits.length === 8) return `${digits.slice(0,5)}-${digits.slice(5)}`;
      return raw || "";
    } catch (e) {
      return raw || "";
    }
  };

  // Busca contrato por ID e preenche os campos "antigos" caso estejam vazios
  useEffect(() => {
    const contractId = formData.contractId || formData.id_contrato || formData.contract || "";
    if (!contractId) return;

    const fetchOldAddressFromContract = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        //const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
        const payload = {
          qtype: "id",
          query: String(contractId),
          oper: "=",
          page: "1",
          rp: "1"
        };

        const res = await fetch(`http://10.0.30.251:5000/api/cliente_contrato`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          console.warn("Erro ao obter contrato:", data);
          setFetchError(data.error || "Erro ao buscar contrato");
          setLoading(false);
          return;
        }

        // data pode ser a resposta inteira do IXC ou já uma estrutura custom
        const registro = (data.registros && data.registros[0]) ? data.registros[0] : (data.registro || data);

        if (!registro) {
          setFetchError("Registro de contrato não encontrado na resposta.");
          setLoading(false);
          return;
        }

        // Mapeia possíveis chaves que o IXC usa
        const contratoEndereco = registro.endereco || registro.address || registro.logradouro || "";
        const contratoNumero = registro.numero || registro.number || registro.nro || "";
        const contratoBairro = registro.bairro || registro.neighborhood || "";
        const contratoCep = registro.cep || registro.CEP || registro.Cep || "";
        const contratoCidade = registro.cidade || registro.city || registro.id_cidade || "";

        // Atualiza apenas campos vazios (não sobrescreve entrada manual do usuário)
        setFormData(prev => ({
          ...prev,
          oldAddress: prev.oldAddress && prev.oldAddress.trim() ? prev.oldAddress : (contratoEndereco || prev.oldAddress || ""),
          oldNumber: prev.oldNumber && prev.oldNumber.toString().trim() ? prev.oldNumber : (contratoNumero || prev.oldNumber || ""),
          oldNeighborhood: prev.oldNeighborhood && prev.oldNeighborhood.trim() ? prev.oldNeighborhood : (contratoBairro || prev.oldNeighborhood || ""),
          oldCep: prev.oldCep && prev.oldCep.toString().trim() ? prev.oldCep : (formatCepPretty(contratoCep) || prev.oldCep || ""),
          oldCity: prev.oldCity && prev.oldCity.toString().trim() ? prev.oldCity : (contratoCidade || prev.oldCity || "")
        }));

      } catch (err) {
        console.error("Erro fetch contrato:", err);
        setFetchError(String(err) || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchOldAddressFromContract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.contractId]);

  // Busca CEP antigo via API externa (quando usuário clicar Buscar)
  const buscarCepAntigo = async () => {
    const cep = cleanDigits(formData.oldCep || "");
    if (cep.length !== 8) {
      alert("Digite um CEP válido.");
      return;
    }
    try {
      const res = await fetch(`https://cep.awesomeapi.com.br/json/${cep}`);
      const dados = await res.json();
      if (dados.erro) {
        alert("CEP não encontrado.");
        return;
      }
      setFormData(prev => ({
        ...prev,
        oldAddress: dados.address || prev.oldAddress || "",
        oldNeighborhood: dados.district || prev.oldNeighborhood || "",
        oldCity: dados.city || prev.oldCity || ""
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
        {loading && (
          <div className="p-3 bg-blue-50 border border-blue-100 rounded text-blue-700">Carregando dados do contrato...</div>
        )}
        {fetchError && (
          <div className="p-3 bg-red-50 border border-red-100 rounded text-red-700">
            Erro ao preencher endereço antigo: {fetchError}
          </div>
        )}

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
              inputMode="numeric"
              placeholder="Número da porta de 1 a 24"
              value={formData.portaNumber || ""}
              onChange={e => {
                const value = e.target.value;

                // 1️⃣ Regex: só aceita números (sem espaços, letras ou símbolos)
                const isValidFormat = /^[0-9]*$/.test(value);

                // 2️⃣ Verifica se está vazio ou entre 1 e 24
                const numericValue = Number(value);

                if (
                  (value === "" || isValidFormat) &&
                  (value === "" || (numericValue >= 1 && numericValue <= 24))
                ) {
                  setFormData({ ...formData, portaNumber: value });
                }
              }}
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
            onClick={() => {
              const cep = String(formData.oldCep || "").trim();
              const endereco = String(formData.oldAddress || "").trim();
              const bairro = String(formData.oldNeighborhood || "").trim();
              const numero = String(formData.oldNumber || "").trim();

              // 🔹 Verificação obrigatória de todos os campos
              if (!cep) {
                alert("Por favor, preencha o CEP antes de continuar.");
                return;
              }

              if (!/^\d{5}-?\d{3}$/.test(cep)) {
                alert("Informe um CEP válido no formato 00000-000.");
                return;
              }

              if (!endereco) {
                alert("Por favor, preencha o campo Rua/Avenida antes de continuar.");
                return;
              }

              if (!bairro) {
                alert("Por favor, preencha o campo Bairro antes de continuar.");
                return;
              }

              if (!numero) {
                alert("Por favor, preencha o campo Número antes de continuar.");
                return;
              }

              // Se tudo estiver preenchido corretamente → avança
              nextStep();
            }}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
          >
            Próximo →
          </button>
        </div>
      </div>
    </div>
  );
}
