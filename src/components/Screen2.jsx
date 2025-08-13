import { useEffect, useRef, useState } from 'react';
import IMask from 'imask';
import { House, MapPin, ArrowUp10, MapPinPen } from 'lucide-react';

export default function Screen2({ formData, setFormData, nextStep, prevStep }) {
  const cepRef = useRef();
  const [outroCondominio, setOutroCondominio] = useState(false);

  useEffect(() => {
    if (cepRef.current) {
      IMask(cepRef.current, { mask: '00000-000' });
    }
  }, []);

  const buscarCep = () => {
    const cep = formData.cep.replace(/\D/g, '');
    if (cep.length === 8) {
      fetch(`https://cep.awesomeapi.com.br/json/${cep}`)
        .then(res => res.json())
        .then(dados => {
          if (dados.code) {
            setFormData(prev => ({
              ...prev,
              address: dados.address || '',
              neighborhood: dados.district || ''
            }));
          } else {
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
              .then(res => res.json())
              .then(dadosViaCep => {
                if (!dadosViaCep.erro) {
                  setFormData(prev => ({
                    ...prev,
                    address: dadosViaCep.logradouro || '',
                    neighborhood: dadosViaCep.bairro || ''
                  }));
                } else {
                  alert('CEP não encontrado.');
                }
              });
          }
        })
        .catch(() => alert('Erro ao buscar CEP.'));
    } else {
      alert('Digite um CEP válido.');
    }
  };

  return (
    <div className="screen active">
      <div className="form-header">
        <h2 className="form-title">Digite as seguintes informações</h2>
        <p className="form-subtitle">Referente ao Novo Endereço</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
        <div className="form-group">
          <label className="form-label">CEP:</label>
          <div className="input-wrapper">
            <MapPin size={'18px'} className='input-icon' style={{color:'#272727'}} />
            <input
              ref={cepRef}
              type="text"
              className="form-input"
              placeholder="00000-000"
              value={formData.cep}
              onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
            />
            <div className="form-group-button">
              <button
                className="form-button"
                type="button"
                onClick={buscarCep}
              >
                Buscar
              </button>
            </div>
          </div>

          <div className="radio-section">
            <div className="radio-question">É condomínio?</div>
            <div className="radio-group">
              <div className="radio-wrapper" onClick={() => setFormData({ ...formData, isCondominio: true })}>
                <div className={`radio-input ${formData.isCondominio ? 'checked' : ''}`}></div>
                <label className="radio-label">Sim</label>
              </div>
              <div className="radio-wrapper" onClick={() => setFormData({ ...formData, isCondominio: false })}>
                <div className={`radio-input ${!formData.isCondominio ? 'checked' : ''}`}></div>
                <label className="radio-label">Não</label>
              </div>
            </div>
          </div>

          {formData.isCondominio && (
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nome Condomínio:</label>
                <div className="input-wrapper">
                  <i className="bi bi-building-fill-add input-icon icon-map"></i>
                  <select
                    className="form-input"
                    value={formData.condominio}
                    onChange={(e) => {
                      setFormData({ ...formData, condominio: e.target.value });
                      setOutroCondominio(e.target.value === "Outro");
                    }}
                  >
                    <option value="">Selecione um condomínio</option>
                    <option value="Residencial Primavera">Residencial Primavera</option>
                    <option value="Condomínio Bela Vista">Condomínio Bela Vista</option>
                    <option value="Residencial Sol Nascente">Residencial Sol Nascente</option>
                    <option value="Outro">Outro...</option>
                  </select>
                </div>
                {outroCondominio && (
                  <div className="form-group" style={{marginTop: 8}}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Digite o nome do condomínio"
                      value={formData.outroCondominio || ""}
                      onChange={(e) => setFormData({ ...formData, outroCondominio: e.target.value })}
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Apartamento:</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.apartment}
                  onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bloco:</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.block}
                  onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                  required
                />
              </div>
            </div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Endereço:</label>
            <div className="input-wrapper">
              <House size={'18px'} className='input-icon' style={{color:'#272727'}} />
              <input
                type="text"
                className="form-input"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Bairro:</label>
            <div className="input-wrapper">
              <MapPin size={'18px'} className='input-icon' style={{color:'#272727'}} />
              <input
                type="text"
                className="form-input"
                value={formData.neighborhood}
                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Número:</label>
            <div className="input-wrapper">
              <ArrowUp10 size={'18px'} className='input-icon' style={{color:'#272727'}} />
              <input
                type="text"
                className="form-input"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              required
            />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Complemento:</label>
            <div className="input-wrapper">
              <MapPinPen size={'18px'} className='input-icon' style={{color:'#272727'}} />
              <input
                type="text"
                className="form-input"
                value={formData.complement}
                onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
            />
          </div>
          </div>
        </div>

        <div className="button-group">
          <button type="button" className="btn btn-secondary" onClick={prevStep}>
            ← Voltar
          </button>
          <button type="submit" className="btn btn-primary">
            Continuar →
          </button>
        </div>
      </form>
    </div>
  );
}
