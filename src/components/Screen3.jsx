import React from 'react';
import { House, MapPin, ArrowUp10, MapPinPen, EthernetPort } from 'lucide-react';

export default function Screen3({ formData, setFormData, nextStep, prevStep }) {
  return (
    <div className="screen active">
      <div className="form-header">
        <h2 className="form-title">Digite as seguintes informações</h2>
        <p className="form-subtitle">Referente ao Antigo Endereço/Porta</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
        
        {/* Endereço e Bairro */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Endereço:</label>
            <div className="input-wrapper">
              <House size={'18px'} className='input-icon' style={{ color: '#272727' }} />
              <input
                type="text"
                className="form-input"
                value={formData.oldAddress || ''}
                onChange={(e) => setFormData({ ...formData, oldAddress: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Bairro:</label>
            <div className="input-wrapper">
              <MapPin size={'18px'} className='input-icon' style={{ color: '#272727' }} />
              <input
                type="text"
                className="form-input"
                value={formData.oldNeighborhood || ''}
                onChange={(e) => setFormData({ ...formData, oldNeighborhood: e.target.value })}
                required
              />
            </div>
          </div>
        </div>

        {/* Número e Complemento */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Número:</label>
            <div className="input-wrapper">
              <ArrowUp10 size={'18px'} className='input-icon' style={{ color: '#272727' }} />
              <input
                type="text"
                className="form-input"
                value={formData.oldNumber || ''}
                onChange={(e) => setFormData({ ...formData, oldNumber: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Complemento:</label>
            <div className="input-wrapper">
              <MapPinPen size={'18px'} className='input-icon' style={{ color: '#272727' }} />
              <input
                type="text"
                className="form-input"
                value={formData.oldComplement || ''}
                onChange={(e) => setFormData({ ...formData, oldComplement: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Existe Porta? */}
        <div className="form-group">
          <div className="radio-section">
            <div className="radio-question">Existe porta para desativar?</div>
            <div className="radio-group">
              <div className="radio-wrapper" onClick={() => setFormData({ ...formData, hasPorta: true })}>
                <div className={`radio-input ${formData.hasPorta ? 'checked' : ''}`}></div>
                <label className="radio-label">Sim</label>
              </div>
              <div className="radio-wrapper" onClick={() => setFormData({ ...formData, hasPorta: false })}>
                <div className={`radio-input ${!formData.hasPorta ? 'checked' : ''}`}></div>
                <label className="radio-label">Não</label>
              </div>
            </div>
          </div>

          {formData.hasPorta && (
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Qual Porta?:</label>
                <div className="input-wrapper">
                  <EthernetPort size={'18px'} className='input-icon' style={{ color: '#272727' }} />
                  <input
                    type="text"
                    className="form-input"
                    value={formData.portaNumber || ''}
                    onChange={(e) => setFormData({ ...formData, portaNumber: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Botões */}
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
