import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import ListItem from '../../components/list-item/ListItem';
import { Product } from '../../@types/product';
import Text from '../../components/bases/typography/Text';
import { useTheme } from 'styled-components';
import { useProduct } from './productContext';

const styles = StyleSheet.create({
  listItem: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  text: {
    fontSize: 18,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 4,
  },
  hasComplement: {
    marginTop: 7,
  },
  dataText: {
    maxWidth: 200,
  },
  priceContent: {
    flexDirection: 'row',
    marginTop: 7,
    alignItems: 'center',
  },
  oldPrice: {
    color: '#888',
    marginRight: 10,
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
});

interface ProductItemProps {
  product: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const theme = useTheme();
  const { handleSelectProduct } = useProduct();

  return (
    <ListItem style={styles.listItem} onPress={() => handleSelectProduct(product)}>
      <View style={styles.dataText}>
        <Text size={22} gutterBottom>
          {product.name}
        </Text>
        <Text size={14} variant="caption">
          {product.description}
        </Text>
        {product.price > 0 && (
          <View style={styles.priceContent}>
            <Text
              size={product.special_price ? 16 : 20}
              style={product.special_price ? styles.oldPrice : { color: theme.primary }}
            >
              {product.formattedPrice}
            </Text>
            {!!product.special_price && (
              <Text color="primary" size={20}>
                {product.formattedSpecialPrice}
              </Text>
            )}
          </View>
        )}
        {product.category.has_complement && (
          <Text style={styles.hasComplement} color="primary">
            Monte esse produto
          </Text>
        )}
      </View>
      {product.image && <Image source={{ uri: product.image.imageUrl }} style={styles.image} />}
    </ListItem>
  );
};

export default ProductItem;
