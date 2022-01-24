import {StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';

const styles = StyleSheet.create({
  map: {
    height: Dimensions.get('window').height - 76,
    width: '100%',
  },
  bottomContainer: {
    height: 100,
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 33,
    padding: 13,
  },
  bottomText: {
    color: '#0c04ec',
    fontSize: 23,
    fontWeight: '700',
  },
  balanceBtn: {
    position: 'absolute',
    backgroundColor: 'black',
    borderRadius: 21,
    padding: 9,
    paddingHorizontal: 26,
    top: 14,
    left: 144,
  },
  balanceText: {
    color: '#0c04ec',
    fontSize: 19,
    fontWeight: '900',
  },
  roundBtn: {
    position: 'absolute',
    backgroundColor: 'black',
    color: 'black',
    padding: 11,
    borderRadius: 22,
  },
  textGo: {
    position: 'absolute',
    backgroundColor: 'darkblue',
    color: 'black',
    fontSize: 23,
    fontWeight: '900',
    padding: 27,
    borderRadius: 54,
    bottom: -3,
    left: -207,
  },
});

export default styles;
