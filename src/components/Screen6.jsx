import React from 'react';

export default function Screen6({ formData, prevStep }) {
  return (
    <div className="screen active">
      <div className="form-header">
        <h2 className="form-title">Status do Processo de Transferência de Endereço</h2>
        <p className="form-subtitle">Iremos mostrar as informações preenchidas</p>
      </div>

      <div style={{ textAlign: 'left', margin: 20, padding: 20, background: '#f7fafc', borderRadius: 12 }}>
        <pre>{JSON.stringify(formData, null, 2)}</pre>
      </div>

      <div className="button-group">
        <button type="button" className="btn btn-secondary" onClick={prevStep}>
          ← Voltar
        </button>
        <button type="button" className="btn btn-primary" onClick={() => alert('Processo finalizado!')}>
          Finalizar Agendamento
        </button>
      </div>
    </div>
  );
}
