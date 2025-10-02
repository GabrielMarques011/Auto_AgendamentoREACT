// src/components/Screen1.jsx
import React, { useState } from 'react';
import { Search, User, Phone, FileText, CreditCard } from 'lucide-react';

/**
 * Screen1:
 *  - Busca cliente por CPF (ou ID)
 *  - Ao encontrar preenche clientId (disabled) e busca contratos do cliente
 *  - Exibe select de contratos para o usuário escolher
 *
 * Espera endpoints no backend:
 * POST /api/cliente         -> aceita { qtype: "cnpj_cpf", query: "66781892215", ... } ou { query: "12174" }
 * POST /api/cliente_contrato-> aceita { qtype: "id_cliente", query: "12174", ... }
 */
export default function Screen1({ formData, setFormData, nextStep }) {
  const [loading, setLoading] = useState(false);
  const [cpfInput, setCpfInput] = useState('');
  const [contracts, setContracts] = useState([]);        // lista de contratos do cliente
  const [clientFound, setClientFound] = useState(false); // true quando clientId foi preenchido
  const [errorMsg, setErrorMsg] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

  const onlyDigits = (s = '') => ('' + s).replace(/\D/g, '');

  const resetAll = () => {
    setCpfInput('');
    setContracts([]);
    setClientFound(false);
    setErrorMsg(null);
    setFormData(prev => ({
      ...prev,
      clientId: '',
      nome_cliente: '',
      telefone_celular: '',
      contractId: ''
    }));
  };

  const handleBuscarCliente = async () => {
    setErrorMsg(null);

    // aceita que o usuário digite CPF formatado (com pontos/traço) ou apenas dígitos
    const digits = onlyDigits(cpfInput);
    if (!digits || digits.length !== 11) {
      alert('Digite um CPF válido (11 dígitos).');
      return;
    }

    setLoading(true);
    try {
      // envio com qtype cnpj_cpf (backend também tenta variações)
      const payload = {
        qtype: 'cnpj_cpf',
        query: digits,
        oper: '=',
        page: '1',
        rp: '1'
      };

      const resp = await fetch(`${API_BASE}/api/cliente`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await resp.json();

      if (!resp.ok) {
        // backend devolve diagnóstico (por ex. { error: "...", ixc_response: {...} })
        const msg = data.error || 'Cliente não encontrado';
        setErrorMsg(typeof data === 'object' ? JSON.stringify(data) : msg);
        throw new Error(msg);
      }

      // registro retornado (objeto com campos do cliente)
      const clienteRegistro = data;

      // preenche formData com o id (diferentes APIs usam 'id' ou 'ID')
      const foundId = clienteRegistro.id || clienteRegistro.ID || clienteRegistro.id_cliente || '';

      setFormData(prev => ({
        ...prev,
        clientId: foundId,
        nome_cliente: clienteRegistro.razao || clienteRegistro.nome || clienteRegistro.nome_cliente || prev.nome_cliente || '',
        telefone_celular: clienteRegistro.fone || clienteRegistro.telefone_celular || prev.telefone_celular || ''
      }));

      setClientFound(true);
      // busca contratos vinculados
      await buscarContratos(foundId);
    } catch (err) {
      console.error('Erro buscar cliente:', err);
      if (!errorMsg) setErrorMsg(err.message || String(err));
      setClientFound(false);
      setContracts([]);
      // não explodir UI com alerta repetido (já logamos)
    } finally {
      setLoading(false);
    }
  };

  const buscarContratos = async (clientId) => {
    setErrorMsg(null);
    if (!clientId) return;
    setLoading(true);
    try {
      const payload = {
        qtype: 'id_cliente',
        query: String(clientId),
        oper: '=',
        page: '1',
        rp: '50'
      };

      const resp = await fetch(`${API_BASE}/api/cliente_contrato`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await resp.json();
      if (!resp.ok) {
        const msg = data.error || 'Erro ao buscar contratos';
        setErrorMsg(typeof data === 'object' ? JSON.stringify(data) : msg);
        throw new Error(msg);
      }

      // backend devolve objeto com "registros": [...]
      const registros = data.registros || [];
      const normalized = registros.map(r => ({
        id: r.id || r.ID || r.id_contrato || r.numero || '',
        label: r.contrato || r.contrato_descricao || (r.contrato ? String(r.contrato) : (`Contrato ${r.id || ''}`))
      }));

      setContracts(normalized);

      // se só houver 1 contrato já seleciona automaticamente
      if (normalized.length === 1) {
        setFormData(prev => ({ ...prev, contractId: normalized[0].id }));
      } else {
        // limpar contractId caso o cliente tenha sido trocado
        setFormData(prev => ({ ...prev, contractId: '' }));
      }
    } catch (err) {
      console.error('Erro buscar contratos:', err);
      if (!errorMsg) setErrorMsg(err.message || String(err));
      setContracts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleContractSelect = (e) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, contractId: val }));
  };

  const handleNext = () => {
    if (!formData.clientId) {
      alert('Selecione ou busque um cliente antes de prosseguir.');
      return;
    }
    if (!formData.contractId) {
      alert('Escolha o contrato do cliente antes de prosseguir.');
      return;
    }
    nextStep();
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Cliente e Contrato</h2>
        <p className="text-gray-600">Busque por CPF para localizar o cliente e escolher o contrato</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">CPF do Cliente</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="000.000.000-00"
                value={cpfInput}
                onChange={e => setCpfInput(e.target.value)}
                disabled={loading}
                className="w-full bg-white pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
              />
            </div>
            <button 
              type="button" 
              onClick={handleBuscarCliente} 
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Buscando...' : 'Buscar Cliente'}
            </button>
            <button 
              type="button" 
              onClick={resetAll} 
              disabled={loading}
              title="Limpar"
              className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
            >
              Limpar
            </button>
          </div>
          <small className="block mt-1.5 text-sm text-gray-500">Você pode colar o CPF com pontos/traço ou somente números.</small>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ID do Cliente</label>
          <input
            type="text"
            value={formData.clientId || ''}
            disabled
            placeholder="Preenchido após busca"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contrato do Cliente</label>

          {contracts.length > 0 ? (
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <select 
                value={formData.contractId || ''} 
                onChange={handleContractSelect}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all appearance-none"
              >
                <option value="">-- Selecione o contrato --</option>
                {contracts.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.label} ({c.id})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={clientFound ? "Digite o ID do contrato ou busque contratos" : "Busque o cliente primeiro"}
                  value={formData.contractId || ''}
                  onChange={e => setFormData({ ...formData, contractId: e.target.value })}
                  disabled={!clientFound}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                />
              </div>
              <small className="block mt-1.5 text-sm text-gray-500">
                {clientFound ? 'Escolha na lista (se houver) ou digite o ID do contrato.' : 'Busque primeiro o cliente para listar contratos.'}
              </small>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Cliente que irá Receber a Equipe</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={formData.nome_cliente || ''}
              onChange={e => setFormData({ ...formData, nome_cliente: e.target.value })}
              /* readOnly */
              placeholder="Nome será preenchido automaticamente"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Telefone de quem irá Receber a Equipe</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={formData.telefone_celular || ''}
              onChange={e => setFormData({ ...formData, telefone_celular: e.target.value })}
              /* readOnly */
              placeholder="Telefones serão preenchidos automaticamente"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white"
            />
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <strong className="text-red-800 font-semibold">Erro / diagnóstico:</strong>
            <div className="mt-2 text-sm text-red-700 whitespace-pre-wrap">{errorMsg}</div>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button 
            onClick={handleNext} 
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm hover:shadow-md"
          >
            Próximo →
          </button>
        </div>
      </div>
    </div>
  );
}