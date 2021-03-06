import React, { useReducer, useEffect, useState } from 'react';
import Modal from '../../../../components/modal/Modal';
import AddressForm from './AddressForm';
import AddressFormActions from './AddressFormActions';
import addressReducer, { setAddress, addressChange } from '../addressReducer';
import api from '../../../../services/api';
import { useMessage } from '../../../../hooks/message';
import { useDispatch } from 'react-redux';
import { updateCustomerAddress } from '../../../../store/modules/user/actions';
import Loading from '../../../../components/loading/Loading';
import * as yup from 'yup';
import { useSelector } from '../../../../store/selector';
import { ScrollView, StyleSheet } from 'react-native';
import { Address } from '../../../../@types/address';

interface AddressEditProps {
  address: Address | null;
  open: boolean;
  onExited(): void;
}

export interface AddressValidation {
  address?: string;
  number?: string;
  complement?: string;
  district?: string;
}

const styles = StyleSheet.create({
  modal: {
    paddingRight: 0,
    paddingLeft: 0,
  },
  scroll: {
    paddingLeft: 15,
    paddingRight: 15,
  },
});

const AddressEdit: React.FC<AddressEditProps> = ({ address, open, onExited }) => {
  const [editedAddress, addressDispatch] = useReducer(addressReducer, {} as Address);
  const [saving, setSaving] = useState(false);
  const [validation, setValidation] = useState<AddressValidation>({} as AddressValidation);
  const restaurant = useSelector(state => state.restaurant);
  const message = useMessage();
  const dispatch = useDispatch();

  useEffect(() => {
    if (address) addressDispatch(setAddress(address));
  }, [address]);

  function handleAddressChange(index: string, value: string): void {
    addressDispatch(addressChange(index, value));
  }

  function handleValidation() {
    const schema = yup.object().shape({
      complement: yup.string().nullable(),
      district: yup.string().test('check_config', 'Bairro é obrigatório', value => {
        if (restaurant?.configs.tax_mode !== 'district') {
          return !!value;
        } else return true;
      }),
      number: yup.string().required('O número é obrigatório'),
      address: yup.string().required('O endereço é obrigatório'),
    });

    schema
      .validate(editedAddress)
      .then(() => {
        handleSubmit();
        setValidation({} as AddressValidation);
      })
      .catch(err => {
        setValidation({
          [err.path]: err.message,
        });
      });
  }

  function handleSubmit(): void {
    setSaving(true);
    api
      .put(`/customerAddresses/${editedAddress.id}`, editedAddress)
      .then(response => {
        setSaving(false);
        dispatch(updateCustomerAddress(response.data));
        onExited();
      })
      .catch(err => {
        setSaving(false);
        if (err.response) message.handleOpen(err.response.data.error);
      });
  }

  function handleModalClose() {
    setValidation({} as AddressValidation);
    onExited();
  }

  return (
    <Modal
      title="alterar endereço"
      open={open}
      handleClose={handleModalClose}
      actions={<AddressFormActions saving={saving} handleSubmit={handleValidation} />}
      style={styles.modal}
    >
      {saving && <Loading />}
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>
        <AddressForm
          address={editedAddress}
          handleAddressChange={handleAddressChange}
          validation={validation}
          handleValidation={handleValidation}
        />
      </ScrollView>
    </Modal>
  );
};

export default AddressEdit;
