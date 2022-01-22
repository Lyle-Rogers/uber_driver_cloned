import React, {useState} from 'react';
import {View, Text, Pressable} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import styles from './styles';
import NewOrderPopup from '../../components/NewOrderPopup';

import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

const GOOGLE_MAPS_APIKEY = 'AIzaSyAam02XqgZvjwfcCrTlHuwpNrEGFADow7k';

const HomeScreen = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [myPosition, setMyPosition] = useState(null);
  const [order, setOrder] = useState(null);
  const [newOrder, setNewOrder] = useState({
    id: '1',
    type: 'UberX',

    originLatitude: 28.450927,
    originLongitude: -16.213045,

    destinationLatitude: 28.490126,
    destinationLongitude: -16.261045,

    user: {
      rating: 3.1,
      name: 'liq the silence1',
    },

    duration: 7,
    distance: 11,
  });

  const renderBottomTitle = () => {
    if (order) {
      return (
        <View style={{alignItems: 'center'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{color: '#0c04ec', fontSize: 17, fontWeight: '700'}}>
              {order.duration ? order.duration.toFixed(1) : '?'}
            </Text>
            <View
              style={{
                backgroundColor: '#490381',
                width: 31,
                height: 31,
                alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: 9,
                borderRadius: 39,
              }}>
              <FontAwesome name={'user'} color={'black'} size={19} />
            </View>
            <Text style={{color: '#0c04ec', fontSize: 17, fontWeight: '700'}}>
              {order.distance ? order.distance.toFixed(1) : '?'}
            </Text>
          </View>
          <Text style={styles.bottomText}>Picking up {order.user.name}</Text>
        </View>
      );
    }
    if (isOnline) {
      return <Text style={styles.bottomText}>You're online</Text>;
    } else {
      return <Text style={styles.bottomText}>You're offline</Text>;
    }
  };

  const onGoPressed = () => {
    setIsOnline(!isOnline);
  };

  const onAccept = newOrder => {
    setOrder(newOrder);
    setNewOrder(null);
  };

  const onDecline = () => {
    setNewOrder(null);
  };

  const onDirectionFound = event => {
    if (order) {
      setOrder({
        ...order,
        distance: event.distance,
        duration: event.duration,
      });
    }
  };

  const onUserLocationChange = event => {
    setMyPosition(event.nativeEvent.coordinate);
  };

  return (
    <View>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        // userLocationUpdateInterval={3000}
        // userLocationFastestInterval={3000}
        showsMyLocationButton={false}
        onUserLocationChange={onUserLocationChange}
        initialRegion={{
          latitude: 28.450627,
          longitude: -16.263045,
          latitudeDelta: 0.071,
          longitudeDelta: 0.061,
        }}
        showsUserLocation={true}>
        {order && (
          <MapViewDirections
            // origin={{
            //   latitude: myPosition.latitude,
            //   longitude: myPosition.longitude,
            // }}
            origin={myPosition}
            destination={{
              latitude: order.destinationLatitude,
              longitude: order.destinationLongitude,
            }}
            onReady={onDirectionFound}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={6}
          />
        )}
      </MapView>

      <Pressable
        onPress={() => console.warn('lit it pressed!')}
        style={styles.balanceBtn}>
        <Text style={styles.balanceText}>
          <Text style={{color: '#490381'}}>$</Text> 0.00
        </Text>
      </Pressable>

      <Pressable
        onPress={() => console.warn('lit it pressed!')}
        style={[styles.roundBtn, {top: 11, left: 11}]}>
        <SimpleLineIcons name="options-vertical" size={23} color="#0b06af" />
      </Pressable>

      <Pressable
        onPress={() => console.warn('lit it pressed!')}
        style={[styles.roundBtn, {top: 11, right: 11}]}>
        <FontAwesome5 name="search" size={23} color="#0b06af" />
      </Pressable>

      <Pressable
        onPress={() => console.warn('lit it pressed!')}
        style={[styles.roundBtn, {bottom: 109, left: 11}]}>
        <Ionicons name="shield-sharp" size={23} color="#0b06af" />
      </Pressable>

      <Pressable
        onPress={() => console.warn('lit it pressed!')}
        style={[styles.roundBtn, {bottom: 109, right: 11}]}>
        <Entypo name="chat" size={23} color="#0b06af" />
      </Pressable>

      <Pressable
        onPress={onGoPressed}
        style={[styles.roundBtn, {bottom: 109, right: 16}]}>
        <Text style={[styles.textGo, isOnline ? {left: -211} : null]}>
          {isOnline ? 'Stop' : 'Go!'}
        </Text>
      </Pressable>

      <View style={styles.bottomContainer}>
        <Ionicons name="options" size={23} color="#0b06af" />
        {renderBottomTitle()}
        <Entypo name="menu" size={23} color="#0b06af" />
      </View>

      {newOrder && (
        <NewOrderPopup
          newOrder={newOrder}
          onDecline={onDecline}
          duration={newOrder.duration}
          distance={newOrder.distance}
          onAccept={() => onAccept(newOrder)}
        />
      )}
    </View>
  );
};

export default HomeScreen;
