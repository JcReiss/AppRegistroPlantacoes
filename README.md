# 🧑‍🌾 App de Registro de Plantações (Agronegócio)

## 🎯 Objetivo do Projeto

O **App de Registro de Plantações** é um trabalho prático desenvolvido em **React Native com Expo** focado em integrar os conceitos essenciais de desenvolvimento móvel com as necessidades do **Agronegócio Moderno**.

Seu objetivo é fornecer uma ferramenta simples e eficiente para que o agricultor possa **registrar informações críticas sobre o plantio em tempo real**, garantindo a coleta, validação e persistência dos dados no próprio dispositivo, fundamentais para a tomada de decisões no campo.

---

## ✨ Funcionalidades Principais

O aplicativo foi construído em torno de quatro pilares de desenvolvimento de aplicativos móveis:

1.  **Captura de Dados:**
    * Uso de `TextInput` para campos de texto livre (Data, Quantidade).
    * Uso de `Picker` para seleção de opções pré-definidas (Tipo de Cultura: Soja, Milho, Trigo).
    * Uso de `Switch` para entradas binárias (Solo Fértil: Sim/Não).
2.  **Validação de Entrada:**
    * Verifica se os campos obrigatórios estão preenchidos.
    * Garante que o campo **Quantidade de Sementes** é um valor numérico e positivo.
    * Garante que a **Data de Plantio** está no formato `DD/MM/AAAA`.
3.  **Persistência de Dados (Offline):**
    * Utiliza o **`@react-native-async-storage/async-storage`** para salvar a lista de registros de plantações diretamente no dispositivo.
    * Os dados são carregados automaticamente ao iniciar o aplicativo, garantindo que o histórico permaneça disponível mesmo sem conexão com a internet.
4.  **Exibição Dinâmica:**
    * Utiliza o componente **`FlatList`** para renderizar a lista de plantações registradas de forma eficiente.

---

## 🛠️ Stack Tecnológica

* **Linguagem:** JavaScript (ES6+)
* **Framework:** React Native
* **Ambiente:** Expo Web/CLI
* **Persistência:** `@react-native-async-storage/async-storage`
* **UI Components:** `@react-native-picker/picker`

---

## 🚀 Como Rodar o Projeto

Siga estes passos para configurar e executar o projeto na sua máquina e dispositivo móvel.

### Pré-Requisitos

Você precisa ter o **Node.js** e o **Expo CLI** instalados globalmente.

```bash
npm install -g expo-cli
