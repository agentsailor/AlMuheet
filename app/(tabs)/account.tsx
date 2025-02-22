import React , {useEffect} from 'react';
import {StatusBar, Platform, ScrollView,SafeAreaView,StyleSheet,View,Modal,Image,Button, TouchableOpacity, TouchableHighlight, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from '@/components/Themed';


import FontAwesome from '@expo/vector-icons/FontAwesome';

import axios from 'axios';

function IconSymbol(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}


import { Collapsible } from '@/components/Collapsible';


export default function Account() {

  return (<View>



  </View>)

}
