import React from 'react';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { StyleSheet, ScrollView, View, Image } from 'react-native';
import { useTheme } from 'styled-components';
import { DrawerHeader, DrawerHeaderText } from './styles';
import { useSelector } from '../../store/selector';
import Icon from 'react-native-vector-icons/MaterialIcons';
import McIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../hooks/auth';
import Item from './DrawerItem';
import Avatar from '../avatar/Avatar';
import { useApp } from '../../appContext';
import Typography from '../bases/typography/Text';
import Button from '../bases/button/Button';

const styles = StyleSheet.create({
  label: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'sans-serif-light',
  },
  items: {
    marginTop: 8,
  },
  avatarImage: {
    height: '100%',
    width: '100%',
  },
});

const SIZE_ICON = 28;

const Drawer: React.FC<DrawerContentComponentProps> = props => {
  const theme = useTheme();
  const restaurant = useSelector(state => state.restaurant);
  const user = useSelector(state => state.user);
  const { logout } = useAuth();
  const { navigation } = props;
  const app = useApp();

  function handleLogout(): void {
    logout().then(() => {
      app.setRedirect(null);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    });
  }

  return (
    <ScrollView {...props} style={{ backgroundColor: theme.secondary }}>
      <DrawerHeader>
        <DrawerHeaderText>{restaurant ? restaurant.name : 'Carregando'}</DrawerHeaderText>
      </DrawerHeader>
      <View style={styles.items}>
        <Item
          label="início"
          Icon={<Icon name="home" color={theme.secondaryContrast} size={SIZE_ICON} />}
          onPress={() => navigation.navigate('Home')}
        />
        <Item
          Icon={<Icon color={theme.secondaryContrast} size={SIZE_ICON} name="local-offer" />}
          label="ofertas"
          onPress={() => navigation.navigate('Offers')}
        />
        <Item
          Icon={<Icon color={theme.secondaryContrast} size={SIZE_ICON} name="book" />}
          label="cardápio"
          onPress={() => navigation.navigate('Menu')}
        />
        <Item
          Icon={<Icon color={theme.secondaryContrast} size={SIZE_ICON} name="shopping-cart" />}
          label="carrinho"
          onPress={() => navigation.navigate('Cart')}
        />
        <Item
          Icon={<Icon color={theme.secondaryContrast} size={SIZE_ICON} name="contact-phone" />}
          label="fala comigo"
          onPress={() => navigation.navigate('Contact')}
        />
        {user ? (
          <>
            <Item
              Icon={<Icon color={theme.secondaryContrast} size={SIZE_ICON} name="assignment" />}
              label="meus pedidos"
              onPress={() => navigation.navigate('Orders')}
            />

            <Item
              Icon={
                user.image ? (
                  <Avatar>
                    <Image style={styles.avatarImage} source={{ uri: user.image.imageUrl }} />
                  </Avatar>
                ) : (
                  <Avatar>
                    <Icon name="person" size={24} color={theme.secondaryContrast} />
                  </Avatar>
                )
              }
              label={user.name}
              onPress={() => navigation.navigate('Account')}
            />
            <Item
              Icon={<McIcon color={theme.primary} size={SIZE_ICON} name="application-export" />}
              label="sair"
              onPress={handleLogout}
            />
          </>
        ) : (
          <Item
            Icon={<McIcon size={SIZE_ICON} color={theme.secondaryContrast} name="application-import" />}
            label="entrar"
            onPress={() => navigation.navigate('Login')}
          />
        )}
      </View>
      <View style={{ paddingTop: 30, paddingLeft: 15, alignItems: 'flex-start' }}>
        <Typography color="contrast" size={14}>
          Quer ter um app como esse?
        </Typography>
        <Button disableUpperCase disablePadding variant="text" color="primary">
          Entrar em contato
        </Button>
      </View>
    </ScrollView>
  );
};

export default Drawer;
