import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    bottom: 7,
    width: '100%',
    padding: 20,
    height: '100%',
    justifyContent: 'space-between',
    backgroundColor: '#00000099',
  },
  declineBtn: {
    backgroundColor: '#02033d',
    padding: 20,
    borderRadius: 41,
    width: 91,
    alignItems: 'center',
  },
  declineText: {
    color: 'lightgrey',
    fontWeight: 'bold',
  },
  acceptBtn: {
    backgroundColor: '#02033d',
    borderRadius: 10,
    alignItems: 'center',
    height: 261,
    justifyContent: 'space-around',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 11,
  },
  userBackground: {
    backgroundColor: '#490381',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60,
  },
  uberType: {
    fontSize: 21,
    color: 'lightgrey',
    marginHorizontal: 13,
  },
  minutes: {
    color: 'lightgrey',
    fontSize: 36,
  },
  distance: {
    fontSize: 27,
    color: 'lightgrey',
  },
});

export default styles;
