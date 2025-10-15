// src/components/Screen2.jsx
import React, { useRef, useState, useEffect } from "react";
import IMask from "imask";
import { House, MapPin, ArrowUp10, MapPinned, Search } from "lucide-react";

export default function Screen2({ formData, setFormData, nextStep, prevStep }) {
  const cepRef = useRef();
  const [loadingCep, setLoadingCep] = useState(false);
  const [condominios, setCondominios] = useState([]);
  const [loadingCondominios, setLoadingCondominios] = useState(false);

  useEffect(() => {
    if (cepRef.current) {
      IMask(cepRef.current, { mask: "00000-000" });
    }
  }, []);

  // Busca condomínios quando isCondominio é marcado
  useEffect(() => {
    if (formData.isCondominio) {
      fetchCondominios();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.isCondominio]);

  const fetchCondominios = async () => {
    setLoadingCondominios(true);
    try {
      const res = await fetch("http://localhost:5000/api/condominios");
      if (!res.ok) {
        console.warn("Falha ao buscar condominios", res.status);
        setCondominios([]);
        return;
      }
      const json = await res.json();
      setCondominios(json.registros || []);
    } catch (err) {
      console.error("Erro ao buscar condominios:", err);
      setCondominios([]);
    } finally {
      setLoadingCondominios(false);
    }
  };

  const cleanDigits = (s) => (String(s || "").replace(/\D/g, "") || "");

  const buscarCep = async () => {
    const cep = (formData.cep || "").replace(/\D/g, "");
    if (cep.length !== 8) {
      alert("Digite um CEP válido.");
      return;
    }

    setLoadingCep(true);
    try {
      const res = await fetch(`http://localhost:5000/api/cep/${cep}`);
      const dados = await res.json();

      console.log("CEP API resposta:", dados);

      if (!res.ok) {
        const msg = dados.error || "Erro desconhecido ao buscar CEP.";
        alert(msg);
        return;
      }

      const normalizedCep = (dados.cep || "").replace(/\D/g, "");

      const updatedData = {
        ...formData,
        cep: normalizedCep || formData.cep,
        address: dados.address || formData.address || "",
        neighborhood: dados.district || formData.neighborhood || "",
        cidade: dados.city || dados.cityId || formData.cidade || "",
        state: dados.state || formData.state || "",
        city_ibge: dados.city_ibge || formData.city_ibge || "",
        // lat/lng: definimos tanto lat/lng quanto latitude/longitude para cobrir variações
        lat: dados.lat || dados.latitude || "",
        lng: dados.lng || dados.longitude || "",
        latitude: dados.lat || dados.latitude || "",
        longitude: dados.lng || dados.longitude || "",
        cityId: dados.cityId || null
      };

      setFormData(updatedData);
    } catch (err) {
      console.error(err);
      alert("Erro ao buscar CEP.");
    } finally {
      setLoadingCep(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Informe o Novo Endereço</h2>
        <p className="text-gray-600">Preencha os dados do endereço de instalação</p>
      </div>

      <div className="space-y-6">
        {/* CEP */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                ref={cepRef}
                type="text"
                placeholder="00000-000"
                value={formData.cep || ""}
                onChange={e => setFormData({ ...formData, cep: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              />
            </div>
            <button 
              onClick={buscarCep}
              disabled={loadingCep}
              className={`px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 ${loadingCep ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Search className="w-4 h-4" />
              {loadingCep ? "Buscando..." : "Buscar"}
            </button>
          </div>
        </div>

        {/* Endereço */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
          <div className="relative">
            <House className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rua, Avenida, etc."
              value={formData.address || ""}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
            />
          </div>
        </div>

        {/* Bairro */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
          <div className="relative">
            <MapPinned className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Nome do bairro"
              value={formData.neighborhood || ""}
              onChange={e => setFormData({ ...formData, neighborhood: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
            />
          </div>
        </div>

        {/* Número */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Número</label>
          <div className="relative">
            <ArrowUp10 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Número do imóvel"
              value={formData.number || ""}
              onChange={e => setFormData({ ...formData, number: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
            />
          </div>
        </div>

        {/* Complemento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Complemento</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Apartamento, bloco, etc. (opcional)"
              value={formData.complemento || ""}
              onChange={e => setFormData({ ...formData, complemento: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
            />
          </div>
        </div>

        {/* É Condomínio? checkbox */}
        <div className="flex items-center gap-3">
          <input
            id="isCondominio"
            type="checkbox"
            checked={!!formData.isCondominio}
            onChange={e => {
              const checked = e.target.checked;
              setFormData({
                ...formData,
                isCondominio: checked,
                ...(checked ? {} : { condominio: "", condominioName: "", bloco: "", apartment: "" })
              });
              if (checked) fetchCondominios();
            }}
            className="w-4 h-4"
          />
          <label htmlFor="isCondominio" className="text-sm text-gray-700">É Condomínio?</label>
        </div>

        {/* Campos condicionais para Condomínio */}
        {formData.isCondominio && (
          <div className="space-y-4 bg-gray-50 p-4 rounded-md border border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Condomínio</label>
              <div className="flex gap-2">
                <select
                  value={formData.condominio || ""}
                  onChange={e => {
                    const selectedId = e.target.value;
                    const selected = condominios.find(c => String(c.id) === String(selectedId));
                    if (selected) {
                      // auto-preenche campos do endereço a partir do condomínio selecionado
                      const normalizedCep = cleanDigits(selected.cep);
                      setFormData({
                        ...formData,
                        condominio: selectedId,
                        condominioName: selected.condominio || "",
                        address: selected.endereco || formData.address || "",
                        number: selected.numero || formData.number || "",
                        neighborhood: (selected.bairro || "").trim() || formData.neighborhood || "",
                        cep: normalizedCep || formData.cep || "",
                        cityId: selected.id_cidade ? String(selected.id_cidade) : formData.cityId || "",
                      });
                    } else {
                      setFormData({
                        ...formData,
                        condominio: "",
                        condominioName: ""
                      });
                    }
                  }}
                  className="flex-1 py-2 px-3 border border-gray-300 rounded-lg bg-white"
                  disabled={loadingCondominios}
                >
                  <option value="">— Selecionar condomínio —</option>
                  {condominios.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.condominio} {c.bairro ? `— ${c.bairro}` : ""}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={fetchCondominios}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg"
                >
                  {loadingCondominios ? "..." : "Atualizar"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bloco</label>
                <input
                  type="text"
                  placeholder="Bloco"
                  value={formData.bloco || ""}
                  onChange={e => setFormData({ ...formData, bloco: e.target.value })}
                  className="w-full py-2 px-3 border border-gray-300 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Apartamento</label>
                <input
                  type="text"
                  placeholder="Apartamento"
                  value={formData.apartment || formData.apartamento || ""}
                  onChange={e => setFormData({ ...formData, apartment: e.target.value, apartamento: e.target.value })}
                  className="w-full py-2 px-3 border border-gray-300 rounded-lg bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Botões */}
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
