import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  Switch, 
  FlatList, 
  Alert, 
  StyleSheet, 
  ScrollView // Importado para permitir rolagem
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

// Chave de armazenamento para o AsyncStorage
const PLANTIO_STORAGE_KEY = '@plantacoes_agronegocio';

const App = () => {
  // --- 1. ESTADOS DO COMPONENTE ---
  const [cultura, setCultura] = useState('soja');
  const [dataPlantio, setDataPlantio] = useState('');
  const [quantidadeSementes, setQuantidadeSementes] = useState('');
  const [soloFertil, setSoloFertil] = useState(false);
  const [plantacoes, setPlantacoes] = useState([]);
  const [erro, setErro] = useState('');

  // --- 2. FUNÇÕES DE PERSISTÊNCIA ---

  /**
   * Salva a lista atual de plantações no AsyncStorage.
   */
  const salvarPlantacoes = async (lista) => {
    try {
      const jsonValue = JSON.stringify(lista);
      await AsyncStorage.setItem(PLANTIO_STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error("Erro ao salvar dados: ", e);
    }
  };

  /**
   * Carrega os dados de plantações do AsyncStorage ao iniciar o app.
   */
  const carregarPlantacoes = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(PLANTIO_STORAGE_KEY);
      if (jsonValue != null) {
        setPlantacoes(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error("Erro ao carregar dados: ", e);
    }
  };

  // --- 3. LÓGICA DE VALIDAÇÃO E REGISTRO ---

  const validarDados = () => {
    setErro(''); 
    if (!dataPlantio || !quantidadeSementes) {
      setErro('Todos os campos obrigatórios devem ser preenchidos.');
      return false;
    }
    // Validação de formato de data básica DD/MM/AAAA
    const dataRegex = /^\d{2}\/\d{2}\/\d{4}$/; 
    if (!dataRegex.test(dataPlantio)) {
        setErro('Formato de data inválido. Use DD/MM/AAAA.');
        return false;
    }

    if (isNaN(parseFloat(quantidadeSementes)) || parseFloat(quantidadeSementes) <= 0) {
      setErro('A quantidade de sementes deve ser um número positivo.');
      return false;
    }
    return true;
  };

  const registrarPlantacao = async () => {
    if (!validarDados()) {
      return;
    }

    const novoRegistro = {
      id: Date.now(), // ID único
      cultura: cultura,
      data: dataPlantio,
      quantidade: parseFloat(quantidadeSementes),
      solo: soloFertil ? 'Fértil' : 'Não Fértil',
    };

    const novaLista = [novoRegistro, ...plantacoes]; // Adiciona no início
    setPlantacoes(novaLista);

    await salvarPlantacoes(novaLista);

    // Limpar o formulário
    setDataPlantio('');
    setQuantidadeSementes('');
    setSoloFertil(false);
    Alert.alert('Sucesso!', 'Registro de plantação salvo com sucesso!');
  };
  
  // --- 4. EFEITO DE CARREGAMENTO INICIAL (Montagem do Componente) ---
  
  useEffect(() => {
    carregarPlantacoes();
  }, []);

  // --- 5. RENDERIZAÇÃO DA INTERFACE (JSX) ---
  return (
    // ScrollView permite que a tela role, caso o conteúdo seja muito grande
    <ScrollView style={styles.container}>
      
      {/* --- BLOCO DO FORMULÁRIO (Novo Registro) --- */}
      <View style={styles.formContainer}>
        <Text style={styles.header}>Novo Registro 🌱</Text>

        {/* Picker para Cultura */}
        <Text style={styles.label}>Cultura:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={cultura}
            onValueChange={(itemValue) => setCultura(itemValue)}>
            <Picker.Item label="Soja" value="soja" />
            <Picker.Item label="Milho" value="milho" />
            <Picker.Item label="Trigo" value="trigo" />
            <Picker.Item label="Algodão" value="algodao" />
          </Picker>
        </View>

        {/* TextInput para Data */}
        <Text style={styles.label}>Data de Plantio (DD/MM/AAAA):</Text>
        <TextInput
          value={dataPlantio}
          onChangeText={setDataPlantio}
          placeholder="Ex: 15/09/2025"
          style={styles.input}
          keyboardType="default"
        />

        {/* TextInput para Quantidade */}
        <Text style={styles.label}>Quantidade de Sementes (kg):</Text>
        <TextInput
          value={quantidadeSementes}
          onChangeText={setQuantidadeSementes}
          placeholder="Ex: 150"
          keyboardType="numeric"
          style={styles.input}
        />

        {/* Switch para Solo */}
        <View style={styles.switchContainer}>
          <Text style={styles.labelSwitch}>Solo Fértil:</Text>
          <Switch
            onValueChange={setSoloFertil}
            value={soloFertil}
            trackColor={{ false: "#767577", true: "#81b0ff" }} // Estilo do Switch
            thumbColor={soloFertil ? "#4CAF50" : "#f4f3f4"}
          />
        </View>

        {/* Feedback de Erro */}
        {erro ? <Text style={styles.errorText}>{erro}</Text> : null}

        <Button title="Registrar Plantação" onPress={registrarPlantacao} color="#4CAF50" />
      </View>
      
      {/* --- BLOCO DA LISTA (Histórico) --- */}
      <View style={styles.listContainer}>
        <Text style={styles.headerList}>Histórico de Registros ({plantacoes.length}) 📊</Text>

        <FlatList
          data={plantacoes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.itemTitle}>Cultura: {item.cultura.toUpperCase()}</Text>
              <Text>Data de Plantio: **{item.data}**</Text>
              <Text>Quantidade: {item.quantidade} kg</Text>
              <Text>Condição do Solo: <Text style={{ fontWeight: 'bold', color: item.solo === 'Fértil' ? '#388E3C' : '#D32F2F' }}>{item.solo}</Text></Text>
            </View>
          )}
          ListEmptyComponent={() => (
            <Text style={styles.emptyListText}>
              Nenhum registro encontrado. Comece a registrar acima!
            </Text>
          )}
          // Garante que a FlatList ocupe o espaço corretamente
          scrollEnabled={false} 
        />
      </View>
    </ScrollView>
  );
};

// --- ESTILIZAÇÃO (STYLESHEET) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#f0f0f0',
  },
  formContainer: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 30, // Espaço inferior para o fim da lista
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#388E3C',
  },
  headerList: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 4,
    marginBottom: 15,
    backgroundColor: '#f7f7f7',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 15,
    backgroundColor: '#f7f7f7',
    overflow: 'hidden',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  labelSwitch: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  errorText: {
    color: '#D32F2F',
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  listItem: {
    padding: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50', // Detalhe visual
    backgroundColor: '#fff',
    borderRadius: 6,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#666',
    fontStyle: 'italic',
  }
});


export default App;