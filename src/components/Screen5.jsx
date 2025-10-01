import React from "react";
import { CalendarDays } from "lucide-react";

export default function Screen5({ formData, setFormData, nextStep, prevStep }) {
  return (
    <div className="screen active">
      <h2>Informe Data e Período</h2>

      <div className="form-group">
        <div className="input-wrapper">
          <CalendarDays size={18} />
          <input
            type="date"
            value={formData.scheduledDate || ""}
            onChange={e => setFormData({ ...formData, scheduledDate: e.target.value })}
          />
        </div>
      </div>

      <div className="form-group">
        <div className="radio-section">
          <div className="radio-question">Período:</div>
          <div className="radio-group">
            {["comercial", "manha", "tarde"].map(period => (
              <div
                key={period}
                className="radio-wrapper"
                onClick={() => setFormData({ ...formData, period })}
              >
                <div className={`radio-input ${formData.period === period ? "checked" : ""}`}></div>
                <label className="radio-label">{period.charAt(0).toUpperCase() + period.slice(1)}</label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="button-group">
        <button onClick={prevStep}>← Voltar</button>
        <button onClick={nextStep}>Próximo →</button>
      </div>
    </div>
  );
}
