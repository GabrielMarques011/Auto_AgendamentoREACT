import React from 'react';
import { CalendarDays } from 'lucide-react';

export default function Screen5({ formData, setFormData, nextStep, prevStep }) {
  return (
    <div className="screen active">
      <div className="form-header">
        <h2 className="form-title">Digite as seguintes informações:</h2>
        <p className="form-subtitle">Referente a Data e Período que será agendado</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
        <div className="form-group">
          <div className="input-wrapper">
            <CalendarDays size={'18px'} className='input-icon' style={{color:'#272727'}} />
            <input
              type="date"
              className="form-input"
              value={formData.scheduledDate}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
            required
          />
          </div>
        </div>

        <div className="form-group">
          <div className="radio-section">
            <div className="radio-question">Período Definido:</div>
            <div className="radio-group">
              <div
                className="radio-wrapper"
                onClick={() => setFormData({ ...formData, period: 'comercial' })}
              >
                <div className={`radio-input ${formData.period === 'comercial' ? 'checked' : ''}`}></div>
                <label className="radio-label">Comercial</label>
              </div>
              <div
                className="radio-wrapper"
                onClick={() => setFormData({ ...formData, period: 'manha' })}
              >
                <div className={`radio-input ${formData.period === 'manha' ? 'checked' : ''}`}></div>
                <label className="radio-label">Manhã</label>
              </div>
              <div
                className="radio-wrapper"
                onClick={() => setFormData({ ...formData, period: 'tarde' })}
              >
                <div className={`radio-input ${formData.period === 'tarde' ? 'checked' : ''}`}></div>
                <label className="radio-label">Tarde</label>
              </div>
            </div>
          </div>
        </div>

        <div className="button-group">
          <button type="button" className="btn btn-secondary" onClick={prevStep}>
            ← Voltar
          </button>
          <button type="submit" className="btn btn-primary">
            Próximo →
          </button>
        </div>
      </form>
    </div>
  );
}
