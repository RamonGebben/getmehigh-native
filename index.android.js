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
} = React;
var Mapbox = require('react-native-mapbox-gl');

var getMeHighMobile = React.createClass({
  getInitialState: function() {
    return {
      mapLocation: {
        latitude: 0,
        longitude: 0
       },
       center: {
         latitude: 40.72345355209305,
         longitude: -73.99343490600586
       },
       annotations: [{
         latitude: 40.72052634,
         longitude:  -73.97686958312988,
         title: 'This is marker 1',
         subtitle: 'Hi mom!'
       },{
         latitude: 40.714541341726175,
         longitude:  -74.00579452514648,
         title: 'This is marker 2',
         subtitle: 'Neat, this is a subtitle'
       }],
       zoom: 12,
       direction: 0
     }
  },
  onChange: function(e) {
    this.setState({ mapLocation: e });
  },
  onOpenAnnotation: function(annotation) {
    console.log(annotation)
  },
  onUpdateUserLocation: function(location) {
    console.log(location)
  },
  render: function() {
    return (
      <View style={styles.container}>
        <Mapbox
          style={styles.map}
          rotateEnabled={true}
          showsUserLocation={true}
          accessToken={'pk.eyJ1IjoiZ2V0bWVoaWdoIiwiYSI6ImNpajdhNmVvYTAwMjgwcmx2ZWd0ZHNqcWYifQ.pTmM4OyyeoZSNZ_aG8EhPw'}
          styleURL={'asset://styles/mapbox-streets-v7.json'}
          centerCoordinate={this.state.center}
          userLocationVisible={true}
          zoomLevel={this.state.zoom}
          debugActive={false}
          direction={this.state.direction}
          annotations={this.state.annotations}
          onRegionChange={this.onChange}
          onOpenAnnotation={this.onOpenAnnotation}
          onUpdateUserLocation={this.onUpdateUserLocation}/>
        <View style={styles.text}>
          <Text>Latitude: {this.state.mapLocation.latitude}</Text>
          <Text>Longitude: {this.state.mapLocation.longitude}</Text>
          <Text>zoom level: {this.state.mapLocation.zoom}</Text>
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1
  },
  map: {
    flex:5,
  },
  text: {
    padding: 20
  }
});

AppRegistry.registerComponent('getMeHighMobile', () => getMeHighMobile);
