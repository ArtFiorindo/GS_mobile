import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Modal } from 'react-native';

interface Paciente {
  id: number;
  nome: string;
  cpf: string;
  dataNascimento: string;
  sinistro: string;
  descricao: string;
}

interface AdicionarPacienteProps {
  onAdicionarPaciente: () => void;
  paciente?: Paciente | null;
  setEditandoPaciente: (paciente: Paciente | null) => void;
}

const AdicionarPaciente: React.FC<AdicionarPacienteProps> = ({ onAdicionarPaciente, paciente, setEditandoPaciente }) => {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [sinistro, setSinistro] = useState('');
  const [descricao, setDescricao] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (paciente) {
      setNome(paciente.nome);
      setCpf(paciente.cpf);
      setDataNascimento(paciente.dataNascimento);
      setSinistro(paciente.sinistro);
      setDescricao(paciente.descricao);
    } else {
      limparCampos();
    }
  }, [paciente]);

  const handleSalvarPaciente = async () => {
    if (!nome || !cpf || !dataNascimento || !sinistro || !descricao) {
      setModalVisible(true);
      return;
    }

    const pacienteData = { nome, cpf, dataNascimento, sinistro, descricao };

    try {
      const response = await fetch(
        paciente ? `http://localhost:3000/api/pacientes/${paciente.id}` : 'http://localhost:3000/api/pacientes', {
          method: paciente ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pacienteData),
        }
      );

      if (response.ok) {
        onAdicionarPaciente();
        limparCampos();
      } else {
        setModalVisible(true);
      }
    } catch (error) {
      setModalVisible(true);
    }
  };

  const limparCampos = () => {
    setNome('');
    setCpf('');
    setDataNascimento('');
    setSinistro('');
    setDescricao('');
    setEditandoPaciente(null);
  };

  // Formatação automática do CPF
  const handleCpfChange = (text: string) => {
    let formattedCpf = text.replace(/\D/g, '');
    if (formattedCpf.length > 11) {
      formattedCpf = formattedCpf.slice(0, 11); 
    }
    formattedCpf = formattedCpf.replace(/(\d{3})(\d)/, '$1.$2');
    formattedCpf = formattedCpf.replace(/(\d{3})(\d)/, '$1.$2');
    formattedCpf = formattedCpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setCpf(formattedCpf);
  };

  // Formatação automática da Data de Nascimento
  const handleDataNascimentoChange = (text: string) => {
    let formattedDate = text.replace(/\D/g, '');
    if (formattedDate.length > 8) {
      formattedDate = formattedDate.slice(0, 8);
    }
    formattedDate = formattedDate.replace(/(\d{2})(\d)/, '$1/$2');
    formattedDate = formattedDate.replace(/(\d{2})(\d)/, '$1/$2');
    setDataNascimento(formattedDate);
  };

  return (
    <View style={styles.formContainer}>
      <TextInput
        style={styles.input}
        placeholder="Nome Completo"
        placeholderTextColor="#A9A9A9"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="CPF"
        placeholderTextColor="#A9A9A9"
        value={cpf}
        onChangeText={handleCpfChange}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Data de Nascimento"
        placeholderTextColor="#A9A9A9"
        value={dataNascimento}
        onChangeText={handleDataNascimentoChange}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Sinistro"
        placeholderTextColor="#A9A9A9"
        value={sinistro}
        onChangeText={setSinistro}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        placeholderTextColor="#A9A9A9"
        value={descricao}
        onChangeText={setDescricao}
      />

      <TouchableOpacity style={styles.button} onPress={handleSalvarPaciente}>
        <Text style={styles.buttonText}>{paciente ? 'Salvar Alterações' : 'Adicionar Paciente'}</Text>
      </TouchableOpacity>

      {paciente && (
        <TouchableOpacity style={styles.buttonCancel} onPress={() => setEditandoPaciente(null)}>
          <Text style={styles.buttonText}>Cancelar Edição</Text>
        </TouchableOpacity>
      )}

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Todos os campos são obrigatórios.</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: '#E2E0FF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    color: '#333',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#7A6BF5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonCancel: {
    backgroundColor: '#FC8282',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#7A6BF5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdicionarPaciente;
