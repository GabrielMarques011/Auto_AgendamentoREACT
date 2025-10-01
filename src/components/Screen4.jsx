import React from "react";
import { BanknoteArrowDown } from "lucide-react";

export default function Screen4({ formData, setFormData, nextStep, prevStep }) {
  return (
    <div className="screen active">
      <h2>Informe o Valor</h2>

      <div className="form-group">
        <div className="radio-section">
          <div className="radio-question">Tipo de Valor:</div>
          <div className="radio-group">
            <div className="radio-wrapper" onClick={() => setFormData({ ...formData, valueType: "renovacao" })}>
              <div className={`radio-input ${formData.valueType === "renovacao" ? "checked" : ""}`}></div>
              <label className="radio-label">Renovação de Contrato</label>
            </div>
            <div className="radio-wrapper" onClick={() => setFormData({ ...formData, valueType: "taxa" })}>
              <div className={`radio-input ${formData.valueType === "taxa" ? "checked" : ""}`}></div>
              <label className="radio-label">Taxa</label>
            </div>
          </div>
        </div>

        {formData.valueType === "taxa" && (
          <div className="form-group">
            <div className="input-wrapper">
              <BanknoteArrowDown size={18} />
              <input
                type="text"
                placeholder="Digite o valor"
                value={formData.taxValue || ""}
                onChange={e => setFormData({ ...formData, taxValue: e.target.value })}
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
