import React, { useState } from "react";

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
      // -----------------------
      // 1) Monta payload de transferência (o que já funciona)
      // -----------------------
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
        complement: formData.complement || "",
        oldAddress: formData.oldAddress || "",
        oldNeighborhood: formData.oldNeighborhood || "",
        oldNumber: formData.oldNumber || "",
        oldComplement: formData.oldComplement || "",
        hasPorta: formData.hasPorta || false,
        portaNumber: formData.portaNumber || "",
        valueType: formData.valueType || "renovacao",
        taxValue: formData.taxValue || "",
        scheduledDate: formatScheduledDate(),
        period: formData.period || "",
        nome_cliente: formData.nome_cliente || "",
        telefone: formData.telefone || "",
        cidade: formData.city || formData.cidade || ""
      };

      console.log("Enviando /api/transfer payload:", transferPayload);

      const resTransfer = await fetch("http://localhost:5000/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transferPayload)
      });

      const jsonTransfer = await resTransfer.json().catch(() => ({ error: "Resposta inválida do servidor" }));

      if (!resTransfer.ok) {
        // mostra o erro retornado pelo backend
        const errMsg = jsonTransfer.error || JSON.stringify(jsonTransfer);
        throw new Error(`Falha na transferência: ${errMsg}`);
      }

      console.log("Transferência criada:", jsonTransfer);
      // opcional: ids retornados pelo backend (ticket, os, etc)
      const idsInfo = {
        ticket: jsonTransfer.id_ticket || jsonTransfer.idTicket || null,
        os_transfer: jsonTransfer.id_os_transferencia || null,
        os_desativ: jsonTransfer.id_os_desativacao || null
      };

      // -----------------------
      // 2) Atualizar contrato (endpoint separado /api/update_contrato)
      //    Envia motivo_cancelamento por padrão para evitar erro da IXC
      // -----------------------
      const updatePayload = {
        contractId: formData.contractId,
        address: formData.address || "",
        number: formData.number || "",
        neighborhood: formData.neighborhood || "",
        cep: formData.cep || "",
        city: formData.city || formData.cidade || "",
        // Envie um motivo que faça sentido; se preferir, capture do usuário em UI antes.
        motivo_cancelamento: formData.motivo_cancelamento || "Transferência de endereço - atualização via sistema"
      };

      console.log("Enviando /api/update_contrato payload:", updatePayload);

      const resUpdate = await fetch("http://localhost:5000/api/update_contrato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload)
      });

      // tenta parsear corpo JSON (pode ser string em erro)
      const jsonUpdate = await resUpdate.json().catch(() => ({ error: "Resposta inválida do servidor no update_contrato" }));

      if (!resUpdate.ok) {
        // repassa a mensagem do backend para o usuário — é importante para debug
        const errMsg = jsonUpdate.error || jsonUpdate || JSON.stringify(jsonUpdate);
        throw new Error(`Falha ao atualizar contrato: ${errMsg}`);
      }

      console.log("Contrato atualizado:", jsonUpdate);

      // -----------------------
      // Sucesso final
      // -----------------------
      alert("Transferência, OS e atualização do contrato concluídos com sucesso!");
      console.log("Resultado completo:", { transfer: jsonTransfer, update: jsonUpdate, ids: idsInfo });
    } catch (err) {
      console.error("Erro ao finalizar agendamento:", err);
      alert("Erro ao finalizar: " + (err.message || String(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen active">
      <div className="form-header">
        <h2 className="form-title">Revisão do Agendamento</h2>
        <p className="form-subtitle">Revise os dados antes de finalizar</p>
      </div>

      <pre style={{ background: "#f7fafc", padding: 20, borderRadius: 12, textAlign: "left" }}>
        {JSON.stringify(formData, null, 2)}
      </pre>

      <div className="button-group">
        <button onClick={prevStep} disabled={loading} className="btn btn-secondary">
          ← Voltar
        </button>
        <button onClick={handleFinalize} disabled={loading} className="btn btn-primary">
          {loading ? "Enviando..." : "Finalizar Agendamento"}
        </button>
      </div>
    </div>
  );
}
