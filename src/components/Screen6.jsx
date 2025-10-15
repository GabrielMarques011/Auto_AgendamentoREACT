// src/components/Screen6.jsx
import React, { useState } from "react";
import { CheckCircle2, User, MapPin, Calendar, DollarSign, AlertCircle } from "lucide-react";

export default function Screen6({ formData, prevStep }) {
  const [loading, setLoading] = useState(false);

  const periodToHour = {
    comercial: "10:00:00",
    manha: "09:00:00",
    tarde: "14:00:00",
  };

  const formatScheduledDate = () => {
    if (!formData.scheduledDate) return "";
    const hour = periodToHour[formData.period] || "10:00:00";
    return `${formData.scheduledDate} ${hour}`;
  };

  const handleFinalize = async () => {
    setLoading(true);

    try {
      // Monta payload de transferência (tolerante a nomes diferentes de chave)
      const transferPayload = {
        clientId: formData.clientId,
        contractId: formData.contractId,
        cep: formData.cep,
        isCondominio: formData.isCondominio || false,
        condominio: formData.condominio || formData.outroCondominio || "",
        apartment: formData.apartment || "",
        block: formData.block || "",
        address: formData.address || "",
        neighborhood: formData.neighborhood || "",
        number: formData.number || "",
        oldAddress: formData.oldAddress || "",
        oldNeighborhood: formData.oldNeighborhood || "",
        oldNumber: formData.oldNumber || "",
        oldComplemento: formData.oldComplemento || "",
        hasPorta: formData.hasPorta || false,
        portaNumber: formData.portaNumber || "",
        valueType: formData.valueType || "renovacao",
        taxValue: formData.taxValue || "",
        scheduledDate: formatScheduledDate(),
        period: formData.period || "",
        nome_cliente: formData.nome_cliente || "",
        telefone: formData.telefone_celular || "",
        // envia cidade preferencialmente como ID (cityId), senão nome
        cidade: formData.cityId || formData.cidade || formData.city || "",
        state: formData.state || "",
        // lat/lng: aceita várias chaves
        lat: formData.lat ?? formData.latitude ?? "",
        lng: formData.lng ?? formData.longitude ?? "",
        city_ibge: formData.city_ibge || "",
        complemento: formData.complemento || ""
      };

      console.log("Enviando /api/transfer payload:", transferPayload);

      const resTransfer = await fetch("http://localhost:5000/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transferPayload)
      });

      const jsonTransfer = await resTransfer.json().catch(() => ({ error: "Resposta inválida do servidor" }));

      if (!resTransfer.ok) {
        const errMsg = jsonTransfer.error || JSON.stringify(jsonTransfer);
        throw new Error(`Falha na transferência: ${errMsg}`);
      }

      console.log("Transferência criada:", jsonTransfer);

      // Atualizar contrato separadamente (também envia lat/lng)
      /* const updatePayload = {
        contractId: formData.contractId,
        address: formData.address || "",
        number: formData.number || "",
        neighborhood: formData.neighborhood || "",
        complemento: formData.complemento || "",
        cep: formData.cep || "",
        cidade: formData.cityId || formData.cidade || formData.city || "",
        state: formData.state || "",
        lat: formData.lat ?? formData.latitude ?? "",
        lng: formData.lng ?? formData.longitude ?? "",
        city_ibge: formData.city_ibge || "",
        motivo_cancelamento: formData.motivo_cancelamento || "Transferência de endereço - atualização via sistema"
      }; */

      // normaliza cep
      const cepSanitized = (formData.cep || "").replace(/\D/g, "");
      const validCep = cepSanitized && cepSanitized.length === 8 && !/^0+$/.test(cepSanitized);

      const updatePayload = {
        contractId: formData.contractId,
        id_contrato: formData.contractId,
        endereco: formData.address || "",
        address: formData.address || "",
        numero: formData.number || "",
        number: formData.number || "",
        bairro: formData.neighborhood || "",
        neighborhood: formData.neighborhood || "",
        complemento: formData.complemento || "",
        // cidade como id ou nome (enviar ambas chaves possíveis)
        cidade: formData.cityId || formData.cidade || formData.city || "",
        city: formData.cityId || formData.city || formData.cidade || "",
        estado: formData.state || formData.estado || "SP",
        state: formData.state || "",
        lat: formData.lat ?? formData.latitude ?? "",
        lng: formData.lng ?? formData.longitude ?? "",
        latitude: formData.lat ?? formData.latitude ?? "",
        longitude: formData.lng ?? formData.longitude ?? "",
        city_ibge: formData.city_ibge || "",
        motivo_cancelamento: " " // forçar espaco
      };

      // só injetar cep se for válido (evita enviar CEP inválido)
      if (validCep) {
        updatePayload.cep = cepSanitized;
      }


      console.log("Enviando /api/update_contrato payload:", updatePayload);

      const resUpdate = await fetch("http://localhost:5000/api/update_contrato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload)
      });

      const jsonUpdate = await resUpdate.json().catch(() => ({ error: "Resposta inválida do servidor no update_contrato" }));

      if (!resUpdate.ok) {
        throw new Error(jsonUpdate.error || JSON.stringify(jsonUpdate));
      }

      console.log("Contrato atualizado:", jsonUpdate);

      alert("Transferência, OS e atualização do contrato concluídos com sucesso!");
    } catch (err) {
      console.error("Erro ao finalizar agendamento:", err);
      alert("Erro ao finalizar: " + (err.message || String(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Revisão do Agendamento</h2>
        <p className="text-gray-600">Revise os dados antes de finalizar a transferência</p>
      </div>

      <div className="space-y-6">
        {/* Dados do Cliente */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Dados do Cliente</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Nome:</span>
              <p className="text-gray-800">{formData.nome_cliente || "—"}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">ID do Cliente:</span>
              <p className="text-gray-800">{formData.clientId || "—"}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Telefone:</span>
              <p className="text-gray-800">{formData.telefone_celular || "—"}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">ID do Contrato:</span>
              <p className="text-gray-800">{formData.contractId || "—"}</p>
            </div>
          </div>
        </div>

        {/* Novo Endereço */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800">Novo Endereço</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">CEP:</span>
              <p className="text-gray-800">{formData.cep || "—"}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Endereço:</span>
              <p className="text-gray-800">{formData.address || "—"}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Número:</span>
              <p className="text-gray-800">{formData.number || "—"}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Bairro:</span>
              <p className="text-gray-800">{formData.neighborhood || "—"}</p>
            </div>

            <div>
              <span className="text-sm font-medium text-gray-500">Latitude:</span>
              <p className="text-gray-800">{formData.lat || formData.latitude || "—"}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Longitude:</span>
              <p className="text-gray-800">{formData.lng || formData.longitude || "—"}</p>
            </div>

            {formData.complemento && (
              <div className="md:col-span-2">
                <span className="text-sm font-medium text-gray-500">Complemento:</span>
                <p className="text-gray-800">{formData.complemento}</p>
              </div>
            )}
          </div>
        </div>

        {/* Endereço Antigo */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-800">Endereço Antigo</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">CEP:</span>
              <p className="text-gray-800">{formData.oldCep || "—"}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Endereço:</span>
              <p className="text-gray-800">{formData.oldAddress || "—"}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Número:</span>
              <p className="text-gray-800">{formData.oldNumber || "—"}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Bairro:</span>
              <p className="text-gray-800">{formData.oldNeighborhood || "—"}</p>
            </div>
            {formData.hasPorta && (
              <div>
                <span className="text-sm font-medium text-gray-500">Porta:</span>
                <p className="text-gray-800">{formData.portaNumber || "—"}</p>
              </div>
            )}
          </div>
        </div>

        {/* Agendamento */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">Agendamento</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Data:</span>
              <p className="text-gray-800">
                {formData.scheduledDate 
                  ? new Date(formData.scheduledDate + 'T00:00:00').toLocaleDateString('pt-BR')
                  : "—"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Período:</span>
              <p className="text-gray-800">
                {formData.period 
                  ? formData.period.charAt(0).toUpperCase() + formData.period.slice(1)
                  : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Valor */}
        {formData.valueType && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-800">Valor</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Tipo:</span>
                <p className="text-gray-800">
                  {formData.valueType === "renovacao" ? "Renovação de Contrato" : "Taxa"}
                </p>
              </div>
              {formData.valueType === "taxa" && formData.taxValue && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Valor da Taxa:</span>
                  <p className="text-gray-800">{formData.taxValue}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Alerta de atenção */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Atenção</p>
              <p className="text-sm text-yellow-700 mt-1">
                Ao finalizar, será criado um ticket, ordens de serviço e o contrato será atualizado. 
                Certifique-se de que todos os dados estão corretos antes de prosseguir.
              </p>
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-between pt-4">
          <button 
            onClick={prevStep}
            disabled={loading}
            className="px-8 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors shadow-sm hover:shadow-md"
          >
            ← Voltar
          </button>
          <button 
            onClick={handleFinalize}
            disabled={loading}
            className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm hover:shadow-md flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Enviando...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Finalizar Agendamento
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
