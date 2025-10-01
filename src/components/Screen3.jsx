import React from "react";
import { House, MapPin, ArrowUp10, MapPinPen, EthernetPort } from "lucide-react";

export default function Screen3({ formData, setFormData, nextStep, prevStep }) {
  return (
    <div className="screen active">
      <h2>Informe o Endereço Antigo</h2>

      <div className="form-group">
        <label>Endereço:</label>
        <div className="input-wrapper">
          <House size={18} />
          <input
            type="text"
            value={formData.oldAddress || ""}
            onChange={e => setFormData({ ...formData, oldAddress: e.target.value })}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Bairro:</label>
        <div className="input-wrapper">
          <MapPin size={18} />
          <input
            type="text"
            value={formData.oldNeighborhood || ""}
            onChange={e => setFormData({ ...formData, oldNeighborhood: e.target.value })}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Número:</label>
        <div className="input-wrapper">
          <ArrowUp10 size={18} />
          <input
            type="text"
            value={formData.oldNumber || ""}
            onChange={e => setFormData({ ...formData, oldNumber: e.target.value })}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Complemento:</label>
        <div className="input-wrapper">
          <MapPinPen size={18} />
          <input
            type="text"
            value={formData.oldComplement || ""}
            onChange={e => setFormData({ ...formData, oldComplement: e.target.value })}
          />
        </div>
      </div>

      <div className="form-group">
        <div className="radio-section">
          <div className="radio-question">Existe porta para desativar?</div>
          <div className="radio-group">
            <div className="radio-wrapper" onClick={() => setFormData({ ...formData, hasPorta: true })}>
              <div className={`radio-input ${formData.hasPorta ? "checked" : ""}`}></div>
              <label className="radio-label">Sim</label>
            </div>
            <div className="radio-wrapper" onClick={() => setFormData({ ...formData, hasPorta: false })}>
              <div className={`radio-input ${!formData.hasPorta ? "checked" : ""}`}></div>
              <label className="radio-label">Não</label>
            </div>
          </div>
        </div>

        {formData.hasPorta && (
          <div className="form-group">
            <label>Qual Porta?</label>
            <div className="input-wrapper">
              <EthernetPort size={18} />
              <input
                type="text"
                value={formData.portaNumber || ""}
                onChange={e => setFormData({ ...formData, portaNumber: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>

      <div className="button-group">
        <button onClick={prevStep}>← Voltar</button>
        <button onClick={nextStep}>Próximo →</button>
      </div>
    </div>
  );
}
