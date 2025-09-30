import React from 'react';
import { UserRound, BookUser } from 'lucide-react';

export default function Screen1({ formData, setFormData, nextStep }) {

  const API_URL = import.meta.env.VITE_IXC_API_URL;
  const API_TOKEN = import.meta.env.VITE_IXC_TOKEN;

  const handleNext = async (e) => {
    e.preventDefault();

    if (!formData.clientId.trim() || !formData.contractId.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      // Consulta cliente
      console.log("🔍 URL:", API_URL);
      console.log("🔑 TOKEN:", API_TOKEN);

      const clienteRes = await fetch(`/api/cliente`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": API_TOKEN,
          "ixcsoft": "listar"
        },
        body: JSON.stringify({
          qtype: "id",
          query: formData.clientId,
          oper: "=",
          page: "1",
          rp: "1"
        })
      });

      const clienteData = await clienteRes.json();
      console.log("Resposta JSON:", clienteData);

      // Consulta contrato
      const contratoRes = await fetch(`/api/cliente_contrato`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": API_TOKEN,
          "ixcsoft": "listar"
        },
        body: JSON.stringify({
          qtype: "id",
          query: formData.contractId,
          oper: "=",
          page: "1",
          rp: "1"
        })
      });
      const contratoData = await contratoRes.json();

        if (!clienteData.registros?.length) {
          alert("Cliente não encontrado.");
          return;
        }

        if (!contratoData.registros?.length) {
          alert("Contrato não encontrado.");
          return;
        }

        const cliente = clienteData.registros[0];
        const contrato = contratoData.registros[0];

        // Atualiza formData
        setFormData(prev => ({
          ...prev,
          oldAddress: cliente.endereco || '',
          oldNeighborhood: cliente.bairro || '',
          oldNumber: cliente.numero || '',
          oldComplement: cliente.complemento || '',
          clienteNome: cliente.razao,
          contratoPlano: contrato.contrato
        }));

        nextStep();
        
    } catch (err) {
      console.error(err);
      alert("Erro ao consultar API.");
      alert(`Erro ao consultar API: ${err.message}`);
    }
  };

  return (
    <div className="screen active">
      <div className="form-header">
        <h2 className="form-title">Digite as seguintes informações</h2>
        <p className="form-subtitle">Referente ao cliente</p>
      </div>

      <form onSubmit={handleNext}>
        <div className="form-group">
          <label className="form-label">ID do Cliente:</label>
          <div className="input-wrapper">
            <UserRound size={'18px'} className='input-icon' style={{color:'#272727'}} />
            <input
              type="text"
              className="form-input"
              placeholder="Digite o ID do cliente"
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">ID do Contrato:</label>
          <div className="input-wrapper">
            <BookUser size={'18px'} className='input-icon' style={{color:'#272727'}} />
            <input
              type="text"
              className="form-input"
              placeholder="Digite o ID do contrato"
              value={formData.contractId}
              onChange={(e) => setFormData({ ...formData, contractId: e.target.value })}
            />
          </div>
        </div>

        <div className="button-group">
          <button type="submit" className="btn btn-primary">
            Continuar <span>→</span>
          </button>
        </div>
      </form>
    </div>
  );
}
