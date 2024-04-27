import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Input, NativeBaseProvider, Button, Icon, Box, Image, AspectRatio } from 'native-base';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { alignContent, flex, flexDirection, width } from 'styled-system';


function Progress() {
    const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.Middle}>
        <Text style={styles.titleText}>BeyondLanguage</Text>
      </View>
      <View>
        <Text style={styles.introText}>Progress</Text>
      </View>
      
      <View style={styles.boxStyle}>
        <Text>
          Proficiency : 10%
          Speech  : 35%%
        </Text>
      </View>
      <View style={styles.boxStyle}>
        <Text style={styles.homepageLink} onPress={() => navigation.navigate("Homepage")}>
          Upgrade to Premium
        </Text>
      </View>
      <View style={styles.boxStyle2}>
      <Box 
        onPress={() => navigation.navigate("Profile")}  // for navigation 
        style={{height:80, width:80}} 
        shadow={3}
        _light={{
          backgroundColor: "gray.50",
        }}
        _dark={{
          backgroundColor: "gray.700",
        }}
      >
        <AspectRatio ratio={1 / 1}>
          <Image
            roundedTop="lg"
            source={require('../assets/user.png')}
            alt="image"
            height={60}
            width={60}
          />
        </AspectRatio>
      </Box>
      <Box 
        onPress={() => navigation.navigate("Homepage")}  // for navigation
        style={styles.imageStyle}
        shadow={3}
        _light={{
          backgroundColor: "gray.50",
        }}
        _dark={{
          backgroundColor: "gray.700",
        }}
      >
        <AspectRatio ratio={1 / 1}>
          <Image     
            roundedTop="lg"
            source={require('../assets/home.png')}
            alt="image"
            height={60}
            width={60}
          />
        </AspectRatio>
      </Box>
      <Box 
        onPress={() => navigation.navigate("Settings")}  // for navigation
        style={styles.imageStyle}
        shadow={3}
        _light={{
          backgroundColor: "gray.50",
        }}
        _dark={{
          backgroundColor: "gray.700",
        }}
      >
        <AspectRatio ratio={1 / 1}>
          <Image
            
            roundedTop="lg"
            source={require('../assets/settings.png')}
            alt="image"
            height={60}
            width={60}
          />
        </AspectRatio>
      </Box>

      </View>
      
    </View>
  )
}
export default () => {
    return (
      <NativeBaseProvider>
       
          <Progress />
        
      </NativeBaseProvider>
    )
  }
  
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    LoginText: {
      marginTop:100,
      fontSize:30,
      fontWeight:'bold',
    },
    Top:{
        alignItems:'top',
        justifyContent:'center',
      },
    Middle:{
      alignItems:'center',
      justifyContent:'center',
      backgroundColor:'blue',
    },
    text2:{
      flexDirection:'row',
      justifyContent:'center',
      paddingTop:5
    },
    signupText:{
      fontWeight:'bold'
    },
    emailField:{
      marginTop:30,
      marginLeft:15
    },
    emailInput:{
      marginTop:10,
      marginRight:5
    },
    buttonStyle:{
      marginTop:30,
      marginLeft:15,
      marginRight:15
    },
    buttonStyleX:{
      marginTop:12,
      marginLeft:15,
      marginRight:15
    },
    buttonDesign:{
      backgroundColor:'#026efd'
    },
    lineStyle:{
      flexDirection:'row',
      marginTop:30,
      marginLeft:15,
      marginRight:15,
      alignItems:'center'
    },
    imageStyle:{
      width:80,
      height:80,
      marginLeft:20,
    },
    menuStyle:{
        width:500,
        height:500,
        marginLeft:20,
      },
    boxStyle:{
      flexDirection:'column',
      marginTop:30,
      marginLeft:15,
      marginRight:15,
      justifyContent:'space-around',
      borderRadius:2,
      borderBlockColor:"grey"
    },
    boxStyle2:{
      flexDirection:'row',
      marginLeft:15,
      marginRight:15,
      justifyContent:'space-around',
      borderRadius:2,
      borderBlockColor:"grey",
      flex: 1,
      position: 'absolute', //Here is the trick
      bottom: 10, //Here is the trick
      width: '100%'
    },
    homepageLink:{
      fontWeight:'bold',
      fontSize:30,
      backgroundColor:'green',
      borderColor:'black',
      borderWidth:2,
      color:"white",
      textAlign:'center'
    },
    titleText:{
      fontWeight:'bold',
      fontSize:30,
      color:'white'
    },
    introText:{
      fontWeight:'bold',
      fontSize:30,
      color:'green'
    },
    Welcome:{
      fontSize:45,
      textAlign:'center',
      fontWeight:'bold',
      color:'blue'
    }
  });
