import React, { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import MapSurface from '../components/MapSurface';
import { Button, StatusPill } from '../components/UI';
import { colors, formatEnergyPrice } from '../constants/theme';
import {
  findCharger,
  mockChargers,
  searchChargers,
} from '../data/mockChargers';
import type { RootStackParamList } from '../types';

const QrButton = ({ onPress }: { onPress: () => void }) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel="Abrir leitor de QR Code"
    onPress={onPress}
    style={({ pressed }) => [s.qr, pressed && s.pressed]}
  >
    <Text style={s.qrIcon}>▦</Text>
    <Text style={s.qrText}>Escanear QR Code</Text>
  </Pressable>
);

export function MapScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Map'>) {
  const [query, setQuery] = useState('');
  const list = useMemo(() => searchChargers(query), [query]);
  const openStation = (chargerId: string) => {
    setQuery('');
    navigation.navigate('ChargerDetails', { chargerId });
  };
  return (
    <View style={s.fill}>
      <View style={s.header}>
        <Image
          source={require('../../assets/emps-logo.jpeg')}
          style={s.headerLogo}
          accessibilityLabel="EMPS"
        />
        <View style={s.headerText}>
          <Text style={s.welcome}>Olá, Felipe</Text>
          <Text style={s.headerSubtitle}>
            Encontre energia para o seu trajeto
          </Text>
        </View>
        <View style={s.avatar}>
          <Text style={s.avatarText}>FG</Text>
        </View>
      </View>
      <View style={s.mapWrap}>
        <MapSurface chargers={mockChargers} onSelect={openStation} />
      </View>
      <View style={s.searchArea}>
        <View style={s.search}>
          <Text style={s.searchIcon}>⌕</Text>
          <TextInput
            accessibilityLabel="Pesquisar eletropostos"
            value={query}
            onChangeText={setQuery}
            placeholder="Pesquise por local ou conector"
            placeholderTextColor="#7b858f"
            style={s.searchInput}
          />
        </View>
        {query !== '' && (
          <View style={s.results}>
            {list.length ? (
              list.map(charger => (
                <Pressable
                  key={charger.id}
                  accessibilityRole="button"
                  onPress={() => openStation(charger.id)}
                  style={s.resultRow}
                >
                  <View style={s.resultBolt}>
                    <Text style={s.resultBoltText}>⚡</Text>
                  </View>
                  <View style={s.resultText}>
                    <Text style={s.resultTitle}>{charger.name}</Text>
                    <Text style={s.resultAddress} numberOfLines={1}>
                      {charger.address}
                    </Text>
                    <Text style={s.resultAvailability}>
                      {charger.availableConnectors} de {charger.totalConnectors}{' '}
                      conectores livres
                    </Text>
                  </View>
                  <Text style={s.chevron}>›</Text>
                </Pressable>
              ))
            ) : (
              <Text style={s.empty}>Nenhum eletroposto encontrado.</Text>
            )}
          </View>
        )}
      </View>
      <View style={s.mapLegend}>
        <Text style={s.legendTitle}>
          {mockChargers.length} eletropostos na região
        </Text>
        <Text style={s.legendText}>
          Toque em um marcador para consultar a ocupação
        </Text>
      </View>
      <QrButton
        onPress={() =>
          navigation.navigate('Camera', { chargerId: mockChargers[0].id })
        }
      />
    </View>
  );
}

const Metric = ({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) => (
  <View style={[s.metric, accent && s.metricAccent]}>
    <Text style={[s.metricValue, accent && s.metricValueAccent]}>{value}</Text>
    <Text style={[s.metricLabel, accent && s.metricLabelAccent]}>{label}</Text>
  </View>
);

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) => (
  <View style={s.infoRow}>
    <View style={s.infoIcon}>
      <Text style={s.infoIconText}>{icon}</Text>
    </View>
    <View style={s.infoGrow}>
      <Text style={s.infoLabel}>{label}</Text>
      <Text style={s.infoValue}>{value}</Text>
    </View>
  </View>
);

