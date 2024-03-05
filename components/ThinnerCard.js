import React from 'react';
import { withNavigation } from '@react-navigation/compat';
import { StyleSheet, Dimensions, Image, TouchableWithoutFeedback } from 'react-native';
import { Block, Text, theme } from 'galio-framework';

const { width } = Dimensions.get('screen');


class ThinnerCard extends React.Component {
  render() {
    const { navigation, product, horizontal, full, style, priceColor, imageStyle } = this.props;
    const imageStyles = [styles.image, full ? styles.fullImage : styles.horizontalImage, imageStyle];

    return (
    <Block row={horizontal} card flex style={[styles.product, styles.shadow, style]}>
      <Block flex space="between" style={styles.productDescription}>
        <Text size={14} style={styles.productTitle}>{product.title}</Text>
        <Text size={12} style={styles.stat}>{product.stat}</Text>
      </Block>
    </Block>
    );
  }
}

export default withNavigation(ThinnerCard);

const styles = StyleSheet.create({
  product: {
    backgroundColor: theme.COLORS.WHITE,
    borderWidth: 0,
    height: 70,
  },
  enum: {
    bottom: -20,
    right: -15,
    fontSize: 20
  },
  productTitle: {
    flex: 1,
    flexWrap: 'wrap',
    bottom: -15,
    right: 85,
    fontSize: 20
  },
  stat: {
    bottom: 10,
    left: 90,
    fontSize: 15, 
    // color: '#287561'
    color: 'black'
  },
  productDescription: {
    padding: theme.SIZES.BASE / 2,
  },
  imageContainer: {
    elevation: 1,
  },
  image: {
    marginHorizontal: theme.SIZES.BASE / 2,
    marginTop: 10,
    right: -25,
  },
  horizontalImage: {
    height: 50,
    width: 50,
    borderRadius: 25
  },
  fullImage: {
    height: 40,
    width: width - theme.SIZES.BASE * 4,
    borderRadius: 15
  },
  rankingIconGreen: {
    left: 100,
    height: 15, 
    width: 15, 
    tintColor: 'green'
  },
  rankingIconRed: {
    left: 100,
    height: 15, 
    width: 15, 
    tintColor: 'red'
  },
  // shadow: {
  //   shadowColor: theme.COLORS.BLACK,
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowRadius: 4,
  //   shadowOpacity: 0.1,
  //   elevation: 2,
  // },
});
