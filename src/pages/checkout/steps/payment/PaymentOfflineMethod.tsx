import React from 'react';
import { PaymentMethod } from '../../../../@types/paymentMethod';
import { ListItemStyled } from '../style';
import Typography from '../../../../components/bases/typography/Text';
import { useSelector } from '../../../../store/selector';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import McIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'styled-components';
import { useDispatch } from 'react-redux';
import { setPaymentMethod } from '../../../../store/modules/order/actions';
import { useCheckout } from '../../checkoutContext';
import { moneyFormat } from '../../../../helpers/numberFormat';

const styles = StyleSheet.create({
  listItem: {
    minHeight: 80,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 35,
    marginRight: 10,
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
});

type PaymentOfflineMethodProps = {
  paymentMethod: PaymentMethod;
  openModalChange(): void;
};

const PaymentOfflineMethod: React.FC<PaymentOfflineMethodProps> = ({ paymentMethod, openModalChange }) => {
  const order = useSelector(state => state.order);
  const theme = useTheme();
  const dispatch = useDispatch();
  const checkout = useCheckout();

  function handlePress(paymentMethod: PaymentMethod) {
    dispatch(setPaymentMethod(paymentMethod));

    if (paymentMethod.kind === 'money') {
      openModalChange();
      return;
    }

    checkout.handleSetStepById('STEP_CONFIRM');
  }

  return (
    <>
      <ListItemStyled
        onPress={() => handlePress(paymentMethod)}
        style={styles.listItem}
        selected={paymentMethod.id === order.paymentMethod?.id}
      >
        <View style={[styles.avatar, { borderColor: theme.primary }]}>
          {paymentMethod.kind === 'card' && <Icon color={theme.primary} name="credit-card" size={20} />}
          {paymentMethod.kind === 'money' && <Icon color={theme.primary} name="attach-money" size={20} />}
        </View>
        <View>
          <Typography>{paymentMethod.method}</Typography>
          {order.paymentMethod && (
            <>
              {order.change > 0 && paymentMethod.kind === 'money' && (
                <Typography variant="caption">Troco para {order.formattedChange}</Typography>
              )}
            </>
          )}
        </View>
        {paymentMethod.id === order.paymentMethod?.id && (
          <View style={styles.iconContainer}>
            <McIcon name="check-circle" color={theme.primary} size={26} />
          </View>
        )}
      </ListItemStyled>
    </>
  );
};

export default PaymentOfflineMethod;
