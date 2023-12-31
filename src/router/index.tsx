import { NavigationContainer, DefaultTheme, createNavigationContainerRef } from '@react-navigation/native';
import { getGenericPassword } from 'react-native-keychain';
import { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { adaptNavigationTheme } from 'react-native-paper';
import useSysLanguage from '@hooks/useSysLanguage';
import { RootStackParamList } from './type';
import Demo from '@pages/demoScreen/index';
import IM from '@pages/demoScreen/im/index';
import AnimatedScreen from '@pages/demoScreen/animated';
import Carouseldemo from '@pages/demoScreen/carousel';
import CustomNavigationBar from '@components/appBar/customNavigationBar';
import HomeTabs from './HomeTabs';
import LoginGroup from './LoginGroup';
import Homegroup from './homegroup';
import UserGroup from './usergroup';
import FightGroup from './fightgroup';

import BlurviewDEmo from '@pages/demoScreen/blurview';
import CouponsModal from '@pages/mainScreen/user/coupons/modal';
import { useTranslation } from 'react-i18next';

const initialRouteName: keyof RootStackParamList = 'HomeTabs';
export const navigationRef = createNavigationContainerRef<RootStackParamList>();
export const Stack = createStackNavigator<RootStackParamList>();
const { DarkTheme } = adaptNavigationTheme({ reactNavigationDark: DefaultTheme });
const AppNavigator = () => {
  useSysLanguage();



  return (
    <NavigationContainer theme={DarkTheme} ref={navigationRef}>
      <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{
        header: props => <CustomNavigationBar {...props} />,
        headerTransparent: true,
        // animation: 'none',
      }}>

        <Stack.Screen name="Demo" component={Demo} />
        <Stack.Screen name="IM" component={IM} />
        <Stack.Screen name="Animated" component={AnimatedScreen} />
        <Stack.Screen name="Carouseldemo" component={Carouseldemo} />
        <Stack.Screen name="BlurviewDEmo" component={BlurviewDEmo} />

        {LoginGroup()}
        {Homegroup()}
        {UserGroup()}
        {FightGroup()}
        <Stack.Screen
          name="HomeTabs"
          component={HomeTabs}
          options={{ headerShown: false }}
        />

        <Stack.Screen name="CouponsModal" component={CouponsModal} options={{ presentation: 'modal' }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
