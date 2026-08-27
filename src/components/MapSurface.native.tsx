import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import type { Charger } from '../types';

type Props = {
  chargers: Charger[];
  selectedId?: string;
  onSelect: (id: string) => void;
};

export default function MapSurface({ chargers, selectedId, onSelect }: Props) {
  return (
    <View style={s.container}>
      <MapView
        style={s.map}
        mapType={Platform.OS === 'android' ? 'none' : 'standard'}
        initialRegion={{
          latitude: -23.572,
          longitude: -46.6225,
          latitudeDelta: 0.055,
          longitudeDelta: 0.055,
        }}
      >
        <UrlTile
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />
        {chargers.map(charger => (
          <Marker
            key={charger.id}
            coordinate={{
              latitude: charger.latitude,
              longitude: charger.longitude,
            }}
            title={charger.name}
            description={`${charger.availableConnectors} de ${charger.totalConnectors} conectores livres`}
            pinColor={charger.id === selectedId ? '#a90016' : '#e30620'}
            onPress={() => onSelect(charger.id)}
          />
        ))}
      </MapView>
      <Text style={s.attribution}>© OpenStreetMap contributors</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, minHeight: 320 },
  map: { flex: 1, minHeight: 320 },
  attribution: {
    position: 'absolute',
    right: 6,
    bottom: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
    backgroundColor: '#ffffffe8',
    color: '#2b3138',
    fontSize: 10,
  },
});
