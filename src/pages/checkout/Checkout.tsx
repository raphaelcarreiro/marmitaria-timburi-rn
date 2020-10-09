import React, { useState, useCallback, useMemo, useEffect } from 'react';
import AppBar from '../../components/appbar/Appbar';
import { StyleSheet, View, Linking, ScrollView } from 'react-native';
import Modal from '../../components/modal/Modal';
import Cart from '../../components/cart/Cart';
import CheckoutActions from './CheckoutActions';
import { useMessage } from '../../hooks/message';
import { useDispatch } from 'react-redux';
import { useSelector } from '../../store/selector';
import { RootDrawerParamList } from '../../routes/Routes';
import { steps as defaultSteps, StepIdTypes, StepOrderTypes, StepType } from './steps/steps';
import {
  setTax,
  setDiscount,
  setShipmentAddress,
  setCustomer,
  setPaymentMethod,
  setProducts,
  setCoupon,
  setChange,
  clearCard,
} from '../../store/modules/order/actions';
import { OrderShipment, CreatedOrder } from '../../@types/order';
import api from '../../services/api';
import { PaymentMethod } from '../../@types/paymentMethod';
import Loading from '../../components/loading/Loading';
import CheckoutSuccess from './CheckoutSuccess';
import CheckoutEmptyCart from './CheckoutEmptyCart';
import CheckoutButtons from './CheckoutButtons';
import CheckoutHeader from './CheckoutHeader';
import { CheckoutContext } from './checkoutContext';
import ShipmentMethod from './steps/shipment-method/ShipmentMethod';
import Shipment from './steps/shipment/Shipment';
import { Address } from '../../@types/address';
import Payment from './steps/payment/Payment';
import Confirm from './steps/confirm/Confirm';
import { clearCart } from '../../store/modules/cart/actions';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import Dialog from '../../components/dialog/Dialog';
import RestaurantClosed from './closed/RestaurantClosed';
import { useApp } from '../../appContext';
import { useIsFocused } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 56,
    position: 'relative',
    paddingBottom: 60,
  },
  scroll: {
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
  },
  modal: {
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
  },
});

type CheckoutProps = {
  navigation: DrawerNavigationProp<RootDrawerParamList>;
};

