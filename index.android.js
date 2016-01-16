/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var RNGMap = require('react-native-gmaps');
var MK = require('react-native-material-kit');
var Polyline = require('react-native-gmaps/Polyline');

var {
  MKButton,
  MKColor,
  mdl,
  MKCardStyles
} = MK;

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableHighlight
} = React;

MK.setTheme({
  primaryColor: MKColor.Teal,
  accentColor: MKColor.Purple,
});

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
  onMapChange: function(e){
      console.log(e);
  },
  onMapError: function(e){
      console.log('map error -->', e);
  },
  render: function() {

    if( this.state.theOne !== 'unknown') {
        return this._renderMap();
    }else {
        return this._renderStart();
    }
  },
  _renderStart: function(){
      var ColoredFlatButton =  MKButton.coloredButton()
          .withText('Get Me High')
          .withTextStyle(styles.buttonText)
          .withOnPress(this._getMeHigh)
          .build();
      if( this.state.lastPosition !== 'unknown' && this.state.shops.length > 1 ){
          return(
              <View style={styles.container}>
                <ColoredFlatButton />
              </View>);
      }else {
          return(<View style={styles.container}>
            <mdl.Spinner style={styles.spinner}/>
            <Text style={styles.text}>Getting your location</Text>
          </View>);
      }
  },
  _renderMap: function(){
      return (<RNGMap
        ref={'gmap'}
        style={ styles.map }
        markers={ [
              {
                coordinates: this.state.theOne.location,
                title: this.state.theOne.name,
                snippet: "Subtitle",
                id: 0,
                color: 120,
              }
          ] }
        zoomLevel={ 13 }
        onMapChange={(e) => console.log(e)}
        onMapError={(e) => console.log('Map error --> ', e)}
        center={ this.state.lastPosition }
        clickMarker={0} />);
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
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  map: {
    flex: 1
  },
  button: {
      padding: 60,
      margin: 20,
      width: 300,
      height: 300,
      backgroundColor: '#7A1496',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 300
  },
  buttonText: {
      fontSize: 30
  },
  scrollView: {
      height: 300,
  },
  legendLabel: {
    textAlign: 'center',
    color: '#666666',
    marginTop: 10, marginBottom: 20,
    fontSize: 12,
    fontWeight: '300',
  },
  spinner: {
    width: 120,
    height: 120,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('getMeHighMobile', () => getMeHighMobile);
