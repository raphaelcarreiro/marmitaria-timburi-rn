import React from 'react';
import { StyleSheet, View } from 'react-native';
import Typography from '../../../components/bases/typography/Text';
import { CreatedOrder } from '../../../@types/order';

const styles = StyleSheet.create({
  section: {
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingTop: 15,
    paddingBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 7,
  },
});

type OrderTotalProps = {
  order: CreatedOrder;
};

const OrderTotal: React.FC<OrderTotalProps> = ({ order }) => {
  return (
    <>
      <View style={styles.section}>
        <View style={styles.row}>
          <Typography>Subtotal</Typography>
          <Typography>{order.formattedSubtotal}</Typography>
        </View>
        <View style={styles.row}>
          <Typography>Desconto</Typography>
          <Typography>{order.formattedDiscount}</Typography>
        </View>
        <View style={styles.row}>
          <Typography>Taxa de entrega</Typography>
          <Typography>{order.formattedTax}</Typography>
        </View>
        <View style={styles.row}>
          <Typography>Total</Typography>
          <Typography bold size={22}>
            {order.formattedTotal}
          </Typography>
        </View>
      </View>
    </>
  );
};

export default OrderTotal;