const Checkout: React.FC<CheckoutProps> = ({ navigation }) => {
  const messaging = useMessage();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const cart = useSelector(state => state.cart);
  const order = useSelector(state => state.order);
  const restaurant = useSelector(state => state.restaurant);
  const app = useApp();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<CreatedOrder | null>(null);
  const [steps, setSteps] = useState<StepType[]>(defaultSteps);
  const [isCardValid, setIsCardValid] = useState(false);
  const [cartVisibility, setCartVisiblity] = useState(false);
  const isFocused = useIsFocused();

  const currentStep = useMemo(() => {
    return steps.find(item => item.order === step);
  }, [step, steps]);

  const checkoutContextValue = {
    handleStepNext: handleStepNext,
    handleStepPrior: handleStepPrior,
    handleSubmitOrder: handleSubmitOrder,
    handleSetStep: handleSetStep,
    handleSetStepById: handleSetStepById,
    setIsCardValid: setIsCardValid,
    isCardValid,
    saving,
    createdOrder,
    step,
    paymentMethods,
  };

  const handleCartVisibility = useCallback(() => {
    setCartVisiblity(!cartVisibility);
  }, [cartVisibility]);

  const loadPaymentMethods = useCallback(() => {
    api
      .get('/order/paymentMethods')
      .then(response => {
        setPaymentMethods(response.data);
        const paymentMethods: PaymentMethod[] = response.data;
        const offline = paymentMethods.some(method => method.mode === 'offline');
        if (offline) dispatch(setPaymentMethod(response.data[0]));
      })
      .catch(err => {
        if (err.response) console.log('checkout loading order payments', err.response.data.error);
      });
  }, [dispatch]);

  useEffect(() => {
    if (!user && isFocused) {
      navigation.navigate('Login');
      app.setRedirect('Checkout');
    }
  }, [user, isFocused, navigation, app]);

  useEffect(() => {
    const onFocus = () => {
      if (!user) return;
      loadPaymentMethods();
    };

    navigation.addListener('focus', onFocus);
    navigation.addListener('blur', () => setStep(1));
  }, [navigation, loadPaymentMethods, app, user]);

  useEffect(() => {
    if (!restaurant) return;

    const { configs } = restaurant;

    let stepId: StepOrderTypes = 1;
    let newSteps = defaultSteps.slice();

    if (!configs.customer_collect) {
      newSteps = newSteps.filter(s => s.id !== 'STEP_SHIPMENT_METHOD');
    }

    if (order.shipment.shipment_method === 'customer_collect') {
      newSteps = newSteps.filter(s => s.id !== 'STEP_SHIPMENT');
    }

    setSteps(
      newSteps.map(step => {
        step.order = stepId;
        stepId++;
        return step;
      }),
    );
  }, [restaurant, order.shipment.shipment_method]);

  useEffect(() => {
    dispatch(setDiscount(cart.discount));
    dispatch(setCoupon(cart.coupon));
  }, [dispatch, cart.discount, cart.coupon]);

  useEffect(() => {
    dispatch(setProducts(cart.products));
    dispatch(setTax(cart.tax));
  }, [dispatch, cart.products, cart.tax]);

  useEffect(() => {
    if (!restaurant) return;

    if (
      cart.subtotal < restaurant.configs.order_minimum_value &&
      restaurant.configs.tax_mode !== 'order_value' &&
      currentStep?.id !== 'STEP_SUCCESS' &&
      cart.products.length > 0
    ) {
      messaging.handleOpen(`Valor mínimo do pedido deve ser ${restaurant.configs.formattedOrderMinimumValue}`);
      navigation.navigate('Menu');
    }
  }, [restaurant, cart.subtotal, cart.products, currentStep, navigation, messaging]);

  useEffect(() => {
    function setAddress(address: Address) {
      if (restaurant?.configs.tax_mode === 'district') {
        if (address && address.area_region)
          dispatch(
            setShipmentAddress({
              ...address,
              complement: address.address_complement,
              shipment_method: 'delivery',
              scheduled_at: null,
              formattedScheduledAt: null,
            }),
          );
        else dispatch(setShipmentAddress({} as OrderShipment));
        return;
      } else if (restaurant?.delivery_max_distance && address) {
        if (address.distance && address.distance <= restaurant?.delivery_max_distance)
          dispatch(
            setShipmentAddress({
              ...address,
              complement: address.address_complement,
              shipment_method: 'delivery',
              scheduled_at: null,
              formattedScheduledAt: null,
            }),
          );
        else dispatch(setShipmentAddress({} as OrderShipment));
        return;
      }

      if (address)
        dispatch(
          setShipmentAddress({
            ...address,
            complement: address.address_complement,
            shipment_method: 'delivery',
            scheduled_at: null,
            formattedScheduledAt: null,
          }),
        );
      else dispatch({} as OrderShipment);
    }

    if (user) {
      const customer = user.customer;
      const address = customer.addresses.find(address => address.is_main);

      dispatch(setCustomer(customer));
      if (address) setAddress(address);
    }
  }, [dispatch, restaurant, user]);

  function handleSubmitOrder() {
    if (restaurant)
      if (cart.subtotal < restaurant.configs.order_minimum_value && restaurant.configs.tax_mode !== 'order_value') {
        messaging.handleOpen(`Valor mínimo do pedido deve ser ${restaurant.configs.formattedOrderMinimumValue}`);
        return;
      }

    setSaving(true);
    api
      .post('/orders', order)
      .then(response => {
        setCreatedOrder(response.data);

        if (response.data.picpay_payment) {
          Linking.canOpenURL(response.data.picpay_payment.payment_url).then(supported => {
            if (supported) Linking.openURL(response.data.picpay_payment.payment_url);
            else console.log('It is not possible open url');
          });
        }
        dispatch(setChange(0));
        dispatch(clearCard());
        dispatch(clearCart());
        handleStepNext();
      })
      .catch(err => {
        if (err.response) messaging.handleOpen(err.response.data.error);
      })
      .finally(() => {
        setSaving(false);
      });
  }

  async function handleStepNext() {
    if (currentStep?.id === 'STEP_SHIPMENT') {
      if (!order.shipment.id) {
        messaging.handleOpen('Informe o endereço');
        return;
      }
    } else if (currentStep?.id === 'STEP_PAYMENT') {
      if (!order.paymentMethod) {
        messaging.handleOpen('Selecione uma forma de pagamento');
        return;
      }
    }
    setStep(step + 1);
  }

  function handleStepPrior() {
    if (step > 1) setStep(step - 1);
  }

  function handleSetStep(step: StepOrderTypes) {
    if (step < 1 || step > 4) return;
    setStep(step);
  }

  function handleSetStepById(id: StepIdTypes) {
    const step = steps.find(s => s.id === id);
    if (step) setStep(step.order);
  }

  function stylesForShipmentMethodStep() {
    return currentStep?.id === 'STEP_SHIPMENT_METHOD'
      ? {
          flex: 1,
        }
      : undefined;
  }

  return (
    <>
      <AppBar title="Finalizar pedido" actions={<CheckoutActions handleCartVisilibity={handleCartVisibility} />} />
      {cartVisibility && (
        <Modal style={styles.modal} open={cartVisibility} handleClose={handleCartVisibility} title="Carrinho">
          <Cart />
        </Modal>
      )}
      {restaurant && !restaurant.is_open && isFocused && (
        <Dialog open={true} handleClose={() => navigation.navigate('Menu')}>
          <RestaurantClosed />
        </Dialog>
      )}
      {currentStep?.id === 'STEP_SUCCESS' ? (
        <CheckoutContext.Provider value={checkoutContextValue}>
          <CheckoutSuccess />
        </CheckoutContext.Provider>
      ) : cart.products.length === 0 ? (
        <CheckoutEmptyCart />
      ) : (
        <CheckoutContext.Provider value={checkoutContextValue}>
          <View style={styles.container}>
            <ScrollView
              style={styles.scroll}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={stylesForShipmentMethodStep()}
            >
              <CheckoutHeader currentStep={currentStep} />
              {currentStep?.id === 'STEP_SHIPMENT_METHOD' ? (
                <ShipmentMethod />
              ) : currentStep?.id === 'STEP_SHIPMENT' ? (
                <Shipment />
              ) : currentStep?.id === 'STEP_PAYMENT' ? (
                <Payment />
              ) : (
                currentStep?.id === 'STEP_CONFIRM' && <Confirm />
              )}
            </ScrollView>
            {currentStep?.id !== 'STEP_SHIPMENT_METHOD' && (
              <CheckoutButtons currentStep={currentStep} stepsAmount={steps.length} />
            )}
          </View>
        </CheckoutContext.Provider>
      )}
      {saving && <Loading />}
    </>
  );
};

export default Checkout;
