import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../styles/colors';

interface ScanData {
  id: string;
  type: 'qr' | 'barcode';
  status: 'valid' | 'invalid';
  timestamp: string;
  productName?: string;
}

interface RecentScansListProps {
  scans: ScanData[];
}

const RecentScansList: React.FC<RecentScansListProps> = ({ scans }) => {
  const renderScanItem = ({ item }: { item: ScanData }) => (
    <TouchableOpacity style={styles.scanItem}>
      <View style={styles.iconContainer}>
        <Icon
          name={item.type === 'qr' ? 'qr-code' : 'bar-chart'}
          size={24}
          color={item.status === 'valid' ? '#4CAF50' : '#FF9800'}
        />
      </View>
      
      <View style={styles.scanInfo}>
        <Text style={styles.productName}>
          {item.productName || `Scan ${item.id}`}
        </Text>
        <View style={styles.detailsRow}>
          <Text style={styles.typeText}>
            {item.type.toUpperCase()}
          </Text>
          <Text style={styles.timeText}>
            • {item.timestamp}
          </Text>
        </View>
      </View>
      
      <View style={[
        styles.statusBadge,
        item.status === 'valid' ? styles.validBadge : styles.invalidBadge
      ]}>
        <Text style={[
          styles.statusText,
          item.status === 'valid' ? styles.validText : styles.invalidText
        ]}>
          {item.status.toUpperCase()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (scans.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="search-off" size={48} color={colors.border} />
        <Text style={styles.emptyText}>
          No recent scans
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={scans}
      renderItem={renderScanItem}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 10,
  },
  scanItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  scanInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  timeText: {
    fontSize: 12,
    color: colors.textTertiary,
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  validBadge: {
    backgroundColor: '#E8F5E8',
  },
  invalidBadge: {
    backgroundColor: '#FFF3E0',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  validText: {
    color: '#4CAF50',
  },
  invalidText: {
    color: '#FF9800',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
    textAlign: 'center',
  },
});

export default RecentScansList;