export function ChargerDetailsScreen({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, 'ChargerDetails'>) {
  const charger = findCharger(route.params?.chargerId);
  if (!charger) {
    return (
      <View style={s.center}>
        <Text>Eletroposto não encontrado.</Text>
        <Button
          title="Voltar ao mapa"
          onPress={() => navigation.navigate('Map')}
        />
      </View>
    );
  }
  const occupied = charger.totalConnectors - charger.availableConnectors;
  const occupancy = Math.round((occupied / charger.totalConnectors) * 100);
  return (
    <View style={s.fill}>
      <ScrollView contentContainerStyle={s.details}>
        <View style={s.hero}>
          <Image
            source={charger.image}
            style={s.heroLogo}
            accessibilityLabel={`${charger.chargerName} ${charger.chargerModel}`}
          />
          <View style={s.heroContent}>
            <StatusPill status={charger.status} />
            <Text style={s.heroTitle}>{charger.name}</Text>
            <Text style={s.heroAddress}>{charger.address}</Text>
          </View>
        </View>

        <View style={s.metrics}>
          <Metric
            accent
            value={`${charger.availableConnectors}/${charger.totalConnectors}`}
            label="conectores livres"
          />
          <Metric value={`${occupancy}%`} label="ocupação atual" />
          <Metric value={`${charger.powerKw} kW`} label="potência máxima" />
        </View>

        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Ocupação do eletroposto</Text>
            <Text style={s.occupancyText}>{occupied} em uso</Text>
          </View>
          <View style={s.track}>
            <View style={[s.bar, { width: `${occupancy}%` }]} />
          </View>
          <Text style={s.description}>{charger.description}</Text>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>Informações operacionais</Text>
          <InfoRow icon="⌁" label="Endereço exato" value={charger.address} />
          <InfoRow
            icon="⚡"
            label="Carregador"
            value={charger.chargerName}
          />
          <InfoRow
            icon="G2"
            label="Modelo e conexão"
            value={`${charger.chargerModel} · ${charger.powerKw} kW · ${charger.connectorType}`}
          />
          <InfoRow
            icon="AC"
            label="Tecnologia de recarga"
            value={charger.chargingType}
          />
          <InfoRow
            icon="◷"
            label="Funcionamento"
            value={charger.openingHours}
          />
          <InfoRow
            icon="R$"
            label="Tarifa de energia"
            value={formatEnergyPrice()}
          />
          <InfoRow icon="E" label="Operador" value={charger.operator} />
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>Comodidades</Text>
          <View style={s.tags}>
            {charger.amenities.map(item => (
              <View key={item} style={s.tag}>
                <Text style={s.tagText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <Button
          disabled={charger.status !== 'available'}
          title={
            charger.status === 'available'
              ? 'Escanear QR Code e iniciar'
              : 'Eletroposto indisponível no momento'
          }
          onPress={() =>
            navigation.navigate('Camera', { chargerId: charger.id })
          }
        />
        <Button
          secondary
          title="Voltar ao mapa"
          onPress={() => navigation.goBack()}
        />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: 17,
    paddingTop: 14,
    paddingBottom: 13,
    backgroundColor: colors.mapPanel,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    zIndex: 10,
  },
  headerLogo: { width: 78, height: 42, resizeMode: 'contain', borderRadius: 8 },
  headerText: { flex: 1 },
  welcome: { color: '#fff', fontSize: 17, fontWeight: '900' },
  headerSubtitle: { color: '#aeb7bf', fontSize: 12, marginTop: 2 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '900' },
  mapWrap: { flex: 1, minHeight: 360, overflow: 'hidden' },
  searchArea: {
    position: 'absolute',
    top: 82,
    left: 14,
    right: 14,
    zIndex: 20,
  },
  search: {
    height: 52,
    borderRadius: 15,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  searchIcon: {
    fontSize: 28,
    color: colors.ink,
    marginRight: 8,
    marginTop: -4,
  },
  searchInput: { flex: 1, height: 50, color: colors.ink, fontSize: 15 },
  results: {
    backgroundColor: colors.surface,
    borderRadius: 15,
    marginTop: 7,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 9,
  },
  resultRow: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 10,
  },
  resultBolt: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultBoltText: { fontSize: 16 },
  resultText: { flex: 1 },
  resultTitle: { fontWeight: '900', color: colors.ink },
  resultAddress: { color: colors.muted, fontSize: 12, marginTop: 2 },
  resultAvailability: {
    color: colors.green,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 3,
  },
  chevron: { fontSize: 28, color: colors.primary },
  empty: { padding: 18, textAlign: 'center', color: colors.muted },
  mapLegend: {
    position: 'absolute',
    left: 14,
    bottom: 88,
    backgroundColor: '#111820ed',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  legendTitle: { color: '#fff', fontWeight: '900' },
  legendText: { color: '#c5ccd2', fontSize: 12, marginTop: 2 },
  qr: {
    position: 'absolute',
    bottom: 19,
    alignSelf: 'center',
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    paddingHorizontal: 21,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.32,
    shadowRadius: 12,
    elevation: 9,
  },
  pressed: { opacity: 0.82, transform: [{ scale: 0.98 }] },
  qrIcon: { color: '#fff', fontSize: 23, fontWeight: '900' },
  qrText: { color: '#fff', fontSize: 15, fontWeight: '900' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  details: {
    padding: 18,
    paddingBottom: 40,
    maxWidth: 760,
    width: '100%',
    alignSelf: 'center',
    gap: 14,
  },
  hero: {
    minHeight: 210,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#08090b',
    padding: 20,
    justifyContent: 'flex-end',
  },
  heroLogo: {
    position: 'absolute',
    right: 8,
    top: 4,
    width: 190,
    height: 205,
    resizeMode: 'contain',
    opacity: 0.72,
  },
  heroContent: { gap: 7 },
  heroTitle: { color: '#fff', fontSize: 28, fontWeight: '900' },
  heroAddress: { color: '#c5ccd2', lineHeight: 20, maxWidth: 520 },
  metrics: { flexDirection: 'row', gap: 9 },
  metric: {
    flex: 1,
    minWidth: 95,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 13,
  },
  metricAccent: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  metricValue: { fontSize: 20, fontWeight: '900', color: colors.ink },
  metricValueAccent: { color: '#fff' },
  metricLabel: { fontSize: 11, color: colors.muted, marginTop: 4 },
  metricLabelAccent: { color: '#ffe7ea' },
  section: {
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 17,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: { fontSize: 17, fontWeight: '900', color: colors.ink },
  occupancyText: { color: colors.muted, fontWeight: '700' },
  track: {
    height: 11,
    borderRadius: 6,
    backgroundColor: colors.border,
    overflow: 'hidden',
    marginVertical: 13,
  },
  bar: { height: '100%', backgroundColor: colors.primary, borderRadius: 6 },
  description: { color: colors.muted, lineHeight: 20 },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoIconText: { color: colors.primary, fontWeight: '900' },
  infoGrow: { flex: 1 },
  infoLabel: { color: colors.muted, fontSize: 12 },
  infoValue: {
    color: colors.ink,
    fontWeight: '800',
    marginTop: 2,
    lineHeight: 19,
  },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 13 },
  tag: {
    backgroundColor: colors.surfaceRaised,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 99,
  },
  tagText: { color: colors.inkSoft, fontSize: 12, fontWeight: '700' },
});
