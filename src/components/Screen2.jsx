// src/components/Screen2.jsx
import React, { useRef, useState, useEffect } from "react";
import IMask from "imask";
import { House, MapPin, ArrowUp10, MapPinned, Search } from "lucide-react";

export default function Screen2({ formData, setFormData, nextStep, prevStep }) {
  const cepRef = useRef();
  const [loadingCep, setLoadingCep] = useState(false);
  const [condominios, setCondominios] = useState([]);
  const [loadingCondominios, setLoadingCondominios] = useState(false);
  const [searchCondominio, setSearchCondominio] = useState("");

  const [errors, setErrors] = useState({
    address: null,
    cep: null,
    neighborhood: null,
    number: null,
  });

  useEffect(() => {
    if (cepRef.current) {
      IMask(cepRef.current, { mask: "00000-000" });
    }
  }, []);

  useEffect(() => {
    setErrors((prev) => ({
      ...prev,
      address:
        formData.address && formData.address.trim() ? null : prev.address,
      neighborhood:
        formData.neighborhood && formData.neighborhood.trim()
          ? null
          : prev.neighborhood,
      number:
        formData.number && String(formData.number).trim()
          ? null
          : prev.number,
      cep: validateCep(formData.cep) ? null : prev.cep,
    }));
  }, [formData.address, formData.neighborhood, formData.number, formData.cep]);

  useEffect(() => {
    if (formData.isCondominio) {
      fetchCondominios();
    }
  }, [formData.isCondominio]);

  const fetchCondominios = async () => {
    setLoadingCondominios(true);
    try {
      const res = await fetch("http://10.0.30.251:5000/api/condominios");
      if (!res.ok) {
        console.warn("Falha ao buscar condomínios", res.status);
        setCondominios([]);
        return;
      }
      const json = await res.json();
      // ordena alfabeticamente pelo nome
      const sorted = (json.registros || []).sort((a, b) =>
        (a.condominio || "").localeCompare(b.condominio || "")
      );
      setCondominios(sorted);
    } catch (err) {
      console.error("Erro ao buscar condomínios:", err);
      setCondominios([]);
    } finally {
      setLoadingCondominios(false);
    }
  };

  const cleanDigits = (s) => String(s || "").replace(/\D/g, "") || "";
  const validateCep = (cepValue) => cleanDigits(cepValue).length === 8;

  const buscarCep = async () => {
    const cep = cleanDigits(formData.cep);
    if (cep.length !== 8) {
      setErrors((prev) => ({ ...prev, cep: "Digite um CEP válido (8 dígitos)." }));
      alert("Digite um CEP válido.");
      return;
    }

    setLoadingCep(true);
    try {
      const res = await fetch(`http://10.0.30.251:5000/api/cep/${cep}`);
      const dados = await res.json();

      if (!res.ok) {
        const msg = dados.error || "Erro desconhecido ao buscar CEP.";
        alert(msg);
        return;
      }

      const normalizedCep = cleanDigits(dados.cep);
      setFormData({
        ...formData,
        cep: normalizedCep || formData.cep,
        address: dados.address || formData.address || "",
        neighborhood: dados.district || formData.neighborhood || "",
        cidade: dados.city || dados.cityId || formData.cidade || "",
        state: dados.state || formData.state || "",
        city_ibge: dados.city_ibge || formData.city_ibge || "",
        lat: dados.lat || dados.latitude || "",
        lng: dados.lng || dados.longitude || "",
        latitude: dados.lat || dados.latitude || "",
        longitude: dados.lng || dados.longitude || "",
        cityId: dados.cityId || null,
      });
      setErrors((prev) => ({ ...prev, cep: null }));
    } catch (err) {
      console.error(err);
      alert("Erro ao buscar CEP.");
    } finally {
      setLoadingCep(false);
    }
  };

  const validateAllRequired = () => {
    const newErrors = { address: null, cep: null, neighborhood: null, number: null };
    let ok = true;

    if (!formData.address?.trim()) { newErrors.address = "Endereço é obrigatório."; ok = false; }
    if (!formData.neighborhood?.trim()) { newErrors.neighborhood = "Bairro é obrigatório."; ok = false; }
    if (!formData.number?.trim()) { newErrors.number = "Número é obrigatório."; ok = false; }
    if (!validateCep(formData.cep)) { newErrors.cep = "CEP inválido (8 dígitos)."; ok = false; }

    setErrors(newErrors);
    return ok;
  };

  const buildUpdatePayload = (source) => {
    const payload = {
      contractId: source.contractId || source.id_contrato || source.contract || "",
      address: source.address || "",
      number: source.number || "",
      neighborhood: source.neighborhood || "",
      cep: source.cep || "",
      cidade: source.cidade || source.city || "",
      state: source.state || "",
      complement: source.complemento || source.complement || "",
      lat: source.lat || source.latitude || "",
      lng: source.lng || source.longitude || "",
      city_ibge: source.city_ibge || source.cityIbge || "",
      isCondominio: !!source.isCondominio,
      id_condominio: source.isCondominio ? source.condominio || "" : "",
      condominio: source.isCondominio ? source.condominio || "" : "",
      condominioName: source.isCondominio ? source.condominioName || "" : "",
      bloco: source.isCondominio ? source.bloco || "" : "",
      apartment: source.isCondominio ? source.apartment || source.apartamento || "" : "",
      apartamento: source.isCondominio ? source.apartment || source.apartamento || "" : "",
    };
    return payload;
  };


  const handleNext = async () => {
    const newErrors = { ...errors };

    // Validação obrigatória dos campos gerais
    let ok = true;
    if (!formData.address?.trim()) { newErrors.address = "Endereço é obrigatório."; ok = false; }
    if (!formData.neighborhood?.trim()) { newErrors.neighborhood = "Bairro é obrigatório."; ok = false; }
    if (!formData.number?.trim()) { newErrors.number = "Número é obrigatório."; ok = false; }
    if (!validateCep(formData.cep)) { newErrors.cep = "CEP inválido (8 dígitos)."; ok = false; }

    // Validação de condomínio e complemento
    if (formData.isCondominio) {
      if (!formData.complemento?.trim()) {
        // Se complemento vazio, bloco e apartamento obrigatórios
        if (!formData.bloco?.trim()) { newErrors.bloco = "Bloco é obrigatório."; ok = false; }
        if (!(formData.apartment || formData.apartamento)?.trim()) { newErrors.apartment = "Apartamento é obrigatório."; ok = false; }
      } else {
        // Se complemento preenchido, limpar possíveis erros anteriores
        newErrors.bloco = null;
        newErrors.apartment = null;
      }
    }

    setErrors(newErrors);

    if (!ok) {
      alert("Preencha os campos obrigatórios corretamente.");
      return;
    }

    // Monta payload e segue para próximo passo
    const payload = buildUpdatePayload(formData);
    nextStep();
  };


  // --- FILTRO DE CONDOMÍNIOS FLEXÍVEL ---
  const normalizeString = (str) =>
    str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() || "";

  const filteredCondominios = condominios.filter((c) => {
    const termo = normalizeString(searchCondominio);
    return (
      normalizeString(c.condominio).includes(termo) ||
      (c.referencia && normalizeString(c.referencia).includes(termo))
    );
  });

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
                onChange={(e) => { setFormData({ ...formData, cep: e.target.value }); setErrors(prev => ({ ...prev, cep: null })); }}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white ${errors.cep ? "border-red-500" : "border-gray-300"}`}
              />
            </div>
            <button onClick={buscarCep} disabled={loadingCep} className={`px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 ${loadingCep ? "opacity-50 cursor-not-allowed" : ""}`}>
              <Search className="w-4 h-4" /> {loadingCep ? "Buscando..." : "Buscar"}
            </button>
          </div>
          {errors.cep && <p className="mt-1 text-xs text-red-600">{errors.cep}</p>}
        </div>

        {/* Endereço */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
          <div className="relative">
            <House className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Rua, Avenida, etc." value={formData.address || ""} onChange={(e) => { setFormData({ ...formData, address: e.target.value }); setErrors(prev => ({ ...prev, address: null })); }} className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white ${errors.address ? "border-red-500" : "border-gray-300"}`} />
          </div>
          {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
        </div>

        {/* Bairro */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
          <div className="relative">
            <MapPinned className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Nome do bairro" value={formData.neighborhood || ""} onChange={(e) => { setFormData({ ...formData, neighborhood: e.target.value }); setErrors(prev => ({ ...prev, neighborhood: null })); }} className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white ${errors.neighborhood ? "border-red-500" : "border-gray-300"}`} />
          </div>
          {errors.neighborhood && <p className="mt-1 text-xs text-red-600">{errors.neighborhood}</p>}
        </div>

        {/* Número */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Número</label>
          <div className="relative">
            <ArrowUp10 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Número do imóvel" value={formData.number || ""} onChange={(e) => { setFormData({ ...formData, number: e.target.value }); setErrors(prev => ({ ...prev, number: null })); }} className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white ${errors.number ? "border-red-500" : "border-gray-300"}`} />
          </div>
          {errors.number && <p className="mt-1 text-xs text-red-600">{errors.number}</p>}
        </div>

        {/* Complemento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Complemento</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Apartamento, bloco, etc. (opcional)" value={formData.complemento || ""} onChange={(e) => setFormData({ ...formData, complemento: e.target.value })} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white" />
          </div>
        </div>

        {/* É Condomínio? checkbox */}
        <div className="flex items-center gap-3">
          <input id="isCondominio" type="checkbox" checked={!!formData.isCondominio} onChange={(e) => {
            const checked = e.target.checked;
            setFormData(prev => ({
              ...prev,
              isCondominio: checked,
              ...(checked ? {} : { id_condominio: " ", condominio: "", condominioName: "", bloco: " ", apartment: " ", apartamento: " " })
            }));
            if (checked) fetchCondominios();
          }} className="w-4 h-4" />
          <label htmlFor="isCondominio" className="text-sm text-gray-700">É Condomínio?</label>
        </div>

        {/* Campos condicionais para Condomínio */}
        {formData.isCondominio && (
          <div className="space-y-4 bg-gray-50 p-4 rounded-md border border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pesquisar Condomínio</label>
              <input type="text" placeholder="Digite nome ou referência" value={searchCondominio} onChange={(e) => setSearchCondominio(e.target.value)} className="w-full py-2 px-3 border border-gray-300 rounded-lg bg-white" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Condomínio</label>
              <div className="flex gap-2">
                <select value={formData.condominio || ""} onChange={(e) => {
                  const selectedId = e.target.value;
                  const selected = condominios.find(c => String(c.id) === String(selectedId));
                  if (selected) {
                    const normalizedCep = cleanDigits(selected.cep);
                    setFormData({
                      ...formData,
                      condominio: selectedId,
                      condominioName: selected.condominio || "",
                      id_condominio: selectedId,
                      address: selected.endereco || formData.address || "",
                      number: selected.numero || formData.number || "",
                      neighborhood: (selected.bairro || "").trim() || formData.neighborhood || "",
                      cep: normalizedCep || formData.cep || "",
                      cityId: selected.id_cidade ? String(selected.id_cidade) : formData.cityId || "",
                    });
                    setErrors({ ...errors, address: null, neighborhood: null, number: null, cep: null });
                  } else {
                    setFormData({ ...formData, condominio: "", condominioName: "", id_condominio: "" });
                  }
                }} className="flex-1 py-2 px-3 border border-gray-300 rounded-lg bg-white" disabled={loadingCondominios}>
                  <option value="">— Selecionar condomínio —</option>
                  {filteredCondominios.map(c => <option key={c.id} value={c.id}>{c.condominio} {c.bairro ? `— ${c.bairro}` : ""}</option>)}
                </select>
                <button type="button" onClick={fetchCondominios} className="px-3 py-2 bg-blue-600 text-white rounded-lg">{loadingCondominios ? "..." : "Atualizar"}</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bloco</label>
                <input type="text" placeholder="Bloco" value={formData.bloco || ""} onChange={(e) => setFormData({ ...formData, bloco: e.target.value })} className="w-full py-2 px-3 border border-gray-300 rounded-lg bg-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Apartamento</label>
                <input type="text" placeholder="Apartamento" value={formData.apartment || formData.apartamento || ""} onChange={(e) => setFormData({ ...formData, apartment: e.target.value, apartamento: e.target.value })} className="w-full py-2 px-3 border border-gray-300 rounded-lg bg-white" />
              </div>
            </div>
          </div>
        )}

        {/* Botões */}
        <div className="flex justify-between pt-4">
          <button onClick={prevStep} className="px-8 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors shadow-sm hover:shadow-md">← Voltar</button>
          <button onClick={handleNext} className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md">Próximo →</button>
        </div>
      </div>
    </div>
  );
}
