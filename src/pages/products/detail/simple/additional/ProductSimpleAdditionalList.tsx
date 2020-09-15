import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Additional } from '../../../../../@types/product';
import Typography from '../../../../../components/bases/typography/Text';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'styled-components';
import { ListItemStyled } from '../../style';

type AdditionalListProps = {
  handleClick(additionalId: number): void;
  additional: Additional;
};

const styles = StyleSheet.create({
  listItem: {
    elevation: 0,
    borderWidth: 0,
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

const ProductSimpleAdditionalList: React.FC<AdditionalListProps> = ({ additional, handleClick }) => {
  const theme = useTheme();

  return (
    <ListItemStyled selected={additional.selected} style={styles.listItem} onPress={() => handleClick(additional.id)}>
      <Typography gutterBottom>{additional.name}</Typography>
      {additional.price > 0 && (
        <Typography bold color="primary">
          + {additional.formattedPrice}
        </Typography>
      )}
      {additional.selected && (
        <View style={styles.iconContainer}>
          <Icon name="check-circle" color={theme.primary} size={26} />
        </View>
      )}
    </ListItemStyled>
  );
};

export default ProductSimpleAdditionalList;
