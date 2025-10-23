// src/components/LoginScreen.jsx
import React, { useState } from "react";
import { LogIn, User, Lock, AlertCircle, Layers } from "lucide-react";

// Mapeamento de usuários para ID do técnico
const USERS = {
  "marques": { id_tecnico: "306", senha: "admin" },
  "diego.sousa": { id_tecnico: "377", senha: "sup@377" },
  "rodrigo.akira": { id_tecnico: "367", senha: "sup@367" },
  "pedro.santos": { id_tecnico: "359", senha: "sup@359" },
  "pedro.guedes": { id_tecnico: "390", senha: "sup@390" },
  "lucca.ramos": { id_tecnico: "381", senha: "sup@381" },
  "kayky.cabral": { id_tecnico: "387", senha: "sup@387" },
  "joao.miyake": { id_tecnico: "345", senha: "sup@345" },
  "joao.gomes": { id_tecnico: "313", senha: "sup@313" },
  "gabriel.rosa": { id_tecnico: "307", senha: "sup@307" },
  "gabriel.lima": { id_tecnico: "386", senha: "sup@386" },
  "marcos.piazzi": { id_tecnico: "389", senha: "sup@389" },
  "alison.silva": { id_tecnico: "337", senha: "sup@337" },
  "cesar": { id_tecnico: "202", senha: "cesaradmin" },
};

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const user = USERS[username.trim().toLowerCase()];
    if (!user || user.senha !== senha) {
      setError("Usuário ou senha inválidos.");
      setLoading(false);
      return;
    }

    const userData = {
      nome: username.trim(),
      id_tecnico: user.id_tecnico,
    };

    // Salva no localStorage (opcional)
    localStorage.setItem("user", JSON.stringify(userData));

    // Retorna para o App
    onLogin(userData);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center from-blue-50 to-gray-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Layers className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Bem-vindo ao Sistema
            </h1>
            <p className="text-gray-600">
              Faça login para acessar o sistema de agendamento
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuário
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-gray-800"
                  placeholder="Ex: gabriel.marques"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-gray-800"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Entrar no Sistema
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Desenvolvido por @GabrielMarques011
          </p>
        </div>
      </div>
    </div>
  );
}