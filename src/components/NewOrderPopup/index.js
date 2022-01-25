import React from 'react';
import {View, Text, Pressable} from 'react-native';

import styles from './styles';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';

const NewOrderPopup = ({newOrder, onAccept, onDecline}) => {
  return (
    <View style={styles.root}>
      <Pressable onPress={onDecline} style={styles.declineBtn}>
        <Text style={styles.declineText}>Decline</Text>
      </Pressable>

      <Pressable onPress={onAccept} style={styles.acceptBtn}>
        <View style={styles.row}>
          <Text style={styles.uberType}>{newOrder.type}</Text>

          <View style={styles.userBackground}>
            <FontAwesome name={'user'} size={35} />
          </View>

          <Text style={styles.uberType}>
            <AntDesign name="star" size={17} />
            {newOrder.user?.rating ? newOrder.user.rating : 3.1}
          </Text>
        </View>

        <Text style={styles.minutes}>{newOrder.duration} min</Text>

        <Text style={styles.distance}>{newOrder.distance} km</Text>
      </Pressable>
    </View>
  );
};

export default NewOrderPopup;
