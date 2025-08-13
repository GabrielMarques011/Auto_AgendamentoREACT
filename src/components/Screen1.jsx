import React from 'react';
import { UserRound, BookUser } from 'lucide-react';

export default function Screen1({ formData, setFormData, nextStep }) {
  const handleNext = (e) => {
    e.preventDefault();

    if (!formData.clientId.trim() || !formData.contractId.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    nextStep();
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
