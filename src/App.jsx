import React, { useState } from 'react';
import './App.css';
import 'boxicons/css/boxicons.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'boxicons/css/boxicons.min.css';

import ProgressBar from './components/ProcessBar';
import Screen1 from './components/Screen1';
import Screen2 from './components/Screen2';
import Screen3 from './components/Screen3';
import Screen4 from './components/Screen4';
import Screen5 from './components/Screen5';
import Screen6 from './components/Screen6';

function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    clientId: '',
    contractId: '',
    nome_cliente: '',
    telefone: '',
    cidade: '',
    cep: '',
    isCondominio: false,
    condominio: '',
    outroCondominio: '',
    apartment: '',
    block: '',
    address: '',
    neighborhood: '',
    number: '',
    complement: '',
    oldAddress: '',
    oldNeighborhood: '',
    oldNumber: '',
    oldComplement: '',
    hasPorta: false,
    portaNumber: '',
    valueType: 'renovacao',
    taxValue: '',
    scheduledDate: '',
    period: 'comercial',
    id_tecnico: '147'
  });

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  return (
    <div className="container">
      <div className="header">
        <div className="system-title">Sistema Transferência de Endereço</div>
        <ProgressBar step={step} />
      </div>

      <div className="card">
        {step === 1 && <Screen1 formData={formData} setFormData={setFormData} nextStep={nextStep} />}
        {step === 2 && <Screen2 formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
        {step === 3 && <Screen3 formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
        {step === 4 && <Screen4 formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
        {step === 5 && <Screen5 formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
        {step === 6 && <Screen6 formData={formData} prevStep={prevStep} />}
      </div>
    </div>
  );
}

export default App;
