import React, { useRef, useState, useEffect } from "react";
import IMask from "imask";
import { House, MapPin, ArrowUp10, MapPinPen } from "lucide-react";

export default function Screen2({ formData, setFormData, nextStep, prevStep }) {
  const cepRef = useRef();
  const [outroCondominio, setOutroCondominio] = useState(false);

  useEffect(() => {
    if (cepRef.current) {
      IMask(cepRef.current, { mask: "00000-000" });
    }
  }, []);

  const buscarCep = async () => {
    const cep = formData.cep.replace(/\D/g, "");
    if (cep.length !== 8) {
      alert("Digite um CEP válido.");
      return;
    }

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const dados = await res.json();
      if (dados.erro) {
        alert("CEP não encontrado.");
        return;
      }

      setFormData(prev => ({
        ...prev,
        address: dados.logradouro || "",
        neighborhood: dados.bairro || "",
        city: dados.localidade || ""
      }));
    } catch (err) {
      console.error(err);
      alert("Erro ao buscar CEP.");
    }
  };

  return (
    <div className="screen active">
      <h2>Informe o Novo Endereço</h2>

      <div className="form-group">
        <label>CEP:</label>
        <div className="input-wrapper">
          <MapPin size={18} />
          <input
            ref={cepRef}
            type="text"
            placeholder="00000-000"
            value={formData.cep || ""}
            onChange={e => setFormData({ ...formData, cep: e.target.value })}
          />
          <button onClick={buscarCep}>Buscar</button>
        </div>
      </div>

      <div className="form-group">
        <label>Endereço:</label>
        <div className="input-wrapper">
          <House size={18} />
          <input
            type="text"
            value={formData.address || ""}
            onChange={e => setFormData({ ...formData, address: e.target.value })}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Bairro:</label>
        <div className="input-wrapper">
          <MapPin size={18} />
          <input
            type="text"
            value={formData.neighborhood || ""}
            onChange={e => setFormData({ ...formData, neighborhood: e.target.value })}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Número:</label>
        <div className="input-wrapper">
          <ArrowUp10 size={18} />
          <input
            type="text"
            value={formData.number || ""}
            onChange={e => setFormData({ ...formData, number: e.target.value })}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Complemento:</label>
        <div className="input-wrapper">
          <MapPinPen size={18} />
          <input
            type="text"
            value={formData.complement || ""}
            onChange={e => setFormData({ ...formData, complement: e.target.value })}
          />
        </div>
      </div>

      <div className="button-group">
        <button onClick={prevStep}>← Voltar</button>
        <button onClick={nextStep}>Próximo →</button>
      </div>
    </div>
  );
}
