import React , {useEffect} from 'react';
import {StatusBar, Platform, ScrollView,SafeAreaView,StyleSheet,View,Modal,Image,Button, TouchableOpacity, TouchableHighlight, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from '@/components/Themed';

import { useFocusEffect } from '@react-navigation/native';


import FontAwesome from '@expo/vector-icons/FontAwesome';

import axios from 'axios';

function IconSymbol(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}


import { Collapsible } from '@/components/Collapsible';


export default function TabTwoScreen(props) {

  const [lang, setLang] = React.useState(2);

    const [settings, setSettings] = React.useState(undefined);




  // const [path, setPath] = React.useState('http://127.0.0.1:8000');
  const [path, setPath] = React.useState('https://www.almuheetco.com');

  const [name, onChangeName] = React.useState('');
  const [number, onChangeNumber] = React.useState('');


  const [order, setOrder] = React.useState(undefined);
  const [cart, setCart] = React.useState(undefined);
  const [charge, setCharge] = React.useState(1);
  const [cashType, setCash] = React.useState(1);
  const [complete, setComplete] = React.useState(false);

  const [time, setTime] = React.useState(new Date());
  const [loading, setLoading] = React.useState(undefined);

  function render(forC,trigger) {
    if (settings) {
      return settings.filter(e=>e.for==forC).filter(e=>e.trigger==trigger).map((e)=> lang ? e.content : e.content_en).toString()
    }else {
      return ''
    }
  }




    const [user, setUser] = React.useState(undefined);
    const [invoice, setInvoice] = React.useState(undefined);


    useFocusEffect(
      React.useCallback(() => {
        if (user == undefined) {
          AsyncStorage.multiGet(['publicData', 'invoiceId']).then((data) => {
            console.log('data',JSON.parse(data[0][1]));

            if (JSON.parse(data[0][1])) {
              setUser(JSON.parse(data[0][1]))
            }
            if (JSON.parse(data[1][1])) {
              setInvoice(JSON.parse(data[1][1]))
            }
          });
        }
      }, [user])
    );



  useFocusEffect(
    React.useCallback(() => {
        axios.post(path + '/api/render', { for: 'cart',invoice:invoice,id:user ? user.id : undefined,  })
          .then(res => {
            if (res.data.orders.length) {
              setOrder(res.data.orders[res.data.orders.length - 1])
            }
            setCart(res.data.cart)
            setSettings(res.data.settings)
            setLoading(false)
            setLang(res.data.lang == 'en' ? 0:1)
          });
    }, [loading,user])
  );




  return (
    <View style={styles.container}>
      {order ?
        <View style={{height:'100%',}}>

          <View style={{width:'100%',height:150,backgroundColor:'#17233c',alignItems: 'center'}}>
            <Text  style={{marginTop:40}}><IconSymbol size={40} color="#fcbe0e" name="shopping-cart"/></Text>
          </View>


          <View spacing={1} style={{backgroundColor: '#fff',margin: 20,marginBottom:0,borderRadius: 20,overflow: 'hidden',marginTop: -60,zIndex: 1501,boxShadow: '1px 1px 6px #00000061'}}>
            <View style={{display:'flex',flexDirection:'row',}}>
              <Text type="title" style={{ padding:4,flex:1,fontSize: 20 }}>{render('content','status')}</Text>
              <Text style={{padding:4,flex:1,fontWeight:600, backgroundColor:order && order.status == 0 ? '#fcbe0e': [2,4].includes(order.status) ? 'red' : '#ccc' , } }>{order && order.status == 1 ? render('content','accepted') : render('content','pendingApprove')}</Text>
            </View>
            {order.delivery == 2 && <View style={{display:'flex',flexDirection:'row',}}>
              <Text type="title" style={{ padding:4,flex:1,fontSize: 20 }}>{render('content','transport')}</Text>
              <Text type="title" style={{ flex:1,fontSize: 20 }}>{order && order.delivery_cash ? order.delivery_cash : '-- --'}</Text>
            </View>}
            {order.tax && <View style={{display:'flex',flexDirection:'row',}}>
              <Text type="title" style={{ padding:4,flex:1,fontSize: 20 }}>{render('content','tax')}</Text>
              <Text type="title" style={{ flex:1,fontSize: 20 }}>{order && order.tax ? order.tax : '-- --'}</Text>
            </View>}
            <View style={{display:'flex',flexDirection:'row',}}>
              <Text type="title" style={{ padding:4,flex:1,fontSize: 30 }}>{render('content','total')}</Text>
              <Text type="title" style={{ flex:1,fontSize: 30 }}>{order && order.total ? order.total : '-- --'}</Text>
            </View>
          </View>

          {false && <TouchableOpacity onPress={()=> { setLang(lang ? 0: 1) }} style={{alignItems:'center',flexDirection:lang ? 'row':'row-reverse',boxShadow:'1px 1px 6px #00000030',borderRadius:20,width:'94%',padding:10,paddingLeft:20,paddingRight:20,marginVertical: 10,marginHorizontal: 10,color:'#000',backgroundColor: '#ccc5'}}  >
            <Text style={{marginLeft:20,marginRight:20,textAlign:!lang ? 'left':'right',fontWeight:600,color:'#000',}}>{render('content','lang')}</Text>
          </TouchableOpacity>}
          <View style={{ alignContent: 'space-between', display: 'grid', padding: 20 }}>
            <ScrollView style={{height:'100%',}} >

            <TextInput placeholder={render('content','notes')} style={{borderRadius:20,overflow:'hidden',backgroundColor:'#fff', height: 60, color:'#000', textAlign:lang ? 'right':'left', width:'100%', border:'1px solid #ccc', padding: 10,  textAlignLast:lang ? 'right':'left'}}/>

            {charge == 1 ?
              <Text style={{fontSize:15,fontWeight:600,padding:10,textAlign:'center'}}> {render('content','transportation')} </Text>
            :
              <Text style={{fontSize:15,fontWeight:600,padding:10,textAlign:'center'}}> {render('content','transCompany')} </Text>
            }

            <View style={{marginBottom:20,flexDirection:'row',borderRadius:20,overflow:'hidden'}}>
              <TouchableOpacity onPress={()=> setCharge(1)} disabled={Boolean(charge == 1)} style={{justifyContent:'center',alignItems:'center',flex:1, minHeight:60, fontWeight:600, backgroundColor: Boolean(charge == 1) ? '#ccc':'#fcbe0e'  }} fullWidth>
                <Text style={{fontSize:15,fontWeight:600}}> {render('content','transportCompany')} </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=> setCharge(2)} disabled={Boolean(!order || order && order.total == undefined || order && order.total <= 2000 && charge == 2)} style={{justifyContent:'center',alignItems:'center',flex:1, minHeight:60, fontWeight:600, opacity:Boolean(!order || order && order.total == undefined || order && order.total <= 2000 && charge == 2) ? '0.3':'1', backgroundColor: Boolean(charge == 2) ? '#ccc':'#fcbe0e'  }} fullWidth>
                <Text style={{fontSize:15,fontWeight:600}}> {render('content','freeDelivery')} </Text>
              </TouchableOpacity>
            </View>


            <View style={{paddingBottom:280}} >
                {order && order.items_details && order.items_details.map((x,k) =>
                  <View style={{borderRadius:20,backgroundColor:'#fff',marginBottom:10,flexDirection:'row'}} key={k}>
                    <View style={{ flex:1,padding: 10, }}>
                      <Text type="title">{lang ? x.product.name : x.product.name_en}</Text>
                      <Text style={{}} > {x.price+ ' x ' + x.quantity + ' = ' + x.price * x.quantity} </Text>
                    </View>
                    <View style={{borderRadius:20,overflow:'hidden',flexDirection:'row',}}>
                      <TouchableOpacity size="small" style={{ color: '#000', backgroundColor: '#fcbe0e',padding:10 }} fullWidth variant='contained' onPress={() => axios.post(path+'/api/render',{for:'order',trigger:'updateItem',id:x.id,value:x.quantity-1,col:'quantity'}).then(res=>  {setLoading(true)} ) } >
                        <Text><IconSymbol size={20} name="minus" color="#000" /></Text>
                      </TouchableOpacity>
                      <TouchableOpacity size="small" disabled fullWidth variant='contained' onClick={() => { }} >
                        <Text style={{padding:10}}>{x.quantity}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity size="small" style={{ color: '#000', backgroundColor: '#fcbe0e',padding:10 }} fullWidth variant='contained' onPress={() => axios.post(path+'/api/render',{for:'order',trigger:'updateItem',id:x.id,value:x.quantity+1,col:'quantity'}).then(res=>  {setLoading(true)} ) } >
                        <Text><IconSymbol size={20} name="plus" color="#000" /></Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
            </View>
            </ScrollView >
          </View>

          <View style={{position:'fixed',top:'auto',bottom:90,left:20,right:20,flexDirection:'row',borderRadius:30,boxShadow: '1px 1px 6px #00000061',overflow:'hidden'}}>
            <TouchableOpacity onPress={() => { }} style={{ fontWeight: 600,  backgroundColor: '#17233c',padding:20 }} variant='contained'>
              <Text style={{fontSize:15,color: '#fff',fontWeight:600}}> {render('content','cancel')} </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setComplete(!complete) }} disabled={ Boolean(order.status == 0)} style={{justifyContent:'center',alignItems:'center',flex:1, minHeight:60, fontWeight:600, backgroundColor: Boolean(order.status == 0) ? '#ccc':'#fcbe0e'  }} fullWidth variant='contained'>
            <Text style={{fontSize:15,color: '#000',fontWeight:600}}>
              {render('content','proceed')}
            </Text>
            </TouchableOpacity>
          </View>


          <Modal animationType="slide" transparent={false} presentationStyle="pageSheet" visible={Boolean(complete)} onClose={()=> setComplete(!complete)}>
            <View style={{display:'flex',padding:20,flexDirection:lang ? 'row-reverse':'row',justifyContent:'space-between'}}>
              <View style={{backgroundColor:'#fff'}}>
                <Text style={{color:'#000',marginBottom:10,fontSize:30}}>{render('content','completeData')}</Text>
                <Text style={{color:'#000',marginBottom:10,fontSize:20}}>{render('content','completeInvoice')}</Text>
              </View>
              <View style={{flexGrow:1}} />
              <TouchableOpacity onPress={()=> setComplete(!complete)} >
                <Text><IconSymbol size={30} name="close" color="#000"  /></Text>
              </TouchableOpacity>
            </View>


            <View style={{margin:20,flexDirection:'row',borderRadius:20,overflow:'hidden'}}>
               <TouchableOpacity onPress={()=> setCash(1)} style={{justifyContent:'center',alignItems:'center',flex:1, minHeight:60, fontWeight:600, backgroundColor: Boolean(cashType == 2) ? '#ccc':'#fcbe0e'  }}   fullWidth>
               <Text>{render('content','transfer')}</Text>
               </TouchableOpacity>
              <TouchableOpacity onPress={()=> setCash(2)} style={{justifyContent:'center',alignItems:'center',flex:1, minHeight:60, fontWeight:600, backgroundColor: Boolean(cashType == 1) ? '#ccc':'#fcbe0e'  }}  fullWidth>
              <Text>{render('content','wallet')}</Text>
              </TouchableOpacity>
            </View>
            <View style={{marginLeft:20,marginRight:20,borderRadius:20,overflow:'hidden'}}>
              <TouchableOpacity style={{justifyContent:'center',alignItems:'center', minHeight:60, fontWeight:600, backgroundColor: '#fcbe0e' }}>
                <Text style={{color:'#000'}}>{render('content','addImage')}</Text>
              </TouchableOpacity>
            </View>
            <View style={{margin:20,borderWidth:1,border:'1px solid #17233c',borderRadius:20,overflow:'hidden',}}>
              <Text style={{textAlign:'center',color:'#fff',padding:5,backgroundColor:'#17233c'}} type="subtitle">{render('content','total')}</Text>
              <TextInput value={order && parseInt(order.total) + (order.delivery ? parseInt(order.delivery_cash) : 0)} name="number" onChangeText={onChangeNumber} type="phone-pad" style={{borderRadius:20,overflow:'hidden',backgroundColor:'#fff', height: 40, color:'#000', textAlign:lang ? 'right':'left', width:'100%', padding: 10,}} />
            </View>


          <View style={{margin:20,borderRadius:20,overflow:'hidden'}}>
            <TouchableOpacity style={{flexDirection:'row',justifyContent:'center',alignItems:'center', minHeight:60, backgroundColor: '#fcbe0e' }}
            onPress={()=> axios.post(path+'/api/render',{
              for:'order',
              trigger:'cash',
              cashType:cashType,
              order_id:order.id,
              total:order && parseInt(order.total) + (order.delivery ? parseInt(order.delivery_cash) : 0)
            }).then(res=> {
              setComplete(false),setOrder(false),setLoading(true),setInvoice(undefined),AsyncStorage.removeItem("invoiceId")
            }) }>
              <Text style={{fontWeight:600,}}> {render('content','pay')} </Text>
             </TouchableOpacity>
          </View>
          </Modal>

        </View>
        : !loading && cart  ?
        <View>
          <View style={{width:'100%',height:300,backgroundColor:'#17233c',alignItems: 'center',justifyContent: 'center'}}>
            <IconSymbol size={160} color="#fcbe0e" name="shopping-cart" style={styles.headerImage}/>
            <View spacing={1} style={{borderRadius: 20, overflow: 'hidden',padding: 10,  textAlign:'center'}}>
              <Text style={{color:'#fff',textAlign:'center',fontWeight:700,fontSize:20}} type="title">{render('content','emptyCart')}</Text>
            </View>
          </View>

        <View style={{padding:20,width:'100%'}}>
            {Boolean(cart && cart.length) && <Text style={{fontSize:20,textAlign:'right'}}> {render('content','oldOrders')}</Text> }
            <ScrollView style={{height:'100%'}}>
            {cart && cart.map((row,key)=>
              <Collapsible key={key} title={
                <View style={{width:'100%',borderColor:'#ccc',borderBottomWidth:1,borderBottomEndRadius:1,padding:20,height:'fit-content',display:'flex',flexDirection:'row',}}>
                  <Text style={row.status == 2 ? {fontWeight: 600, color: '#000', backgroundColor: '#fcbe0e',flex:1}:{flex:1}} > {row.status == 2 ? render('content','onDelivery') :render('content','delivered') } </Text>
                  <Text style={{flex:1}}>{render('content','total')} {row.total}  </Text>
                </View>
              }>


              {row.items_details.map((x,k) =>
                <View key={k} style={{backgroundColor:'#fff',width:'100%',display:'flex',flexDirection:'row',alignItems:'center',padding:10}}>
                  <View style={{ padding: 10,flex:1 }}>
                    <Text type="title">{lang ? x.product.name : x.product.name_en}</Text>
                  </View>
                  {x.price ? <Text style={{marginLeft:10}}> {x.price+ ' x ' + x.quantity + ' = ' + x.price * x.quantity} </Text> : <Text>{ render('content','priceStatus') }</Text>}

                </View>
              )}

              </Collapsible>
            )}
            </ScrollView >

        </View>
        </View>
        :
        <View>
          <Text style={{fontSize:25,margin:'auto',padding:150,justifyContent:'center',alignItems:'center',alignContent:'center'}}>
          {render('content','loading')}
          </Text>
        </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
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
});
