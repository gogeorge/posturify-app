import React from 'react';
import { withNavigation } from '@react-navigation/compat';
import { StyleSheet, Dimensions, Image } from 'react-native';
import { Block, Text, Button, theme } from 'galio-framework';

import materialTheme from '../constants/Theme';
import { TouchableOpacity } from 'react-native-gesture-handler';


const { width } = Dimensions.get('screen');

class ThinCard extends React.Component {
  handleAddFriend(name) {
    console.log("name:: " + name)
  }
  render() {
    const { navigation, product, horizontal, full, style, priceColor, imageStyle } = this.props;
    const imageStyles = [styles.image, full ? styles.fullImage : styles.horizontalImage, imageStyle];
    return (
    <Block row={horizontal} card flex style={[styles.product, styles.shadow, style]}>
      <Text style={styles.enum}>{product.count}</Text>
      <Block flex style={[styles.imageContainer, styles.shadow]}>
        <Image source={{ uri: product.image }} style={imageStyles} />
      </Block>
      <Block flex space="between" style={styles.productDescription}>
        <Text size={14} style={styles.productTitle}>{product.title}</Text>
        <Text size={12} style={styles.stat}>{product.stat}</Text>
        {
          product.triangle == 'true' ? (
            <Image
              source={require('../assets/icons/triangle_up.png')}
              style={styles.rankingIconGreen}
            />
          ) : product.triangle == 'false' ? (
            <Image
              source={require('../assets/icons/triangle_down.png')}
              style={[styles.rankingIconRed]}
          />
          ) : null
        }

        {
          product.friendBtn ? (
            <TouchableOpacity onPress={this.handleAddFriend(product.title)}>
              <Image
                source={require('../assets/icons/sign-up.png')}
                style={[styles.addFriend]
                }
              />
            </TouchableOpacity>

          ) : null
        }

      </Block>
    </Block>
    );
  }
}

export default withNavigation(ThinCard);

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
  addFriend: {
    left: 100,
    height: 20, 
    width: 20, 
    tintColor: '#44c8a4',
    top: -15
  },
  // shadow: {
  //   shadowColor: theme.COLORS.BLACK,
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowRadius: 4,
  //   shadowOpacity: 0.1,
  //   elevation: 2,
  // },
});










// import React from 'react';
// import { withNavigation } from '@react-navigation/compat';
// import { StyleSheet, Dimensions, Image, TouchableWithoutFeedback } from 'react-native';
// import { Block, Text, theme } from 'galio-framework';

// const { width } = Dimensions.get('screen');

// class ThinCard extends React.Component {
//   render() {
//     const { navigation, product, horizontal, full, style, priceColor, imageStyle } = this.props;
//     const imageStyles = [styles.image, full ? styles.fullImage : styles.horizontalImage, imageStyle];

//     return (
//     <Block row={horizontal} card flex style={[styles.product, styles.shadow, style]}>
//       <Block flex style={[styles.imageContainer, styles.shadow]}>
//         <Image source={{ uri: product.image }} style={imageStyles} />
//       </Block>
//       <Block flex space="between" style={styles.productDescription}>
//         <Text size={14} style={styles.productTitle}>{product.title}</Text>
//         <Text size={12} style={styles.stat}>{product.stat}</Text>
//       </Block>
//     </Block>
//     );
//   }
// }

// export default withNavigation(ThinCard);

// const styles = StyleSheet.create({
//   product: {
//     backgroundColor: theme.COLORS.WHITE,
//     // marginVertical: theme.SIZES.BASE / 3,
//     borderWidth: 0,
//     height: 70,
//   },
//   productTitle: {
//     flex: 1,
//     flexWrap: 'wrap',
//     bottom: -15,
//     right: 90,
//     fontSize: 20
//   },
//   stat: {
//     bottom: 15,
//     left: 90,
//     fontSize: 15, 
//     color: '#287561'
//   },
//   productDescription: {
//     padding: theme.SIZES.BASE / 2,
//   },
//   imageContainer: {
//     elevation: 1,
//   },
//   image: {
//     marginHorizontal: theme.SIZES.BASE / 2,
//     marginTop: 10,
//     right: -15,
//   },
//   horizontalImage: {
//     height: 50,
//     width: 50,
//     borderRadius: 25
//   },
//   fullImage: {
//     height: 40,
//     width: width - theme.SIZES.BASE * 4,
//     borderRadius: 15
//   },
//   // shadow: {
//   //   shadowColor: theme.COLORS.BLACK,
//   //   shadowOffset: { width: 0, height: 2 },
//   //   shadowRadius: 4,
//   //   shadowOpacity: 0.1,
//   //   elevation: 2,
//   // },
// });

////////////////////////////////////////////////////////////////////////////////////////////////////////

// import React from 'react';
// import { withNavigation } from '@react-navigation/compat';
// import { StyleSheet, Dimensions, Image, TouchableWithoutFeedback } from 'react-native';
// import { Block, Text, theme } from 'galio-framework';

// const { width } = Dimensions.get('screen');

// class ThinCard extends React.Component {
//   render() {
//     const { navigation, product, horizontal, full, style, priceColor, imageStyle } = this.props;
//     const imageStyles = [styles.image, full ? styles.fullImage : styles.horizontalImage, imageStyle];

//     return (
//     <Block row={horizontal} card flex style={[styles.product, styles.shadow, style]}>
//       <Block flex style={[styles.imageContainer, styles.shadow]}>
//         <Image source={{ uri: product.image }} style={imageStyles} />
//       </Block>
//       <Block flex space="between" style={styles.productDescription}>
//         <Text size={14} style={styles.productTitle}>{product.title}</Text>
//         <Text size={12} muted={!priceColor} color={priceColor}>{product.stat}</Text>
//       </Block>
//     </Block>
//     );
//   }
// }

// export default withNavigation(ThinCard);

// const styles = StyleSheet.create({
//   product: {
//     backgroundColor: theme.COLORS.WHITE,
//     marginVertical: theme.SIZES.BASE / 2,
//     borderWidth: 0,
//     height: 70,
//   },
//   productTitle: {
//     flex: 1,
//     flexWrap: 'wrap',
//     paddingBottom: 6,
//   },
//   productDescription: {
//     padding: theme.SIZES.BASE / 2,
//   },
//   imageContainer: {
//     elevation: 1,
//   },
//   image: {
//     borderRadius: 3,
//     marginHorizontal: theme.SIZES.BASE / 2,
//     marginTop: 10,
//   },
//   horizontalImage: {
//     height: 50,
//     width: 50,
//     borderRadius: 25
//   },
//   fullImage: {
//     height: 40,
//     width: width - theme.SIZES.BASE * 4,
//     borderRadius: 15
//   },
//   shadow: {
//     shadowColor: theme.COLORS.BLACK,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     shadowOpacity: 0.1,
//     elevation: 2,
//   },
// });