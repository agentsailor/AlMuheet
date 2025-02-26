import React , {useEffect} from 'react';

import { Platform, Switch,Pressable, ScrollView,SafeAreaView,StyleSheet,View,Modal,Image,Button, TouchableOpacity, TouchableHighlight, TextInput } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text } from '@/components/Themed';

import { Stack,Link, Tabs } from 'expo-router';

import FontAwesome from '@expo/vector-icons/FontAwesome';

import axios from 'axios';

import { Tab, TabView } from "react-native-elements";
import { Input } from '@rneui/themed';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ButtonGroup } from '@rneui/themed';

function IconSymbol(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}



import { useColorScheme } from '@/components/useColorScheme';



export default function TabOneScreen() {

  const [lang, setLang] = React.useState(2);


    const [search, onChangeSearch] = React.useState('');
    const [count, setCount] = React.useState(0);
    const onPress = () => setCount(count + 1);


    const [list, setList] = React.useState(['','','','','','','','','','']);
    const [modalVisible, setPreview] = React.useState(undefined);


    const [products, setProducts] = React.useState(undefined);
    const [splitPage, setSplit] = React.useState(6);
    const [page, setPage] = React.useState(0);

    // const [path, setPath] = React.useState('http://127.0.0.1:8000');
    const [path, setPath] = React.useState('https://www.almuheetco.com');

    const [cart, setCart] = React.useState([]);
    const [cartProceed, setCartProceed] = React.useState(false);

    const [categories, setCategories] = React.useState(undefined);
    const [settings, setSettings] = React.useState(undefined);

    const [cat, setCat] = React.useState(0);

    function render(forC,trigger) {
      if (settings) {
        return settings.filter(e=>e.for==forC).filter(e=>e.trigger==trigger).map((e)=> lang ? e.content : e.content_en).toString()
      }else {
        return ''
      }
    }

    useEffect(() => {
        axios.post(path+'/api/render',{for:'helpers',split:splitPage,page:page,search:search,category:cat})
        .then(res => {
          setCategories(res.data.categories)
          setSettings(res.data.settings)
          setLang(res.data.lang == 'en' ? 0:1)
        });
    }, [])

    useEffect(() => {
      if (cat) {
        axios.post(path+'/api/render',{for:'products',split:splitPage,page:page,search:search,category:cat})
        .then(res => {
          setProducts(res.data.products)
        });
      }
    }, [page,search,cat])



    // useEffect(() => {
    //   const timeoutId = setTimeout(() => {
    //     if (count) {
    //       setCount(count - 1);
    //
    //     }else {
    //       setCount(count + 1);
    //     }
    //   }, 5000);
    //
    //   return () => clearTimeout(timeoutId);
    // }, [count]);



    const [name, onChangeName] = React.useState('');
    const [mail, onChangeMail] = React.useState('');
    const [number, onChangeNumber] = React.useState('');
    const [phone, onChangePhone] = React.useState('');

    const [store, onChangeStore] = React.useState('');
    const [location, onChangeLocation] = React.useState('');

    const [note, onChangeNote] = React.useState('');
    const [pName, onChangePname] = React.useState('');


    const [invoice, setInvoice] = React.useState(undefined);


    const [user, setUser] = React.useState(undefined);





    useFocusEffect(
      React.useCallback(() => {
        if (user == undefined) {
          AsyncStorage.multiGet(['publicData', 'invoiceId']).then((data) => {
            if (JSON.parse(data[0][1])) {
              setInvoice(JSON.parse(data[1][1]))
              setUser(JSON.parse(data[0][1]))
            }else {
              setUser(null)
            }
          });
        }
      }, [user])
    );



    const [isEnabled, setIsEnabled] = React.useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);


    const colorScheme = useColorScheme();


    const [suggestion, setSuggest] = React.useState(false);

  return (
    <ScrollView >

      <View style={{ boxShadow:'1px 1px 6px #00000030', borderBottomLeftRadius:20,borderBottomEndRadius:20,marginTop:0,marginBottom:0,overflow:'hidden'}}>
        {settings && settings.filter(e=>e.for=='gal').length > 0 && <Image source={
          { uri: path+'/images/gal/'+settings.filter(e=>e.for=='gal')[count].content, }
        } style={{
          height:230,
          width:'100%',
        }} />}

        {settings && settings.filter(e=>e.for=='gal').length > 1 &&
          <View style={{left:0,right:0,backgroundColor:'none',top:'50%',transform:'translate(0,-50%)',position:'absolute',display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
            <TouchableOpacity style={{padding:20}} disabled={Boolean(count == 0)} onPress={()=> setCount(count - 1)}><IconSymbol size={20} name="chevron-left" color="#000" /></TouchableOpacity>
              <View style={{flexGrow:1}} />
            <TouchableOpacity style={{padding:20}} disabled={Boolean(count >= settings.filter(e=>e.for=='gal').length)} onPress={()=> setCount(count + 1)}><IconSymbol size={20} name="chevron-right" color="#000" /></TouchableOpacity>
          </View>
          }
      </View>






      <View style={{margin:10,marginTop:0,display:'ruby',flexDirection: 'row',flexWrap: 'wrap'}}>

        <TouchableOpacity style={{alignItems:'center',flexDirection:lang ? 'row-reverse':'row',boxShadow:'1px 1px 6px #00000030',borderBottomLeftRadius:20,borderBottomEndRadius:20,width:'94%',marginTop:0,padding:15,marginVertical: 10,marginHorizontal: 10,color:'#000',backgroundColor: '#fcbe0e'}} onPress={()=> setSuggest(!suggestion)} >
          <IconSymbol style={{}} size={25} name="plus-square" color={colorScheme === 'dark' ? '#fff':"#000"} />
          <Text style={{fontSize:20,marginLeft:10,marginRight:10, extAlign:lang ? 'right':'left',fontWeight:600,color:'#000',}}>{render('content','suggestTitle')}</Text>
        </TouchableOpacity>

        {categories && categories.map((catRow,key)=>
          <TouchableOpacity style={{overflow:'hidden',flexDirection:'column',alignItems:'center',justifyContent:'end',boxShadow:'1px 1px 6px #00000030',borderRadius:20,width:key == (categories.length-1) && !(categories.length % 2 === 0)  ? '93%':'44%',minHeight:100,marginVertical: 10,marginHorizontal: 10,color:'#000',backgroundColor: '#ccc5'}} onPress={()=> setCat(catRow.id)} key={key} >
            {catRow.icon &&
              <View style={{width:'100%',backgroundColor:'#fff',alignItems:'anchor-center'}}>
                <Image source={ { uri: path+'/images/'+catRow.icon, } } style={{ height:100, width:'100%', }} />
              </View>
            }
            <Text style={{width:'100%',textAlign:'center',backgroundColor:'rgb(252, 190, 14)',fontWeight:600,color: '#000',padding:10}}>{lang ? catRow.name :catRow.name_en}</Text>
          </TouchableOpacity>
        )}

        <View style={{overflow:'hidden',alignItems:'center',justifyContent:'space-between',boxShadow:'1px 1px 6px #00000030',borderRadius:20,width:'94%',marginVertical: 10,marginHorizontal: 10,color:'#000',backgroundColor: '#ccc5'}}  >
            <View style={{width:'100%',flexDirection:lang ? 'row-reverse':'row',display:'flex',alignItems:'center',justifyContent:'space-between',}}  >
              <View style={{flex:1,padding:10,paddingLeft:20,paddingRight:20,}}>
                <Text style={{marginBottom:5,fontSize:40, }}>{render('content','contact')}</Text>
              </View>
              <View style={{flexDirection:'column',display:'flex',alignItems:'center',justifyContent:'space-between',}}  >
                <TouchableOpacity style={{minWidth:80,alignItems:'center',justifyContent:'space-between',boxShadow:'1px 1px 6px #00000030',padding:10,marginVertical: 0,marginHorizontal: 0,color:'#000',backgroundColor: '#ccc'}} >
                  <IconSymbol size={25} name="whatsapp" color={colorScheme === 'dark' ? '#fff':"#000"} />
                </TouchableOpacity>
                <TouchableOpacity style={{minWidth:80,alignItems:'center',justifyContent:'space-between',boxShadow:'1px 1px 6px #00000030',padding:10,marginVertical: 0,marginHorizontal: 0,color:'#000',backgroundColor: '#ccc'}} >
                  <IconSymbol size={25} name="phone" color={colorScheme === 'dark' ? '#fff':"#000"} />
                </TouchableOpacity>
                <TouchableOpacity style={{minWidth:80,alignItems:'center',justifyContent:'space-between',boxShadow:'1px 1px 6px #00000030',padding:10,marginVertical: 0,marginHorizontal: 0,color:'#000',backgroundColor: '#ccc'}} >
                  <IconSymbol size={25} name="map" color={colorScheme === 'dark' ? '#fff':"#000"} />
                </TouchableOpacity>
              </View>
            </View>
        </View>


          <TouchableOpacity style={{alignItems:'center',boxShadow:'1px 1px 6px #00000030',borderRadius:20,width:'94%',marginVertical: 10,marginHorizontal: 10,color:'#000',backgroundColor: colorScheme === 'dark' ? '#fff':'#fcbe0e'}}  >
            <Link href={'/cart'} style={{padding:20,display:'flex',flexDirection:lang ? 'row-reverse':'row',paddingLeft:20,paddingRight:20,width:'100%'}}>
              <IconSymbol style={{}} size={25} name="shopping-cart" color={colorScheme === 'dark' ? '#000':"#000"} />
              <Text style={{marginLeft:20,marginRight:20,textAlign:lang ? 'left':'right',fontWeight:600,color:colorScheme === 'dark' ? '#000':"#000",}}>{render('content','continueToCart')}</Text>
            </Link>
          </TouchableOpacity>

          <TouchableOpacity style={{alignItems:'center',boxShadow:'1px 1px 6px #00000030',borderRadius:20,width:'94%',marginVertical: 10,marginHorizontal: 10,color:'#000',backgroundColor: colorScheme === 'dark' ? '#fff':'#0f192a'}}  >
            <Link href={'/account'} style={{padding:20,display:'flex',flexDirection:lang ? 'row-reverse':'row',paddingLeft:20,paddingRight:20,width:'100%'}}>
              <IconSymbol style={{}} size={25} name="user" color={colorScheme === 'dark' ? '#fff':"#fff"} />
              <Text style={{marginLeft:20,marginRight:20,textAlign:lang ? 'left':'right',fontWeight:600,color:colorScheme === 'dark' ? '#fff':"#fff",}}>{render('content','accountInfo')}</Text>
            </Link>
          </TouchableOpacity>

        <TouchableOpacity onPress={()=> { setLang(lang ? 0: 1) }} style={{alignItems:'center',flexDirection:lang ? 'row':'row-reverse',boxShadow:'1px 1px 6px #00000030',borderRadius:20,width:'94%',padding:10,paddingLeft:20,paddingRight:20,marginVertical: 10,marginHorizontal: 10,color:'#000',backgroundColor: '#ccc5'}}  >
          <IconSymbol style={{}} size={25} name="language" color={colorScheme === 'dark' ? '#fff':"#000"} />
          <Text style={{marginLeft:20,marginRight:20,textAlign:!lang ? 'left':'right',fontWeight:600,color:'#000',}}>{render('content','lang')}</Text>
        </TouchableOpacity>
      </View>



      <Modal animationType="slide" transparent={false} visible={Boolean(cat)} onRequestClose={()=> setCat(0)}>

      <View style={{paddingTop:50,backgroundColor:'#0f192a',boxShadow:'1px 1px 6px #00000030', borderBottomLeftRadius:20,borderBottomEndRadius:20,marginTop:0,marginBottom:0,overflow:'hidden'}}>
        <TouchableOpacity onPress={()=> setCat(0)} style={{zIndex:99999,position:'absolute',left:0,padding:35,top:30}}>
          <IconSymbol size={20} name="chevron-left" color="#ccc"  />
        </TouchableOpacity>
        <Text style={{textAlign:'center',fontSize:20,color:'#ccc'}}>{render('content','cat')}</Text>
        <Text style={{textAlign:'center',fontSize:35,color:'#ccc'}}>{categories && cat && categories.filter(e=>e.id == cat).map((c)=> !lang ? c.name_en :c.name)}</Text>

        <View style={{margin:20,borderRadius:20,overflow:'hidden',}}>
          <Input style={{margin:-25,marginTop:0,paddingRight:25,paddingLeft:25,backgroundColor:'#fff',paddingBottom:15,height: 50,color:'#fff',textAlign:!lang ? 'left':'right',border:'1px solid #ccc',flex:1,fontSize:20,borderColor: '#000'}} onChangeText={onChangeSearch} value={search} placeholder={render('content','search')} />
        </View>
      </View>

      <ScrollView >
        <View style={{paddingBottom:100,display:'ruby',flexDirection: 'row',flexWrap: 'wrap',padding:0}}>
        {products && products.data.map((row,key)=>
            <View key={key} style={{width:'50%',}}>
              <View style={{marginVertical: 10,marginHorizontal: 10,boxShadow:'1px 1px 6px #00000030',borderRadius:20,overflow:'hidden',backgroundColor:'none',display:'grid'}} >
                {row.images && Array.isArray(row.images) && <TouchableOpacity onPress={()=>setPreview(row)}>
                  <Image style={{height:140,width:'100%'}} source={true ? {uri:path+'/images/products/'+JSON.parse(row.images)[0]}: "https://img.freepik.com/free-photo/car-accessories-with-copy-space_23-2149030409.jpg?t=st=1736097228~exp=1736100828~hmac=bcc9332c34cce1dcbf3e990ac69b485f2622b2c0f8a54e4bdcd7feb2a7012919&w=1380"}/>
                </TouchableOpacity>}
                <Text style={{padding:10,alignItems:'center',display:'flex',flexDirection:'row',justifyContent:'space-between',backgroundColor:'#fff',borderBottom:'1px solid #ccc'}} type="subtitle">{lang ? row.name :row.name_en}</Text>
                {row.status > 0 ?
                <View style={{display:'flex',flexDirection:'row',borderBottomEndRadius:20,borderBottomLeftRadius:20,overflow:'hidden',borderRadius:'0 0 20px 20px'}}>
                  {cart.filter(e=>e.id==row.id).length > 0 &&
                    <TouchableOpacity style={{alignItems:'center',justifyContent:'center',padding:10, color:'#000',backgroundColor:'#fcbe0e',width:'33%'}} fullWidth variant='contained' onPress={()=> setCart( cart.filter(e=>e.id==row.id).length && cart.filter(e=>e.id==row.id).map((x)=>x.quantity).reduce((a, v)=> a + v ) == 1 ? cart.filter(e=>e.id!=row.id) : cart.filter(e=>e.id!=row.id).concat({id:row.id,quantity: cart.filter(e=>e.id==row.id).map((x)=>x.quantity).reduce((a, v)=> a + v )-1 }))} disabled={Boolean(row.status == 0 || cart.filter(e=>e.id == row.id).length == 0)}   >
                      <Text>{cart.filter(e=>e.id == row.id).filter(e=>e.quantity == 1).length == 0 ? <IconSymbol size={20} name="minus" color="#000"  /> : <IconSymbol size={20} name="trash" color="#000"  />}</Text>
                    </TouchableOpacity>
                  }
                   {cart.filter(e=>e.id==row.id).length > 0 && <Text style={{fontWeight:600,textAlign:'center',width:'34%',backgroundColor:'#fff',padding:10,}}>{cart.filter(e=>e.id==row.id).length > 0 ? cart.filter(e=>e.id==row.id).map((x)=>x.quantity) : 0}</Text>}
                  <TouchableOpacity style={{alignItems:'center',justifyContent:'center',padding:10, width:cart.filter(e=>e.id==row.id).length > 0 ? '33%':'100%',color:'#000',backgroundColor:'#fcbe0e'}} onPress={()=> setCart(cart.filter(e=>e.id!=row.id).concat({id:row.id,quantity: cart.filter(e=>e.id==row.id).length == 0 ? 1:cart.filter(e=>e.id==row.id).map((x)=>x.quantity).reduce((a, v)=> a + v )+1 }))}>
                    <IconSymbol size={20} name="plus" color="#000"  />
                   </TouchableOpacity>
                </View>
                :
                  <Text style={{backgroundColor:'#fff',padding:10,flex:'auto'}}>{render('content','unavailable')}</Text>
                }
              </View>
            </View>
          )}
        </View>
      </ScrollView>

        <Modal animationType="slide" presentationStyle="pageSheet" transparent={false} visible={Boolean(modalVisible)} onRequestClose={() => {  setPreview(undefined); }}>
            {modalVisible && products && products.data.filter(e=>e.id == modalVisible.id).map((row,key)=> <View key={key} style={{height:'100%'}}>

              <View style={{padding:10,display:'flex',flexDirection:lang ? 'row':'row-reverse',justifyContent:'space-between',marginTop:30}}>
                <TouchableOpacity onPress={()=> setPreview(undefined)}>
                  <IconSymbol style={{padding:20}} size={20} name="close" color="#000"  />
                </TouchableOpacity>
                <View style={{flexGrow:1}} />

                <View style={{}}>
                  <Text style={{color:'#000',marginBottom:10,fontSize:25,textAlign:'right'}} type="title">{lang ? row.name : row.name_en}</Text>
                  <Text style={{color:'#000',marginBottom:10,fontSize:20,textAlign:'right'}} type="subtitle">{row.code}</Text>
                </View>

              </View>

              <Image style={{height:340,width:'100%'}} source={true ? {uri:path+'/images/products/'+JSON.parse(row.images)[0]}: "https://img.freepik.com/free-photo/car-accessories-with-copy-space_23-2149030409.jpg?t=st=1736097228~exp=1736100828~hmac=bcc9332c34cce1dcbf3e990ac69b485f2622b2c0f8a54e4bdcd7feb2a7012919&w=1380"}/>
              <View style={{textAlignLast:'center',padding:20,textAlign:'-webkit-center',}}>
                  <Text type="body" style={{textAlign:'-webkit-center',marginBottom:10}}>{lang ? row.description : row.description_en} </Text>
              </View>

              {row.status > 0 ?
              <View style={{display:'flex',flexDirection:'row',borderRadius:20,overflow:'hidden',margin:20}}>
                {cart.filter(e=>e.id==row.id).length > 0 &&
                  <TouchableOpacity style={{alignItems:'center',justifyContent:'center',padding:10, color:'#000',backgroundColor:'#fcbe0e',width:'33%'}} fullWidth variant='contained' onPress={()=> setCart( cart.filter(e=>e.id==row.id).length && cart.filter(e=>e.id==row.id).map((x)=>x.quantity).reduce((a, v)=> a + v ) == 1 ? cart.filter(e=>e.id!=row.id) : cart.filter(e=>e.id!=row.id).concat({id:row.id,quantity: cart.filter(e=>e.id==row.id).map((x)=>x.quantity).reduce((a, v)=> a + v )-1 }))} disabled={Boolean(row.status == 0 || cart.filter(e=>e.id == row.id).length == 0)}   >
                    <Text>{cart.filter(e=>e.id == row.id).filter(e=>e.quantity == 1).length == 0 ? <IconSymbol size={20} name="minus" color="#000"  /> : <IconSymbol size={20} name="trash" color="#000"  />}</Text>
                  </TouchableOpacity>
                }
                 {cart.filter(e=>e.id==row.id).length > 0 && <Text style={{fontWeight:600,textAlign:'center',width:'34%',backgroundColor:'#fff',padding:10,}}>{cart.filter(e=>e.id==row.id).length > 0 ? cart.filter(e=>e.id==row.id).map((x)=>x.quantity) : 0}</Text>}
                <TouchableOpacity style={{alignItems:'center',justifyContent:'center',padding:10, width:cart.filter(e=>e.id==row.id).length > 0 ? '33%':'100%',color:'#000',backgroundColor:'#fcbe0e'}} onPress={()=> setCart(cart.filter(e=>e.id!=row.id).concat({id:row.id,quantity: cart.filter(e=>e.id==row.id).length == 0 ? 1:cart.filter(e=>e.id==row.id).map((x)=>x.quantity).reduce((a, v)=> a + v )+1 }))}>
                  <IconSymbol size={20} name="plus" color="#000"  />
               </TouchableOpacity>
              </View>
              :
                <Text style={{backgroundColor:'#fff',padding:10,flex:'auto'}}>{render('content','unavailable')}</Text>
              }

              {cart.filter(e=>e.id==row.id).length > 0 && <TouchableOpacity style={{position:'absolute',margin:20,bottom:0,alignItems:'center',justifyContent:'center',padding:20,borderRadius:20, width:'90%',color:'#000',backgroundColor:'#fcbe0e'}} onPress={()=> setPreview(undefined)}>
                <Text style={{fontWeight:600,}}>{render('content','done')}</Text>
             </TouchableOpacity>}
          </View>)}
        </Modal>



        <View style={{height:Boolean(cart.length) ? 'fit-content':0,display:'flex',flexDirection:'row',zIndex:999,position:'absolute',bottom:0,right:0, left:0,margin:20,overflow:'hidden',borderRadius:20, width:'90%',}}>
            <TouchableOpacity style={{backgroundColor:'#17233c',fontWeight:600,color:'#fff',flex: 1,padding:20,alignItems:'center'}} onPress={()=> setCart([])} >
              <Text style={{fontWeight:600,color:'#fff'}}>{render('content','cancel')}</Text>
            </TouchableOpacity>
            {false && <TouchableOpacity style={{backgroundColor:'#fcbe0e',fontWeight:600,color:'#000',flex: 1,padding:20,alignItems:'center'}} onPress={()=> axios.post(path+'/api/render',{invoice:AsyncStorage.getItem('publicData'),user:user})}>
              <Text>loggggggglogggggggloggggggg</Text>
            </TouchableOpacity>}
            {Boolean(invoice) ?
              <TouchableOpacity style={{backgroundColor:'#fcbe0e',fontWeight:600,color:'#000',flex: 1,padding:20,alignItems:'center'}} onPress={()=> axios.post(path+'/api/render',{
                product_id:cart.map((x)=> x.id ),
                quantity:cart.map((x)=> x.quantity ),
                for:'order',trigger:'newItems' ,
                invoice_id:invoice,
              })
              .then(res=> {
                setCart([])
              } )} >
                <Text style={{fontWeight:600,color:'#000'}}>{render('content','addToInvoice')}</Text>
              </TouchableOpacity>
            :Boolean(user) ?
              <TouchableOpacity style={{backgroundColor:'#fcbe0e',fontWeight:600,color:'#000',flex: 1,padding:20,alignItems:'center'}} onPress={()=> {
              axios.post(path+'/api/render',{
                product_id:cart.map((x)=> x.id ),
                quantity:cart.map((x)=> x.quantity ),
                for:'order',trigger:'new' ,
                phone:user.phone,
              })
              .then(async(res)=> {
                const data = JSON.stringify(res.data.public);
                const invoiceId = JSON.stringify(res.data.id);

                await AsyncStorage.multiSet([['invoiceId', invoiceId], ['publicData', data]])
                setInvoice(invoiceId)
                setUser(data)
                setCart([])
              })
              }} >
                <Text style={{fontWeight:600,color:'#000'}}>{render('content','newOrder')}</Text>
              </TouchableOpacity>
            :
              <TouchableOpacity style={{backgroundColor:'#fcbe0e',fontWeight:600,color:'#000',flex: 1,padding:20,alignItems:'center'}} onPress={()=> setCartProceed(!cartProceed)} >
                <Text style={{fontWeight:600,color:'#000'}}>{render('content','completeData')}</Text>
              </TouchableOpacity>
            }
        </View>




        <Modal animationType="slide" transparent={false} presentationStyle="pageSheet" visible={Boolean(cartProceed)} onRequestClose={()=> setCartProceed(!cartProceed)}>
          <View style={{display:'flex',padding:20,flexDirection:lang ? 'row-reverse':'row',justifyContent:'space-between'}}>
              <View style={{backgroundColor:'#fff'}}>
                <Text style={{color:'#000',marginBottom:10,fontSize:30}} type="title">{render('content','completeData')}</Text>
                <Text style={{color:'#000',marginBottom:10,fontSize:20}} type="subtitle">{render('content','completeInvoice')}</Text>
              </View>
              <View style={{flexGrow:1}} />
              <TouchableOpacity onPress={()=> setCartProceed(!cartProceed)} style={{}} >
                <Text><IconSymbol size={30} name="close" color="#000"  /></Text>
              </TouchableOpacity>
          </View>

          <View style={{margin:20,borderWidth:1,border:'1px solid #17233c',borderRadius:20,overflow:'hidden',}}>
            <Text style={{textAlign:'center',color:'#fff',padding:10,backgroundColor:'#17233c',fontWeight:600}} type="subtitle">{render('content','personal')}</Text>
            <TextInput require value={name} name="name" onChangeText={onChangeName} type="text" style={{ height: 40, color:'#fff', textAlign:lang ? 'right':'left', width:'100%', borderBottomWidth:1, padding: 10,color:'#000'}} placeholder={render('content','fname')} />
            <TextInput value={mail} name="number" onChangeText={onChangeMail} type="phone-pad" style={{ height: 40, color:'#fff', textAlign:lang ? 'right':'left', width:'100%', borderBottomWidth:1, padding: 10,color:'#000',}} placeholder={render('content','email')}/>
            <TextInput require value={number} name="phone" onChangeText={onChangeNumber} type="phone-pad" style={{ height: 40, color:'#fff', textAlign:lang ? 'right':'left', width:'100%', borderBottomWidth:1, padding: 10,color:'#000',borderBottomWidth:0}} placeholder={render('content','phone')} keyboardType="numeric"/>
          </View>
          <View style={{margin:20,borderWidth:1,border:'1px solid #17233c',borderRadius:20,overflow:'hidden',}}>
            <Text style={{textAlign:'center',color:'#fff',padding:10,backgroundColor:'#17233c',fontWeight:600}} type="subtitle">{render('content','storeData')}</Text>
            <TextInput require value={store} name="store" onChangeText={onChangeStore} type="text" style={{ height: 40, color:'#fff', textAlign:lang ? 'right':'left', width:'100%', borderBottomWidth:1, padding: 10,color:'#000'}} placeholder={render('content','name')} />
            <TextInput value={phone} name="number" onChangeText={onChangePhone} type="phone-pad" style={{ height: 40, color:'#fff', textAlign:lang ? 'right':'left', width:'100%', borderBottomWidth:1, padding: 10,color:'#000',}} placeholder={render('content','phone')} keyboardType="numeric"/>
            <TextInput require value={location} name="location" onChangeText={onChangeLocation} type="text" multiline={true} rows={5} style={{ height: 40, color:'#fff', textAlign:lang ? 'right':'left', width:'100%', borderBottomWidth:1, padding: 10,height:70,color:'#000',borderBottomWidth:0}} placeholder={render('content','address')} />
          </View>
          <View style={{margin:20,justifyContent:'space-between',padding:10,alignItems:'center',flexDirection:lang ? 'row':'row-reverse',borderWidth:1,border:'1px solid #17233c',borderRadius:20,overflow:'hidden',}} >
            <Switch style={{}} trackColor={{false: '#767577', true: '#fcbe0e'}} thumbColor={isEnabled ? '#fcbe0e' : '#fcbe0e'} ios_backgroundColor="#ccc"  value={isEnabled} onChange={toggleSwitch}/>
            <Text style={{flex:1,textAlign:lang ? 'right':'left'}}>{render('content','newClient')}</Text>
          </View>


          <View style={{position:'absolute',bottom:0,right:0,left:0,margin:20,borderRadius:20,overflow:'hidden'}}>
            <TouchableOpacity disabled={Boolean(!name || !number || !store || !location)} style={Boolean(!name || !number || !store || !location) ? {alignItems:'center',padding:20,backgroundColor:'#ccc',color:'#000',fontWeight:700}:{alignItems:'center',padding:20,backgroundColor:'#fcbe0e',color:'#000',fontWeight:700}} variant='contained' endIcon={<IconSymbol size={30} name="save.fill" color="#000"  />}
            onPress={()=> axios.post(path+'/api/render',{
              product_id:cart.map((x)=> x.id ),
              quantity:cart.map((x)=> x.quantity ),
              for:'order',trigger:'new' ,name:name,phone:number,mail:mail,store:store,location:location,
            })
            .then(async(res)=> {
              const data = JSON.stringify(res.data.public);
              const invoiceId = JSON.stringify(res.data.id);

              await AsyncStorage.multiSet([['invoiceId', invoiceId], ['publicData', data]])

              setCart([])
              setCartProceed(!cartProceed)
            })}>
              <Text>{render('content','save')}</Text>
            </TouchableOpacity>
          </View>
        </Modal>



      </Modal>



      <Modal animationType="slide" transparent={false} presentationStyle="pageSheet" visible={Boolean(suggestion)} onRequestClose={()=> setSuggest(!suggestion)}>
        <View style={{alignItems:'center',display:'flex',padding:20,flexDirection:lang ? 'row':'row-reverse',justifyContent:'space-between'}}>
          <TouchableOpacity onPress={()=> setSuggest(!suggestion)} style={{}} >
            <Text><IconSymbol  size={30} name="close" color="#000"  /></Text>
          </TouchableOpacity>
            <View style={{flexGrow:1}} />
            <View style={{backgroundColor:'#fff'}}>
              <Text style={{color:'#000',marginBottom:10,fontSize:30}} type="title">{render('content','suggestTitle')}</Text>
              <Text style={{color:'#000',marginBottom:10,fontSize:20}} type="subtitle">{render('content','suggestSubTitle')}</Text>
            </View>
        </View>

        <View style={{margin:20,borderWidth:1,border:'1px solid #17233c',borderRadius:20,overflow:'hidden',}}>
          <Text style={{textAlign:'center',color:'#fff',padding:10,backgroundColor:'#17233c',fontWeight:600}} type="subtitle">{render('content','productDetails')}</Text>
          <TextInput require value={pName} name="store" onChangeText={onChangePname} type="text" style={{ height: 40, color:'#fff', textAlign:lang? 'right':'left', width:'100%', borderBottomWidth:1, padding: 10,color:'#000'}} placeholder={render('content','name')} />
          <TextInput require value={note} name="location" onChangeText={onChangeNote} type="text" multiline={true} rows={5} style={{height: 40, color:'#fff', textAlign:lang? 'right':'left', width:'100%',height:90,padding: 10,color:'#000',borderBottomWidth:0}} placeholder={render('content','notes')} />
        </View>
        <TouchableOpacity style={{margin:20,marginTop:0,borderRadius:20,alignItems:'center',padding:20,backgroundColor:'#fcbe0e',color:'#000',fontWeight:700}} >
          <Text>{render('content','addImage')}</Text>
        </TouchableOpacity>


        <View style={{position:'absolute',bottom:0,right:0,left:0,margin:20,borderRadius:20,overflow:'hidden'}}>
          <TouchableOpacity disabled={Boolean(!pName || !note)} style={Boolean(!pName || !note) ? {alignItems:'center',padding:20,backgroundColor:'#ccc',color:'#000',fontWeight:700}:{alignItems:'center',padding:20,backgroundColor:'#fcbe0e',color:'#000',fontWeight:700}} variant='contained' endIcon={<IconSymbol size={30} name="save.fill" color="#000"  />}
          onPress={()=> axios.post(path+'/api/render',{
            for:'product',trigger:'newSuggestion' ,pName:pName,note:note,
          })
          .then(res=> {
            setSuggest(!suggestion)
            onChangeNote('')
            onChangePname('')
          })}>
            <Text>{render('content','save')}</Text>
          </TouchableOpacity>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
//   shine:{
// 	content:'',
//   top:0,
// 	transform:'translateX(100%)',
// 	width:'100%',
// 	height:220,
// 	position: 'absolute',
// 	zIndex:1,
// 	animation: 'slide 1s infinite',
//
//   background: '-moz-linear-gradient(left, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(128,186,232,0) 99%, rgba(125,185,232,0) 100%)',
// 	background: '-webkit-gradient(linear, left top, right top, color-stop(0%,rgba(255,255,255,0)), color-stop(50%,rgba(255,255,255,0.8)), color-stop(99%,rgba(128,186,232,0)), color-stop(100%,rgba(125,185,232,0)))',
// 	background: '-webkit-linear-gradient(left, rgba(255,255,255,0) 0%,rgba(255,255,255,0.8) 50%,rgba(128,186,232,0) 99%,rgba(125,185,232,0) 100%)',
// 	background: '-o-linear-gradient(left, rgba(255,255,255,0) 0%,rgba(255,255,255,0.8) 50%,rgba(128,186,232,0) 99%,rgba(125,185,232,0) 100%)',
// 	background: '-ms-linear-gradient(left, rgba(255,255,255,0) 0%,rgba(255,255,255,0.8) 50%,rgba(128,186,232,0) 99%,rgba(125,185,232,0) 100%)',
// 	background: 'linear-gradient(to right, rgba(255,255,255,0) 0%,rgba(255,255,255,0.8) 50%,rgba(128,186,232,0) 99%,rgba(125,185,232,0) 100%)',
// 	filter: "progid:DXImageTransform.Microsoft.gradient( startColorstr='#00ffffff', endColorstr='#007db9e8',GradientType=1 )",
// },
  cover:{
    height:300,
    top:50,
    padding:20,
    width:'100%',
    borderRadius:20
    // borderBottomEndRadius:20,
    // borderBottomLeftRadius:20,
  },
  button:{
    flex:1
  },
  container: {
    flex: 1,
    overflowY:'scroll',
    // minHeight:'100vh',
    backgroundColor:'#ccc',
    position:'relative',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  input:{
    height: 40,
    color:'#fff',
    textAlign:'right',
    width:'100%',
    borderBottomWidth:1,
    padding: 10,
  }
});
