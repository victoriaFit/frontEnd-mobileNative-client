import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import userService from '../../../services/users';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    const data = await userService.login(email, password);
    if (data.access) {
      navigation.replace('Main');
    } else {
      // handle login error
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Test</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={handleSubmit} color="#FB5F21" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 28,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
    color: '#4a4a4a',
  },
  input: {
    height: 50,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 12,
    paddingLeft: 15,
    fontFamily: 'Poppins_400Regular',
    fontSize: 18,
    backgroundColor: 'white',
  },
  buttonContainer: {
    marginTop: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
});