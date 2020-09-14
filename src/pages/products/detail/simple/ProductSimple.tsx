import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Modal from '../../../../components/modal/Modal';
import api from '../../../../services/api';
import Text from '../../../../components/bases/typography/Text';
import ProductAmount from '../ProductAmount';
import InsideLoading from '../../../../components/loading/InsideLoading';
import ImagePreview from '../../../../components/image-preview/ImagePreview';
import { View, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useProduct } from '../../productContext';
import { moneyFormat } from '../../../../helpers/numberFormat';
import { Product, Additional, Ingredient } from '../../../../@types/product';
import ProductAdd from '../ProductAdd';
import ProductSimpleAdditional from './additional/ProductSimpleAdditional';
import InputText from '../../../../components/bases/input/Input';
import ProductSimpleIngredients from './ingredients/ProductSimpleIngredient';
import { useTheme } from 'styled-components';

const styles = StyleSheet.create({
  footerActions: {
    position: 'absolute',
    bottom: 0,
    height: 80,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    justifyContent: 'flex-end',
  },
  imageContainer: {
    width: '100%',
    height: 175,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    marginBottom: 20,
    marginTop: 10,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 175,
  },
  inputContainer: {
    marginTop: 20,
  },
  productData: {
    alignItems: 'center',
  },
  oldPrice: {
    color: '#888',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    marginRight: 15,
  },
  modal: {
    paddingRight: 0,
    paddingLeft: 0,
  },
  scroll: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 70,
  },
  prices: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const ProductSimple: React.FC = () => {
  const { selectedProduct, handleSelectProduct, isSimple, handlePrepareProduct } = useProduct();
  const [amount, setAmount] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [additionalPrice, setAdditionalPrice] = useState(0);
  const [imagePreview, setImagePreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const total = useMemo(() => {
    if (!product) return 0;
    const productPrice = product.promotion_activated && product.special_price ? product.special_price : product.price;
    const total = (productPrice + additionalPrice) * amount;
    return moneyFormat(total);
  }, [additionalPrice, amount, product]);

  useEffect(() => {
    if (!product) return;
    handlePrepareProduct(product, amount);
  }, [amount, product, handlePrepareProduct]);

  useEffect(() => {
    if (!selectedProduct) return;
    api
      .get(`/products/${selectedProduct.id}`)
      .then(response => {
        const additional = response.data.additional.map((additional: Additional) => {
          additional.selected = false;
          additional.additional_id = additional.id;
          additional.formattedPrice = moneyFormat(additional.price);
          return additional;
        });

        const ingredients = response.data.ingredients.map((ingredient: Ingredient) => {
          ingredient.ingredient_id = ingredient.id;
          ingredient.selected = true;
          return ingredient;
        });

        setProduct({
          ...response.data,
          formattedPrice: moneyFormat(response.data.price),
          formattedSpecialPrice: moneyFormat(response.data.special_price),
          additional,
          ingredients,
          ready: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedProduct]);

  useEffect(() => {
    if (product) {
      setAdditionalPrice(
        product.additional.reduce((value, additional) => (additional.selected ? value + additional.price : value), 0),
      );
    }
  }, [product, amount]);

  function handleAmountUp() {
    setAmount(amount + 1);
  }

  function handleAmountDown() {
    if (amount > 1) {
      setAmount(amount - 1);
    }
  }

  function handleClickIngredient(ingredientId) {
    if (product)
      setProduct({
        ...product,
        ingredients: product.ingredients.map(ingredient => {
          if (ingredient.id === ingredientId) ingredient.selected = !ingredient.selected;
          return ingredient;
        }),
      });
  }

  function handleClickAdditional(additionalId: number) {
    if (product)
      setProduct({
        ...product,
        additional: product.additional.map(additional => {
          if (additional.id === additionalId) additional.selected = !additional.selected;
          return additional;
        }),
      });
  }

  function handleImagePreview() {
    setImagePreview(!imagePreview);
  }

  function handleModalClose() {
    handleSelectProduct(null);
  }

  return (
    <Modal open={isSimple} title="adicionar ao carrinho" handleClose={handleModalClose} style={styles.modal}>
      {loading ? (
        <InsideLoading />
      ) : (
        <>
          {product && (
            <ScrollView contentContainerStyle={styles.scroll}>
              <ImagePreview
                source={product.image.imageUrl}
                open={imagePreview}
                description={product.name}
                handleClose={handleImagePreview}
              />
              <TouchableOpacity onPress={handleImagePreview} style={styles.imageContainer}>
                <Image
                  source={{ uri: product.image.thumbImageUlr ? product.image.thumbImageUlr : product.image.imageUrl }}
                  style={styles.productImage}
                />
              </TouchableOpacity>
              <View style={styles.productData}>
                <Text align="center" size={24}>
                  {product.name}
                </Text>
                <Text variant="caption" align="center" gutterBottom>
                  {product.description}
                </Text>
                <View style={styles.prices}>
                  <Text
                    align="center"
                    size={product.special_price ? 16 : 20}
                    style={product.special_price ? styles.oldPrice : { color: theme.primary }}
                  >
                    {product.formattedPrice}
                  </Text>
                  {!!product.special_price && (
                    <Text align="center" color="primary" size={20}>
                      {product.formattedSpecialPrice}
                    </Text>
                  )}
                </View>
              </View>
              {product.additional.length > 0 && (
                <ProductSimpleAdditional
                  additional={product.additional}
                  handleClickAdditional={handleClickAdditional}
                />
              )}
              {product.ingredients.length > 0 && (
                <ProductSimpleIngredients
                  ingredients={product.ingredients}
                  handleClickIngredient={handleClickIngredient}
                />
              )}
              <View style={styles.inputContainer}>
                <InputText
                  label="Observação"
                  placeholder="Exemplo: quero com carne bem passada"
                  variant="outlined"
                  numberOfLines={5}
                  multiline
                  textAlignVertical="top"
                  autoCorrect
                  returnKeyType="done"
                  value={product.annotation}
                  onChange={event => setProduct({ ...product, annotation: event.nativeEvent.text })}
                />
              </View>
            </ScrollView>
          )}
          {product && (
            <View style={styles.footerActions}>
              <ProductAmount handleAmountDown={handleAmountDown} handleAmountUp={handleAmountUp} amount={amount} />
              <ProductAdd product={product} total={total} />
            </View>
          )}
        </>
      )}
    </Modal>
  );
};

export default ProductSimple;
