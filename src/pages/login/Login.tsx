import React from 'react';
import { Container } from './styles';
import { Image, StyleSheet, View, ScrollView } from 'react-native';
import { useSelector } from '../../store/selector';
import Title from '../../components/bases/typography/Text';
import Button from '../../components/bases/button/Button';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../../routes/Routes';
import { useApp } from '../../appContext';

const styles = StyleSheet.create({
  image: {
    width: 70,
    height: 70,
    marginBottom: 20,
  },
  title: {
    marginBottom: 20,
  },
  sigInActions: {
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    paddingBottom: 20,
    alignSelf: 'stretch',
  },
  signUp: {
    marginTop: 20,
    alignSelf: 'stretch',
  },
  goBack: {
    marginTop: 20,
  },
});

type LoginProps = {
  navigation: DrawerNavigationProp<RootDrawerParamList>;
};

const Login: React.FC<LoginProps> = ({ navigation }) => {
  const restaurant = useSelector(state => state.restaurant);
  const user = useSelector(state => state.user);
  const app = useApp();

  function handleBack() {
    if (!user) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });

      app.setRedirect(null);
      navigation.navigate('Home');
      return;
    }

    navigation.goBack();
  }

  return (
    <ScrollView contentContainerStyle={{ flex: 1 }} keyboardShouldPersistTaps="handled">
      <Container>
        {restaurant && (
          <>
            <Image source={{ uri: restaurant.image.imageUrl }} style={styles.image} />
            <View style={styles.title}>
              <Title size={24}>Como deseja continuar?</Title>
            </View>
            <View style={styles.sigInActions}>
              <Button color="primary" fullWidth onPress={() => navigation.navigate('Login', { screen: 'LoginEmail' })}>
                Entrar com e-mail ou telefone
              </Button>
            </View>
            <View style={styles.signUp}>
              <Button color="primary" fullWidth onPress={() => navigation.navigate('Login', { screen: 'Register' })}>
                Criar conta
              </Button>
            </View>
            <View style={styles.goBack}>
              <Button variant="text" fullWidth color="primary" onPress={handleBack}>
                Voltar
              </Button>
            </View>
          </>
        )}
      </Container>
    </ScrollView>
  );
};

export default Login;
