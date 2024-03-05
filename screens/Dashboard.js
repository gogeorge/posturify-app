import React from 'react';
import { StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Button, Block, Text, Input, theme } from 'galio-framework';

import { Icon, Product } from '../components/';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useNavigation, useNavigationBuilder } from '@react-navigation/native';

const { width } = Dimensions.get('screen');
// import products from '../constants/products';

const products = [
    {
      title: 'View Subscription Plan',
      image: 'https://source.unsplash.com/dS2hi__ZZMk/840x840',
      stat: 'Current: Business Pro+',
      horizontal: true,
    },
    {
      title: 'Set Reminders',
      image: 'https://source.unsplash.com/dS2hi__ZZMk/840x840',
      stat: 'Last Reminder: Dont forget lunch break',
    },
    {
      title: 'Manage Employees',
      image: 'https://source.unsplash.com/YHbcum51JB0/840x840',
      stat: 'Total Employees: 24',
    },
    {
      title: 'Internet of Things (IoT) is Here to Stay',
      image: 'https://source.unsplash.com/I7BSOoPa5hM/840x840',
      stat: 188,
    },
    {
      title: 'Monitor Company Activities',
      image: 'https://source.unsplash.com/Ws4wd-vJ9M0/840x840',
      stat: 'Average Posture: 90%',
    },
  ];  

export default class DashBoard extends React.Component {
  renderTabs = () => {
    const { navigation } = this.props;

    return (
      <Block row style={styles.tabs}>
        <Button shadowless style={[styles.tab, styles.divider]} onPress={() => navigation.navigate('Pro')}>
          <Block row middle>
            <Icon name="grid" family="feather" style={{ paddingRight: 8 }} />
            <Text size={16} style={styles.tabTitle}>Categories</Text>
          </Block>
        </Button>
        <Button shadowless style={styles.tab} onPress={() => navigation.navigate('Pro')}>
          <Block row middle>
            <Icon size={16} name="camera-18" family="GalioExtra" style={{ paddingRight: 8 }} />
            <Text size={16} style={styles.tabTitle}>Best Deals</Text>
          </Block>
        </Button>
      </Block>
    )
  }

  renderProducts = () => {
    const { navigation } = this.props;

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.products}>
        <Block flex>
          <Product product={products[4]} full />
          <Product product={products[0]} horizontal />
          <TouchableWithoutFeedback onPress={() => navigation.navigate('ManageEmployees')}>
                <Product product={products[2]} />
            </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => navigation.navigate('SetReminders')}>
            <Product product={products[1]} style={{ marginRight: theme.SIZES.BASE }} />
          </TouchableWithoutFeedback>
          <Product product={products[3]} horizontal />
        </Block>
      </ScrollView>
    )
  }

  render() {
    return (
      <Block flex center style={styles.home}>
        {/* {this.renderTabs()} */}
        {this.renderProducts()}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width,    
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
  },
  header: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    elevation: 4,
    zIndex: 2,
  },
  tabs: {
    marginBottom: 24,
    marginTop: 10,
    elevation: 4,
  },
  tab: {
    backgroundColor: theme.COLORS.TRANSPARENT,
    width: width * 0.50,
    borderRadius: 0,
    borderWidth: 0,
    height: 24,
    elevation: 0,
  },
  tabTitle: {
    lineHeight: 19,
    fontWeight: '300'
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.MUTED,
  },
  products: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE * 2,
    marginTop: -55
  },
});
