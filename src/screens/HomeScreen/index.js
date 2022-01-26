import React, {useState, useEffect} from 'react';
import {View, Text, Pressable} from 'react-native';

import {Auth, API, graphqlOperation} from 'aws-amplify';
import {getCar} from '../../graphql/queries';
import {updateCar, updateOrder} from '../../graphql/mutations';
import {listOrders} from '../../graphql/queries';

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
  const [car, setCar] = useState(null);
  const [order, setOrder] = useState(null);
  const [newOrders, setNewOrders] = useState([]);

  const renderBottomTitle = () => {
    if (order && order.isFinished) {
      return (
        <View style={{alignItems: 'center'}}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#490381',
              width: 211,
              padding: 10,
            }}>
            <Text style={{fontWeight: '900', fontSize: 17}}>
              COMPLETE {order.type}
            </Text>
          </View>
          <Text style={styles.bottomText}>
            {order.user?.username
              ? order.user.username
              : 'Liquid The Silence9!'}
          </Text>
        </View>
      );
    } else if (order && order.pickedUp) {
      return (
        <View style={{alignItems: 'center'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{color: '#0c04ec', fontSize: 17, fontWeight: '700'}}>
              {order.duration ? order.duration.toFixed(1) : '?'} min
            </Text>
            <View
              style={{
                backgroundColor: '#a10303',
                width: 31,
                height: 31,
                alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: 9,
                borderRadius: 39,
              }}>
              <FontAwesome name={'user'} size={19} />
            </View>
            <Text style={{color: '#0c04ec', fontSize: 17, fontWeight: '700'}}>
              {order.distance ? order.distance.toFixed(1) : '?'} km
            </Text>
          </View>
          <Text style={styles.bottomText}>
            Dropping off{' '}
            {order.user?.username
              ? order.user.username
              : 'Liquid The Silence9!'}
          </Text>
        </View>
      );
    } else if (order) {
      return (
        <View style={{alignItems: 'center'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{color: '#0c04ec', fontSize: 17, fontWeight: '700'}}>
              {order.duration ? order.duration.toFixed(1) : '?'} min
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
              <FontAwesome name={'user'} size={19} />
            </View>
            <Text style={{color: '#0c04ec', fontSize: 17, fontWeight: '700'}}>
              {order.distance ? order.distance.toFixed(1) : '?'} km
            </Text>
          </View>
          <Text style={styles.bottomText}>
            Picking up{' '}
            {order.user?.username
              ? order.user.username
              : 'Liquid The Silence9!'}
          </Text>
        </View>
      );
    } else if (car?.isActive) {
      return <Text style={styles.bottomText}>You're online</Text>;
    } else {
      return <Text style={styles.bottomText}>You're offline</Text>;
    }
  };

  const onGoPressed = async () => {
    try {
      const userData = await Auth.currentAuthenticatedUser();

      const input = {
        id: userData.attributes.sub,
        isActive: !car.isActive,
      };

      const updatedCarData = await API.graphql(
        graphqlOperation(updateCar, {input}),
      );

      setCar(updatedCarData.data.updateCar);
    } catch (e) {
      console.error('Error', e);
    }
  };

  const onAccept = newOrder => {
    try {
      const input = {
        id: newOrder.id,
        status: 'PICKING_UP_CLIENT',
        carId: car.id,
      };

      const orderData = await API.graphql(
        graphqlOperation(updateOrder, {input}),
      );
      setOrder(orderData.data.updateOrder);
    } catch (e) {
      console.error('update order Error', e);
    }

    setNewOrders(newOrders.slice(1));
  };

  const onDecline = () => {
    setNewOrders(newOrders.slice(1));
  };

  const onDirectionFound = event => {
    if (order) {
      setOrder({
        ...order,
        distance: event.distance,
        duration: event.duration,
        pickedUp: order.pickedUp || order.distance < 0.2,
        isFinished: order.pickedUp && order.distance < 0.2,
      });
    }
  };

  const onUserLocationChange = async event => {
    const {latitude, longitude, heading} = event.nativeEvent.coordinate;

    try {
      const userData = await Auth.currentAuthenticatedUser();

      const input = {
        id: userData.attributes.sub,
        latitude,
        longitude,
        heading,
      };

      const updatedCarData = await API.graphql(
        graphqlOperation(updateCar, {input}),
      );

      setCar(updatedCarData.data.updateCar);
    } catch (e) {
      console.error('Error', e);
    }
  };

  const getDestination = () => {
    if (order && order.pickedUp) {
      return {
        latitude: order.destinationLatitude,
        longitude: order.destinationLongitude,
      };
    }
    return {
      latitude: order.originLatitude,
      longitude: order.originLongitude,
    };
  };

  const fetchCar = async () => {
    try {
      const userData = await Auth.currentAuthenticatedUser();
      const carData = await API.graphql(
        graphqlOperation(getCar, {id: userData.attributes.sub}),
      );
      setCar(carData.data.getCar);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchOrders = async () => {
    try {
      const ordersData = await API.graphql(graphqlOperation(listOrders));
      setNewOrders(ordersData.data.listOrders.items);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCar();
    fetchOrders();
  }, []);

  return (
    <View>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        // userLocationUpdateInterval={1000}
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
            origin={{
              latitude: car?.latitude,
              longitude: car?.longitude,
            }}
            destination={getDestination()}
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
        <SimpleLineIcons name="options-vertical" size={23} color="#0c04ec" />
      </Pressable>

      <Pressable
        onPress={() => console.warn('lit it pressed!')}
        style={[styles.roundBtn, {top: 11, right: 11}]}>
        <FontAwesome5 name="search" size={23} color="#0c04ec" />
      </Pressable>

      <Pressable
        onPress={() => console.warn('lit it pressed!')}
        style={[styles.roundBtn, {bottom: 109, left: 11}]}>
        <Ionicons name="shield-sharp" size={23} color="#0c04ec" />
      </Pressable>

      <Pressable
        onPress={() => console.warn('lit it pressed!')}
        style={[styles.roundBtn, {bottom: 109, right: 11}]}>
        <Entypo name="chat" size={23} color="#0c04ec" />
      </Pressable>

      <Pressable
        onPress={onGoPressed}
        style={[styles.roundBtn, {bottom: 109, right: 16}]}>
        <Text style={[styles.textGo, car?.isActive && {left: -211}]}>
          {car?.isActive ? 'Stop' : 'Go!'}
        </Text>
      </Pressable>

      <View style={styles.bottomContainer}>
        <Ionicons name="options" size={23} color="#0c04ec" />
        {renderBottomTitle()}
        <Entypo name="menu" size={23} color="#0c04ec" />
      </View>

      {newOrders.length > 0 && !order && (
        <NewOrderPopup
          newOrder={newOrders[0]}
          onDecline={onDecline}
          duration={19.6}
          distance={11.1}
          onAccept={() => onAccept(newOrders[0])}
        />
      )}
    </View>
  );
};

export default HomeScreen;
