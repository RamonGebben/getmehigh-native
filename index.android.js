/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView
} = React;

var getMeHighMobile = React.createClass({

  getInitialState: function(){
      return {
          shops: [
              {name: 'Loading shops', id: '1234'}
          ],
          lastPosition: 'unknown',
          theOne: 'unknown'
    }
  },
  componentDidMount: function(){
      fetch('http://192.168.2.6:3000/shops')
        .then(res => res.json())
        .then(shops =>{
            this.setState({ shops });
            console.log(shops);
        });
        this._getGeoLocation();
  },

  componentWillUnmount: function() {
      navigator.geolocation.clearWatch(this.watchID);
  },
  _getGeoLocation: function(){
      this.watchID = navigator.geolocation.watchPosition((position) => {
          this.setState({lastPosition: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
          }});
          this._getMeHigh()
      });
  },
  _getMeHigh: function(){
      this.findShop((theOne => {
        console.log(theOne);
        this.setState({
            theOne: theOne
        });
      }));
  },
  getDistance: function(p1, p2) {
      // http://www.wikiwand.com/en/Haversine_formula
      const radius = x => x * Math.PI / 180;

      var R = 6378137,
          dLat = radius( p2.lat - p1.lat ),
          dLong = radius( p2.lng - p1.lng ),
          a = Math.sin( dLat / 2 ) * Math.sin( dLat / 2 ) + Math.cos( radius( p1.lat ) ) * Math.cos( radius( p2.lat ) ) * Math.sin( dLong / 2 ) * Math.sin( dLong / 2 ),
          c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
  },
  findShop: function(holaback){
      let theOne = {};
      this.state.shops.forEach(( shop ) => {
          shop.distance = this.getDistance( this.state.lastPosition, shop.location );
          if( shop.distance <= theOne.distance || theOne.distance === undefined ){
              theOne = shop;
          }
      });
      if(holaback) holaback(theOne);
  },
  render: function() {
    var shops = this.state.shops.map((shop) => {
        return(<Text key={shop.id} style={styles.instructions}>{shop.name}</Text>)
    });
    return (
      <View>
          <Text>location: {JSON.stringify(this.state.lastPosition)}</Text>
          <Text>TheOne: {JSON.stringify(this.state.theOne)}</Text>
          <ScrollView
            automaticallyAdjustContentInsets={false}
            scrollEventThrottle={200}
            style={styles.scrollView}>
            {shops}
          </ScrollView>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  scrollView: {
      height: 300,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('getMeHighMobile', () => getMeHighMobile);
