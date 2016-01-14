/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var RNGMap = require('react-native-gmaps');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableHighlight
} = React;

var getMeHighMobile = React.createClass({

  getInitialState: function(){
      return {
          shops: [],
          lastPosition: 'unknown',
          theOne: 'unknown'
    }
  },
  componentDidMount: function(){
      fetch('http://ramongebben.github.io/getmehigh/data/shops.json')
        .then(res => res.json())
        .then(body => {
            console.log(body.shops)
            this.setState({shops: body.shops})
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
      });
  },
  _getMeHigh: function(){
      this.findShop((theOne => {
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
    var shops = this.state.shops.map((shop, i) => {
        return(<Text key={shop.id} style={styles.instructions}>{shop.name}</Text>)
    });

    var gmhButton;
    if( this.state.lastPosition !== 'unknown' && this.state.shops.length > 1 ){
        gmhButton = <TouchableHighlight style={styles.button} onPress={this._getMeHigh}><Text style={styles.buttonText}>Get Me High</Text></TouchableHighlight>
    }
    return (
      <View style={styles.container}>
          <Text>location: {JSON.stringify(this.state.lastPosition)}</Text>
          <Text>TheOne: {JSON.stringify(this.state.theOne)}</Text>
          {gmhButton}
          <RNGMap
            ref={'gmap'}
            style={ { height: 500, width: 500 } }
            markers={ [
                  { coordinates: {lng: 0.1, lat: 51.0} },
                  {
                    coordinates: {lng: -0.1, lat: 51.0},
                    title: "Click marker to see this title!",
                    snippet: "Subtitle",
                    id: 0,
                    color: 120,
                  }
              ] }
            zoomLevel={10}
            onMapChange={(e) => console.log(e)}
            onMapError={(e) => console.log('Map error --> ', e)}
            center={ { lng: 52.3521678, lat: 4.8587894 } }
            /*
             * clickMarker shows Info Window of Marker with id: 0,
             * hides Info Window if given null
             */
            clickMarker={0}/>
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
    padding: 20
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  button: {
      padding: 10,
      margin: 20,
      backgroundColor: '#7A1496'
  },
  buttonText: {
      fontSize: 20,
      color: '#F5FCFF',
      textAlign: 'center'
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
