import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Block, Text, theme } from "galio-framework";
import { Image } from "react-native";

import Icon from "./Icon";
import materialTheme from "../constants/Theme";
import { Reduction } from "@tensorflow/tfjs";
import { GoGraph } from 'react-icons/go';

const proScreens = [
  "Woman",
  "Man",
  "Kids",
  "New Collection",
  "Sign In",
  "Sign Up"
];

class DrawerItem extends React.Component {
  renderIcon = () => {
    const { title, focused } = this.props;

    switch (title) {
      case "Home":
        return (
          <Image
          source={require('../assets/icons/icn_1.png')}
          style={[focused ? styles.drawerActive : styles.drawerInActive, { height: 25, width: 25 }]}
        />
        );
      case "Profile":
        return (
          <Image
          source={require('../assets/icons/icn_2.png')}
          style={[focused ? styles.drawerActive : styles.drawerInActive, { height: 25, width: 25 }]}
        />
        );
      case "Settings":
        return (
          <Image
          source={require('../assets/icons/icn_4.png')}
          style={[focused ? styles.drawerActive : styles.drawerInActive, { height: 25, width: 25 }]}
        />
        );
      case "Leaderboard":
        return (
          <Image
          source={require('../assets/icons/leaderboard.png')}
          style={[focused ? styles.drawerActive : styles.drawerInActive, { height: 25, width: 25 }]}
        />
        );
      case "Statistics":
        return (
          <Image
          source={require('../assets/icons/icn_3.png')}
          style={[focused ? styles.drawerActive : styles.drawerInActive, { height: 25, width: 25 }]}
        />
        );
      case "Sign In":
        return (
          <Image
          source={require('../assets/icons/sign-in.png')}
          style={[focused ? styles.drawerActive : styles.drawerInActive, { height: 25, width: 25 }]}
        />
        );
      case "Sign Up":
        return (
          <Image
          source={require('../assets/icons/sign-up.png')}
          style={[focused ? styles.drawerActive : styles.drawerInActive, { height: 25, width: 25 }]}
        />
        );
        case "Dashboard":
          return (
            <Image
            source={require('../assets/icons/icn_5.png')}
            style={[focused ? styles.drawerActive : styles.drawerInActive, { height: 25, width: 25 }]}
          />
          );
      default:
        return null;
    }
  };

  renderLabel = () => {
    const { title } = this.props;

    // if (proScreens.includes(title)) {
    //   return (
    //     <Block middle style={styles.pro}>
    //       <Text size={12} color="white">
    //         PRO
    //       </Text>
    //     </Block>
    //   );
    // }

    return null;
  };

  render() {
    const { focused, title, navigation } = this.props;
    const proScreen = proScreens.includes(title);
    return (
      <TouchableOpacity style={{ height: 55 }} onPress={() => {navigation.navigate(title)}}>
        <Block
          flex
          row
          style={[
            styles.defaultStyle,
            focused ? [styles.activeStyle, styles.shadow] : null
          ]}
        >
          <Block middle flex={0.1} style={{ marginRight: 28}}>
            {this.renderIcon()}
          </Block>
          <Block row center flex={0.9}>
            <Text
              size={18}
              color={
                focused
                  ? "white"
                  : proScreen
                  ? materialTheme.COLORS.MUTED
                  : "black"
              }
            >
              {title}
            </Text>
            {this.renderLabel()}
          </Block>
        </Block>
      </TouchableOpacity>
    );
  }
}

export default DrawerItem;

const styles = StyleSheet.create({
  defaultStyle: {
    paddingVertical: 16,
    paddingHorizontal: 16
  },
  activeStyle: {
    backgroundColor: materialTheme.COLORS.ACTIVE,
    borderRadius: 4
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 8,
    shadowOpacity: 0.2
  },
  pro: {
    backgroundColor: materialTheme.COLORS.LABEL,
    paddingHorizontal: 6,
    marginLeft: 8,
    borderRadius: 2,
    height: 16,
    width: 36
  },
  drawerActive: {
    tintColor: 'white'
  },
  drawerInActive: {
    tintColor: 'black'
  }
  });
