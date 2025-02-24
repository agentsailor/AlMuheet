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
  const [lang, setLang] = React.useState(2);
  const [settings, setSettings] = React.useState(undefined);

  const [user, setUser] = React.useState(undefined);


  const [name, onChangeName] = React.useState('');
  const [mail, onChangeMail] = React.useState('');
  const [number, onChangeNumber] = React.useState('');
  const [phone, onChangePhone] = React.useState('');

  const [store, onChangeStore] = React.useState('');
  const [location, onChangeLocation] = React.useState('');

  const [note, onChangeNote] = React.useState('');
  const [pName, onChangePname] = React.useState('');
  // const [path, setPath] = React.useState('http://127.0.0.1:8000');
  const [path, setPath] = React.useState('https://www.almuheetco.com');

  useEffect(() => {
    if (user == undefined) {
      AsyncStorage.multiGet(['publicData', 'invoiceId']).then((data) => {
        if (JSON.parse(data[0][1])) {
          setUser(JSON.parse(data[0][1]))
          onChangeName(JSON.parse(data[0][1]).name)
          onChangeMail(JSON.parse(data[0][1]).email)
          onChangeNumber(JSON.parse(data[0][1]).phone)
        }else {
          setUser(null)
        }
      });
    }
  });


  useEffect(() => {
      axios.post(path+'/api/render',{for:'helpers',})
      .then(res => {
        setSettings(res.data.settings)
        setLang(res.data.lang == 'en' ? 0:1)
      });
  }, [])


  function render(forC,trigger) {
    if (settings) {
      return settings.filter(e=>e.for==forC).filter(e=>e.trigger==trigger).map((e)=> lang ? e.content : e.content_en).toString()
    }else {
      return ''
    }
  }


  if (user) {
    console.log(user);

    return (<View style={{padding:20}}>
      <TextInput require value={name} name="name" onChangeText={onChangeName} type="text" style={{marginTop:20,borderRadius:20,overflow:'hidden',backgroundColor:'#fff', height: 60, color:'#000', textAlign:lang ? 'right':'left', width:'100%', border:'1px solid #ccc', padding: 10,  textAlignLast:lang ? 'right':'left'}} placeholder={render('content','fname')} />
      <TextInput value={mail} name="number" onChangeText={onChangeMail} type="phone-pad" style={{marginTop:20,borderRadius:20,overflow:'hidden',backgroundColor:'#fff', height: 60, color:'#000', textAlign:lang ? 'right':'left', width:'100%', border:'1px solid #ccc', padding: 10,  textAlignLast:lang ? 'right':'left'}} placeholder={render('content','email')}/>
      <TextInput require value={number} name="number" onChangeText={onChangeNumber} type="phone-pad" style={{marginTop:20,borderRadius:20,overflow:'hidden',backgroundColor:'#fff', height: 60, color:'#000', textAlign:lang ? 'right':'left', width:'100%', border:'1px solid #ccc', padding: 10,  textAlignLast:lang ? 'right':'left'}} placeholder={render('content','phone')} keyboardType="numeric"/>




      <View style={{position:'fixed',bottom:100,right:0,left:0,margin:20,borderRadius:20,overflow:'hidden'}}>
        <TouchableOpacity style={Boolean(false) ? {alignItems:'center',padding:20,backgroundColor:'#ccc',color:'#000',fontWeight:700}:{alignItems:'center',padding:20,backgroundColor:'#fcbe0e',color:'#000',fontWeight:700}} variant='contained' endIcon={<IconSymbol size={30} name="save.fill" color="#000"  />}
        onPress={()=> axios.post(path+'/api/render',{ for:'account',trigger:'update' ,name:name,phone:number,mail:mail,store:store,location:location, })
        .then(async(res)=> {
          const data = JSON.stringify(res.data.public);
          // 
          // await AsyncStorage.multiSet([['publicData', data]])

        })}>
          <Text>{render('content','save')}</Text>
        </TouchableOpacity>
      </View>

    </View>)
  }else if (user === null) {
    return 'no account'
  }
  else {
    return 'loading'
  }


}
