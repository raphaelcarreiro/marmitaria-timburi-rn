import React, { useState, useRef, useEffect } from 'react';
import Input from '../../components/bases/input/Input';
import { UserValidation } from './Register';
import Text from '../../components/bases/typography/Text';
import { Image, StyleSheet, TextInput } from 'react-native';
import { useSelector } from '../../store/selector';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { UserRegister } from '../../context-api/user/types';

const styles = StyleSheet.create({
  image: {
    width: 70,
    height: 70,
    marginBottom: 10,
  },
});

interface RegisterFormProps {
  user: UserRegister;
  handleChange(index: string, value: string): void;
  validation: UserValidation;
  handleSubmit(): void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ user, handleChange, validation, handleSubmit }) => {
  const restaurant = useSelector(state => state.restaurant);
  const [passVis, setPassVis] = useState(false);
  const [confirmPassVis, setConfirmPassVis] = useState(false);

  const inputRefs = {
    name: useRef<TextInput>(null),
    phone: useRef<TextInput>(null),
    email: useRef<TextInput>(null),
    password: useRef<TextInput>(null),
    passwordConfirm: useRef<TextInput>(null),
  };

  useEffect(() => {
    const [key] = Object.keys(validation) as Array<keyof typeof validation>;
    if (!key) return;

    inputRefs[key].current?.focus();
  }, [validation, inputRefs]);

  function handleVisibility(field: string): void {
    if (field === 'password') setPassVis(!passVis);
    if (field === 'confirmPassword') setConfirmPassVis(!confirmPassVis);
  }

  return (
    <>
      {restaurant && <Image source={{ uri: restaurant.image.imageUrl }} style={styles.image} />}
      <Text size={22} bold gutterBottom>
        Criar conta
      </Text>
      <Text>É rapidinho, complete os 5 campos abaixo.</Text>
      <Input
        ref={inputRefs.name}
        error={!!validation.name}
        helperText={validation.name}
        autoCapitalize="words"
        fullWidth
        placeholder="Digite seu nome"
        label="Nome"
        variant="standard"
        value={user.name}
        onChange={event => handleChange('name', event.nativeEvent.text)}
        autoCompleteType="name"
        returnKeyType="next"
        onSubmitEditing={() => inputRefs.phone.current?.focus()}
        autoFocus
        blurOnSubmit={false}
      />
      <Input
        ref={inputRefs.phone}
        keyboardType="number-pad"
        error={!!validation.phone}
        helperText={validation.phone}
        fullWidth
        placeholder="Digite seu telefone"
        variant="standard"
        label="Telefone"
        value={user.phone}
        onChange={event => handleChange('phone', event.nativeEvent.text)}
        autoCompleteType="tel"
        returnKeyType="next"
        onSubmitEditing={() => inputRefs.email.current?.focus()}
        blurOnSubmit={false}
      />
      <Input
        ref={inputRefs.email}
        error={!!validation.email}
        helperText={validation.email}
        fullWidth
        placeholder="Digite seu e-mail"
        variant="standard"
        label="E-mail"
        value={user.email}
        onChange={event => handleChange('email', event.nativeEvent.text)}
        keyboardType="email-address"
        autoCompleteType="email"
        autoCapitalize="none"
        returnKeyType="next"
        onSubmitEditing={() => inputRefs.password.current?.focus()}
        blurOnSubmit={false}
      />
      <Input
        ref={inputRefs.password}
        error={!!validation.password}
        helperText={validation.password}
        fullWidth
        placeholder="Digite sua senha"
        variant="standard"
        label="Senha"
        value={user.password}
        onChange={event => handleChange('password', event.nativeEvent.text)}
        secureTextEntry={!passVis}
        textContentType="newPassword"
        Icon={
          !passVis ? (
            <Icon name="visibility" size={26} onPress={() => handleVisibility('password')} color="#666" />
          ) : (
            <Icon name="visibility-off" size={26} onPress={() => handleVisibility('password')} color="#666" />
          )
        }
        returnKeyType="next"
        onSubmitEditing={() => inputRefs.passwordConfirm.current?.focus()}
        blurOnSubmit={false}
      />
      <Input
        ref={inputRefs.passwordConfirm}
        error={!!validation.passwordConfirm}
        helperText={validation.passwordConfirm}
        fullWidth
        placeholder="Digite sua senha novamente"
        variant="standard"
        label="Confirmação da senha"
        value={user.passwordConfirm}
        onChange={event => handleChange('passwordConfirm', event.nativeEvent.text)}
        secureTextEntry={!confirmPassVis}
        returnKeyType="send"
        onSubmitEditing={handleSubmit}
        textContentType="newPassword"
        Icon={
          !confirmPassVis ? (
            <Icon name="visibility" size={26} onPress={() => handleVisibility('confirmPassword')} color="#666" />
          ) : (
            <Icon name="visibility-off" size={26} onPress={() => handleVisibility('confirmPassword')} color="#666" />
          )
        }
      />
    </>
  );
};

export default RegisterForm;
