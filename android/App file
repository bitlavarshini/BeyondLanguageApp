import React from 'react';

import Login from './screens/Login';
import Signup from './screens/Signup';
import Homepage from './screens/Homepage';
import Accomodation from './screens/Accomodation';
import Emergency from './screens/Emergency';
import Events from './screens/Events';
import Marketplace from './screens/Marketplace';
import Languages from './screens/Languages';
import Help from './screens/Help';
import Chat from './screens/Chat';
import Proficiency from './screens/Proficiency';
import Progress from './screens/Progress';
import Questionnaire from './screens/Questionnaire';
//import GoogleAuth from './screens/GoogleAuth';
//import FacebookAuth from './screens/FacebookAuth';
//impoTwitterAuth from './screens/TwitterAuth';
//import AppleleAuth from './screens/AppleAuth';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


const Stack = createStackNavigator();



function App() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Homepage" component={Homepage} />
      <Stack.Screen name="Accomodation" component={Accomodation} />
      <Stack.Screen name="Emergency" component={Emergency} />
      <Stack.Screen name="Events" component={Events} />
      <Stack.Screen name="Marketplace" component={Marketplace} />
      <Stack.Screen name="Languages" component={Languages} />
      <Stack.Screen name="Help" component={Help} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="Proficiency" component={Proficiency} />
      <Stack.Screen name="Progress" component={Progress} />
      <Stack.Screen name="Questionnaire" component={Questionnaire} />

    </Stack.Navigator>
  );
}


export default () => {
  return (
    <NavigationContainer>
     
        <App />
      
    </NavigationContainer>
  )
}
