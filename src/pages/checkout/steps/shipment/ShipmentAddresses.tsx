import React, { useState } from 'react';
import { Address } from '../../../../@types/address';
import Typography from '../../../../components/bases/typography/Text';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconButton from '../../../../components/bases/icon-button/IconButton';
import Options from '../../../../components/options/Options';
import { StyleSheet, Alert, View } from 'react-native';
import Button from '../../../../components/bases/button/Button';
import { useSelector } from '../../../../store/selector';
import { ListItemStyled } from '../style';
import McIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'styled-components';
import OptionsButton from '../../../../components/options/OptionsButton';

const styles = StyleSheet.create({
  iconButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  button: {
    marginBottom: 10,
  },
  tax: {
    marginTop: 7,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 26,
    width: 26,
    borderRadius: 13,
    position: 'absolute',
    right: 10,
  },
  listItem: {
    justifyContent: 'center',
  },
});

type ShipmentAddressesProps = {
  address: Address;
  setSelectedAddress(address: Address): void;
  openModalEditAddress(): void;
  handleConfirmDelete(): void;
  handleSelectAddress(address: Address): void;
};

const ShipmentAddresses: React.FC<ShipmentAddressesProps> = ({
  address,
  setSelectedAddress,
  openModalEditAddress,
  handleConfirmDelete,
  handleSelectAddress,
}) => {
  const [optionsShown, setOptionsShown] = useState(false);
  const restaurant = useSelector(state => state.restaurant);
  const order = useSelector(state => state.order);
  const theme = useTheme();

  function handleOptionsToggle() {
    setOptionsShown(!optionsShown);
  }

  function handleEditPress() {
    handleOptionsToggle();
    openModalEditAddress();
  }

  function handleDeletePress() {
    handleOptionsToggle();
    Alert.alert('Excluir', 'Você realmente deseja excluir esse endereço?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Sim',
        style: 'default',
        onPress: handleConfirmDelete,
      },
    ]);
  }

  function handleMorePress(address: Address) {
    setSelectedAddress(address);
    setOptionsShown(!optionsShown);
  }

  return (
    <>
      {optionsShown && (
        <Options open={true} handleClose={handleOptionsToggle}>
          <OptionsButton title="Alterar" onPress={handleEditPress} />
          <OptionsButton color="error" title="Excluir" onPress={handleDeletePress} />
        </Options>
      )}
      <ListItemStyled
        onPress={() => handleSelectAddress(address)}
        style={styles.listItem}
        selected={address.id === order.shipment.id}
        key={String(address.id)}
      >
        <Typography size={20}>
          {address.address}, {address.number}
        </Typography>
        <Typography>{address.district}</Typography>
        <Typography>
          {address.city}, {address.region}
        </Typography>
        {address.postal_code !== '00000000' && <Typography variant="caption">{address.postal_code}</Typography>}
        {restaurant?.configs.tax_mode === 'district' && address.area_region && address.area_region.tax > 0 && (
          <Typography variant="caption" style={styles.tax} size={14}>
            Taxa de entrega de {address.area_region.formattedTax}
          </Typography>
        )}
        {restaurant?.configs.tax_mode === 'distance' && !!address.distance_tax && address.distance_tax > 0 && (
          <Typography variant="caption" style={styles.tax} size={14}>
            Taxa de entrega de {address.formattedDistanceTax}
          </Typography>
        )}
        <IconButton
          style={styles.iconButton}
          onPress={() => handleMorePress(address)}
          Icon={<Icon name="more-vert" size={24} color="#666" />}
        />
        {address.id === order.shipment.id && (
          <View style={styles.iconContainer}>
            <McIcon name="check-circle" color={theme.primary} size={26} />
          </View>
        )}
      </ListItemStyled>
    </>
  );
};

export default ShipmentAddresses;
