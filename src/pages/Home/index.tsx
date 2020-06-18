import React, { useState, useEffect } from "react";

import { Feather as Icon } from "@expo/vector-icons";
import axios from "axios";
import {
  View,
  ImageBackground,
  Image,
  StyleSheet,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

interface IBGEUFResponse {
  sigla: string;
  nome: string;
}

interface IPicker {
  value: string;
  label: string;
}

const Home = () => {
  const navigation = useNavigation();
  const [ufs, setUfs] = useState<IPicker[]>([]);
  const [selectedUf, setSelectedUf] = useState("");
  const [cities, setCities] = useState<IPicker[]>([]);
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
      )
      .then((response) => {
        const ufInitials = response.data.map((uf) => uf.sigla);
        ufInitials.map((uf) => {
          setUfs((prevState) => [...prevState, { value: uf, label: uf }]);
        });
      });
  }, []);

  useEffect(() => {
    console.log("entrou");
    axios
      .get<IBGEUFResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/distritos?orderBy=nome`
      )
      .then((response) => {
        const citiesInitials = response.data;
        citiesInitials.map((city) => {
          console.log("entrou");
          setCities((prevState) => [
            ...prevState,
            { value: city.nome, label: city.nome },
          ]);
        });
      });
  }, [selectedUf]);

  console.log(selectedUf);

  function handleNavigationToPoints() {
    navigation.navigate("Points", {
      selectedUf,
      selectedCity,
    });
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ImageBackground
        style={styles.container}
        source={require("../../assets/home-background.png")}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require("../../assets/logo.png")} />
          <View>
            <Text style={styles.title}>
              Seu marketplace de coleta de resíduos
            </Text>
            <Text style={styles.description}>
              Ajudamos pessoas a encontrarem pontos de coleta de forma
              eficiente.
            </Text>
          </View>
        </View>
        <View style={styles.footer}>
          <RNPickerSelect
            placeholder={{
              label: "Selecione uma UF",
            }}
            onValueChange={(value: string) =>
              setSelectedUf((PrevState) => {
                if (PrevState !== value) {
                  setSelectedCity("");
                }
                return value;
              })
            }
            items={ufs}
            style={{
              viewContainer: { ...styles.select },
            }}
          />
          <RNPickerSelect
            placeholder={{
              label: "Selecione uma cidade",
            }}
            onValueChange={(value: string) => setSelectedCity(value)}
            items={cities}
            style={{
              viewContainer: { ...styles.select },
            }}
          />

          <RectButton style={styles.button} onPress={handleNavigationToPoints}>
            <View style={styles.buttonIcon}>
              <Icon name="arrow-right" color="#fff" size={24} />
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: "#322153",
    fontSize: 32,
    fontFamily: "Ubuntu_700Bold",
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 16,
    fontFamily: "Roboto_400Regular",
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    justifyContent: "center",
    paddingLeft: 8,
    fontSize: 16,
  },

  input: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    fontSize: 16,
    paddingHorizontal: 16,
  },

  button: {
    backgroundColor: "#34CB79",
    height: 60,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    color: "#FFF",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },
});

export default Home;
