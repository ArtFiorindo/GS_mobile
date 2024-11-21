import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Medicao {
  id: number;
  user_id: number;
  torre: string;
  kwh: number;
  created_at: string;
}

interface Usuario {
  username: string;
  email: string;
}

interface ContextoEstadoGlobal {
  medicoes: Medicao[];
  usuario: Usuario | null;
  adicionarMedicao: (novaMedicao: Omit<Medicao, 'id' | 'created_at'>) => void;
  editarMedicao: (id: number, dadosAtualizados: Partial<Medicao>) => void;
  excluirMedicao: (id: number) => void;
  carregarUsuario: () => Promise<void>;
  atualizarUsuario: (dadosAtualizados: Partial<Usuario>) => Promise<void>;
  logout: () => void;
}

const ContextoEstadoGlobal = createContext<ContextoEstadoGlobal>({
  medicoes: [],
  usuario: null,
  adicionarMedicao: () => {},
  editarMedicao: () => {},
  excluirMedicao: () => {},
  carregarUsuario: async () => {},
  atualizarUsuario: async () => {},
  logout: () => {},
});

export const useEstadoGlobal = () => useContext(ContextoEstadoGlobal);

export const ProvedorEstadoGlobal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [medicoes, setMedicoes] = useState<Medicao[]>([]);
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  // Carrega o estado inicial do AsyncStorage
  useEffect(() => {
    const carregarEstado = async () => {
      try {
        const medicoesArmazenadas = await AsyncStorage.getItem('medicoes');
        const usuarioArmazenado = await AsyncStorage.getItem('usuario');

        if (medicoesArmazenadas) setMedicoes(JSON.parse(medicoesArmazenadas));
        if (usuarioArmazenado) setUsuario(JSON.parse(usuarioArmazenado));
      } catch (error) {
        console.error('Erro ao carregar estado do AsyncStorage:', error);
      }
    };

    carregarEstado();
  }, []);

  const salvarEstado = async () => {
    try {
      await AsyncStorage.setItem('medicoes', JSON.stringify(medicoes));
      if (usuario) await AsyncStorage.setItem('usuario', JSON.stringify(usuario));
    } catch (error) {
      console.error('Erro ao salvar estado no AsyncStorage:', error);
    }
  };

  // Salva o estado sempre que houver alteração
  useEffect(() => {
    salvarEstado();
  }, [medicoes, usuario]);

  // Gerenciamento de medições
  const adicionarMedicao = (novaMedicao: Omit<Medicao, 'id' | 'created_at'>) => {
    const novaLista = [
      ...medicoes,
      { ...novaMedicao, id: Date.now(), created_at: new Date().toISOString() },
    ];
    setMedicoes(novaLista);
  };

  const editarMedicao = (id: number, dadosAtualizados: Partial<Medicao>) => {
    const medicoesAtualizadas = medicoes.map((medicao) =>
      medicao.id === id ? { ...medicao, ...dadosAtualizados } : medicao
    );
    setMedicoes(medicoesAtualizadas);
  };

  const excluirMedicao = (id: number) => {
    const medicoesFiltradas = medicoes.filter((medicao) => medicao.id !== id);
    setMedicoes(medicoesFiltradas);
  };

  // Gerenciamento de usuário
  const carregarUsuario = async () => {
    try {
      const usuarioArmazenado = await AsyncStorage.getItem('usuario');
      if (usuarioArmazenado) {
        setUsuario(JSON.parse(usuarioArmazenado));
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  };

  const atualizarUsuario = async (dadosAtualizados: Partial<Usuario>) => {
    if (!usuario) return;

    const usuarioAtualizado = { ...usuario, ...dadosAtualizados };
    setUsuario(usuarioAtualizado);

    try {
      await AsyncStorage.setItem('usuario', JSON.stringify(usuarioAtualizado));
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('usuario');
      setUsuario(null);
      setMedicoes([]);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <ContextoEstadoGlobal.Provider
      value={{
        medicoes,
        usuario,
        adicionarMedicao,
        editarMedicao,
        excluirMedicao,
        carregarUsuario,
        atualizarUsuario,
        logout,
      }}
    >
      {children}
    </ContextoEstadoGlobal.Provider>
  );
};
