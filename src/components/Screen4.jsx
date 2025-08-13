import React from 'react';
import { BanknoteArrowDown } from 'lucide-react';

export default function Screen4({ formData, setFormData, nextStep, prevStep }) {
  return (
    <div className="screen active">
      <div className="form-header">
        <h2 className="form-title">Digite as seguintes informações:</h2>
        <p className="form-subtitle">Referente a valores</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
        <div className="form-group">
          <div className="radio-section">
            <div className="radio-question">Valor:</div>
            <div className="radio-group">
              <div
                className="radio-wrapper"
                onClick={() => setFormData({ ...formData, valueType: 'renovacao' })}
              >
                <div className={`radio-input ${formData.valueType === 'renovacao' ? 'checked' : ''}`}></div>
                <label className="radio-label">Renovação de Contrato</label>
              </div>
              <div
                className="radio-wrapper"
                onClick={() => setFormData({ ...formData, valueType: 'taxa' })}
              >
                <div className={`radio-input ${formData.valueType === 'taxa' ? 'checked' : ''}`}></div>
                <label className="radio-label">Taxa</label>
              </div>
            </div>
          </div>

          {formData.valueType === 'taxa' && (
            <div className="form-group" style={{ marginTop: 20 }}>
              <div className="input-wrapper">
                <BanknoteArrowDown size={'18px'} className='input-icon' style={{color:'#272727'}} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Digite o valor acordado"
                  value={formData.taxValue}
                onChange={(e) => setFormData({ ...formData, taxValue: e.target.value })}
              />
            </div>
            </div>
          )}
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
