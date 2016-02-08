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
  TouchableHighlight,
  BackAndroid
} = React;

MK.setTheme({
  primaryColor: MKColor.Pink,
  accentColor: MKColor.Purple,
});

const SliderWithValue = mdl.Slider.slider()
  .withMin(5)
  .withMax(500)
  .build();

var getMeHighMobile = React.createClass({

  getInitialState: function(){
      return {
          shops: [],
          lastPosition: null,
          theOne: 'unknown',
          searchRadius: 5,
          withinRadius: [],
          history: ['start']
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
        BackAndroid.addEventListener('hardwareBackPress', () => {
            return false; 
        });
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
      if( this.state.lastPosition && this.state.shops.length > 0 ){
          this.findShops((withinRadius => {
            let newHistory = this.state.history;
            newHistory.pop(); // Remove the loading screen;
            newHistory.push('map');
            this.setState({ withinRadius, history: newHistory });
          }));
      }else {
          this.state.history.push('loading');
          setTimeout(() => {
              this._getMeHigh();
          }, 1000);
      }

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
  findShops: function(holaback){
      let withinRadius = this.state.shops.filter(( shop ) => {
          shop.distance = this.getDistance( this.state.lastPosition, shop.location );
          let distanceInKilometer = Math.ceil(shop.distance) / 1000;
          if( distanceInKilometer < this.state.searchRadius ){
              return shop;
          }
      });
      if(holaback) holaback(withinRadius);
  },
  onMapChange: function(e){
      console.log(e);
  },
  onMapError: function(e){
      console.log('map error -->', e);
  },
  onRadiusChange: function(value){
      this.setState({searchRadius: Math.ceil(value)});
  },
  render: function() {
      let route = this.state.history[this.state.history.length -1];
      switch (route) {
          case 'loading':
            return this._renderLoading();
          case 'start':
              return this._renderStart();
          case 'map':
              return this._renderMap();

      }
  },
  _renderStart: function(){
      var GetMeHighButton =  MKButton.coloredButton()
          .withText('Get Me High')
          .withTextStyle(styles.buttonText)
          .withOnPress(this._getMeHigh)
          .build();


          return(
              <View style={styles.container}>
              <Text>{ `Within ${this.state.searchRadius}km range` }</Text>
              <SliderWithValue  ref='sliderWithValue'
                                style={styles.slider}
                                onChange={this.onRadiusChange} />
                <GetMeHighButton />
              </View>);
  },
  _renderLoading: function(){
        return(<View style={styles.container}>
          <mdl.Spinner style={styles.spinner}/>
          <Text style={styles.text}>Getting your location</Text>
        </View>);
  },
  _renderMap: function(){
      return (<RNGMap
        ref={'gmap'}
        style={ styles.map }
        markers={ this.state.withinRadius.map(shop => {
            let snippet = `${shop.adress} ${shop.city}`;
            return {
                coordinates: shop.location,
                title: shop.name,
                id: shop.id,
                snippet: snippet,
                color: 120
            }
        })}
        zoomLevel={ 12 }
        onMapChange={this.onMapChange}
        onMapError={this.onMapError}
        center={ this.state.lastPosition }/>);
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
  buttonText: {
      fontSize: 30
  },
  scrollView: {
      height: 300,
  },
  slider: {
      width: 300,
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
