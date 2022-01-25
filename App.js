/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {StatusBar, SafeAreaView, PermissionsAndroid} from 'react-native';

import Amplify, {Auth, API, graphqlOperation} from 'aws-amplify';
import awsconfig from './src/aws-exports';
import {withAuthenticator} from 'aws-amplify-react-native';

Amplify.configure(awsconfig);

import {createCar} from './src/graphql/mutations';
import {getCarId} from './src/graphql/queries';

import HomeScreen from './src/screens/HomeScreen';

const App = () => {
  const androidPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'uber cloned location permissions need granting',
          message:
            'uber cloned will need your location access!' +
            'so you can take awesome latitude calcs and a little longitude as well!.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('It was granted and the location system will work');
      } else {
        console.log("It was denied! We're very f**ked!");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      androidPermission();
    } else {
      // Requests for ios permissions and not android!
      Geolocation.requestAuthorization();
    }

    const updateUserCar = async () => {
      const authenticatedUser = await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });
      if (!authenticatedUser) {
        return;
      }

      const carData = await API.graphql(
        graphqlOperation(getCarId, {id: authenticatedUser.attributes.sub}),
      );

      if (carData.data.getCar) {
        console.log('User already has a car assigned.', carData);
        return;
      }

      const newCar = {
        id: authenticatedUser.attributes.sub,
        type: 'UberX',
        userId: authenticatedUser.attributes.sub,
      };

      await API.graphql(graphqlOperation(createCar, {input: newCar}));
    };

    updateUserCar();
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <HomeScreen />
      </SafeAreaView>
    </>
  );
};

export default withAuthenticator(App);
