import React, { useState } from 'react';

export default function Screen1({ formData, setFormData, nextStep }) {
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!formData.clientId || !formData.contractId) {
      alert("Preencha ID do Cliente e ID do Contrato.");
      return;
    }

    setLoading(true);
    try {
      // Consultar cliente
      const resCliente = await fetch("http://localhost:5000/api/cliente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: formData.clientId })
      });
      const clienteData = await resCliente.json();
      if (!resCliente.ok) throw new Error(clienteData.error || "Erro ao consultar cliente");

      // Consultar contrato
      const resContrato = await fetch("http://localhost:5000/api/cliente_contrato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: formData.contractId })
      });
      const contratoData = await resContrato.json();
      if (!resContrato.ok) throw new Error(contratoData.error || "Erro ao consultar contrato");

      // Atualiza formData com dados básicos do cliente/contrato
      setFormData(prev => ({
        ...prev,
        nome_cliente: clienteData.nome || clienteData.cliente_nome || "",
        telefone: clienteData.fone || clienteData.telefone || "",
        cidade: contratoData.cidade || contratoData.city || "",
        contractId: formData.contractId,
        clientId: formData.clientId
      }));

      nextStep();
    } catch (err) {
      console.error(err);
      alert("Erro ao buscar dados do cliente/contrato. Veja o console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen active">
      <h2>Informe o Cliente e Contrato</h2>
      <div className="form-group">
        <label>ID do Cliente:</label>
        <input
          type="text"
          value={formData.clientId || ""}
          onChange={e => setFormData({ ...formData, clientId: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label>ID do Contrato:</label>
        <input
          type="text"
          value={formData.contractId || ""}
          onChange={e => setFormData({ ...formData, contractId: e.target.value })}
        />
      </div>
      <div className="button-group">
        <button onClick={handleNext} disabled={loading}>
          {loading ? "Buscando..." : "Próximo →"}
        </button>
      </div>
    </div>
  );
}
