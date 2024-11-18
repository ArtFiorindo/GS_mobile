import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface Paciente {
  id: number;
  nome: string;
  cpf: string;
  dataNascimento: string;
  sinistro: string;
  descricao: string;
}

interface ContextoEstadoGlobal {
  pacientes: Paciente[];
  adicionarPaciente: (paciente: Omit<Paciente, 'id'>) => void;
  editarPaciente: (id: number, dadosAtualizados: Partial<Paciente>) => void;
  excluirPaciente: (id: number) => void;
}


const ContextoEstadoGlobal = createContext<ContextoEstadoGlobal>({
  pacientes: [],
  adicionarPaciente: () => {},
  editarPaciente: () => {},
  excluirPaciente: () => {},
});


export const useEstadoGlobal = () => useContext(ContextoEstadoGlobal);


export const ProvedorEstadoGlobal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);


  const adicionarPaciente = async (novoPaciente: Omit<Paciente, 'id'>) => {
    const pacienteComId = { ...novoPaciente, id: Date.now() }; // Cria um ID único
    const novosPacientes = [...pacientes, pacienteComId];

    try {
      setPacientes(novosPacientes);
      await salvarPacientes(novosPacientes);
    } catch (error) {
      console.error('Erro ao adicionar paciente:', error);
    }
  };


  const editarPaciente = async (id: number, dadosAtualizados: Partial<Paciente>) => {
    const pacientesAtualizados = pacientes.map(paciente =>
      paciente.id === id ? { ...paciente, ...dadosAtualizados } : paciente
    );

    try {
      setPacientes(pacientesAtualizados);
      await salvarPacientes(pacientesAtualizados);
    } catch (error) {
      console.error('Erro ao editar paciente:', error);
    }
  };

  
  const excluirPaciente = async (id: number) => {
    const pacientesFiltrados = pacientes.filter(paciente => paciente.id !== id);

    try {
      setPacientes(pacientesFiltrados);
      await salvarPacientes(pacientesFiltrados);
    } catch (error) {
      console.error('Erro ao excluir paciente:', error);
    }
  };

  
  useEffect(() => {
    const carregarPacientes = async () => {
      try {
        const pacientesArmazenados = await AsyncStorage.getItem('pacientes');
        if (pacientesArmazenados) {
          setPacientes(JSON.parse(pacientesArmazenados));
        }
      } catch (error) {
        console.error('Erro ao carregar pacientes:', error);
      }
    };
    carregarPacientes();
  }, []);

 
  const salvarPacientes = async (pacientes: Paciente[]) => {
    try {
      await AsyncStorage.setItem('pacientes', JSON.stringify(pacientes));
    } catch (error) {
      console.error('Erro ao salvar pacientes:', error);
    }
  };

  
  return (
    <ContextoEstadoGlobal.Provider value={{ pacientes, adicionarPaciente, editarPaciente, excluirPaciente }}>
      {children}
    </ContextoEstadoGlobal.Provider>
  );
};
