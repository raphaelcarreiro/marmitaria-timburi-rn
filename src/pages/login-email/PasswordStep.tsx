import React, { useState } from 'react';
import Title from '../../components/bases/typography/Text';
import TextInput from '../../components/bases/input/Input';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface PasswordStepProps {
  password: string;
  setPassword(value: string): void;
  name: string;
  validation?: string;
  handleValidation(): void;
}

const PasswordStep: React.FC<PasswordStepProps> = ({ password, setPassword, name, validation, handleValidation }) => {
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  function handleVisibility() {
    setPasswordVisibility(oldVisibility => !oldVisibility);
  }

  return (
    <>
      <Title size={16}>Olá {name}!</Title>
      <TextInput
        autoFocus
        error={!!validation}
        helperText={validation}
        placeholder="Sua senha"
        fullWidth
        value={password}
        onChange={text => setPassword(text.nativeEvent.text)}
        returnKeyType="send"
        onSubmitEditing={handleValidation}
        secureTextEntry={!passwordVisibility}
        Icon={
          !passwordVisibility ? (
            <Icon name="visibility" size={26} onPress={handleVisibility} />
          ) : (
            <Icon name="visibility-off" size={26} onPress={handleVisibility} />
          )
        }
      />
    </>
  );
};

export default PasswordStep;
