import React, { useEffect, useState } from 'react';
import { FlatList, Alert, Toast } from 'native-base';
import PacienteItem from './PacienteItem';

interface Paciente {
  id: number;
  nome: string;
  cpf: string;
  dataNascimento: string;
  sinistro: string;
  descricao: string;
}

interface ListaPacientesProps {
  setEditandoPaciente: (paciente: Paciente) => void;
  recarregarPacientes: boolean;
}

const ListaPacientes: React.FC<ListaPacientesProps> = ({ setEditandoPaciente, recarregarPacientes }) => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);

  const fetchPacientes = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/pacientes', { method: 'GET' });
      const data = await response.json();
      setPacientes(data);
    } catch (error) {
      Toast.show({ description: 'Erro ao buscar pacientes', bgColor: 'red.500' });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/pacientes/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setPacientes(prev => prev.filter(paciente => paciente.id !== id));
        Toast.show({ description: 'Paciente excluído com sucesso!', bgColor: 'green.500' });
      } else throw new Error('Erro ao excluir paciente');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir o paciente.');
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, [recarregarPacientes]);

  return (
    <FlatList
      data={pacientes}
      renderItem={({ item }) => (
        <PacienteItem paciente={item} onDelete={handleDelete} onEdit={setEditandoPaciente} />
      )}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

export default ListaPacientes;
