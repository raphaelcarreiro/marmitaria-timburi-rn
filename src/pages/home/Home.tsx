import React from 'react';
import AppBar from '../../components/appbar/Appbar';
import Typography from '../../components/bases/typography/Text';
import { useSelector } from '../../store/selector';
import { StyleSheet, View, ScrollView } from 'react-native';
import Button from '../../components/bases/button/Button';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../../routes/Routes';
import Header from './Header';
import Promotions from './promotions/Promotions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RestaurantStatus } from './styles';

const styles = StyleSheet.create({
  info: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 5,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
  },
  main: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  promotions: {
    marginTop: 20,
  },
  footer: {
    position: 'relative',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderColor: '#fafafa',
    borderTopWidth: 1,
  },
  flatList: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  status: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
});

type HomeProps = {
  navigation: DrawerNavigationProp<RootDrawerParamList>;
};

const Home: React.FC<HomeProps> = ({ navigation }) => {
  const restaurant = useSelector(state => state.restaurant);
  const promotions = useSelector(state => state.promotions);

  return (
    <View style={styles.container}>
      <AppBar title="início" />
      <ScrollView contentContainerStyle={{ flex: promotions.length > 0 ? 0 : 1 }}>
        <Header />
        {restaurant && (
          <>
            <View style={styles.info}>
              {restaurant.configs.delivery_time > 0 && (
                <Typography variant="caption" size={18}>
                  <Icon name="clock" size={16} /> {restaurant.configs.delivery_time} minutos
                </Typography>
              )}
              {restaurant.configs.order_minimum_value > 0 && restaurant.configs.tax_mode !== 'order_value' && (
                <Typography variant="caption">{restaurant.configs.formattedOrderMinimumValue} mínimo</Typography>
              )}
            </View>
            {promotions.length > 0 ? (
              <Promotions />
            ) : (
              <View style={styles.main}>
                <Button
                  color="primary"
                  variant={promotions.length > 0 ? 'text' : 'contained'}
                  onPress={() => navigation.navigate('Menu')}
                >
                  Acessar Cardápio
                </Button>
              </View>
            )}
          </>
        )}
      </ScrollView>
      <View style={styles.footer}>
        {restaurant && (
          <View style={styles.status}>
            <RestaurantStatus status={restaurant.is_open} />
            <Typography bold size={14}>
              {restaurant.is_open ? 'Aberto' : 'Fechado'}
            </Typography>
          </View>
        )}
        <Typography align="center" size={14} variant="caption">
          {restaurant?.working_hours}
        </Typography>
      </View>
    </View>
  );
};

export default Home;
