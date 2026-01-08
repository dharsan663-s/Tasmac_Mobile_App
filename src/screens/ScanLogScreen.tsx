import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  RefreshControl,
} from 'react-native';
import { CommonStyles } from '../styles/commonStyles';
import { colors } from '../styles/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ScanLog {
  id: string;
  code: string;
  type: 'qr' | 'barcode' | 'manual';
  status: 'valid' | 'invalid';
  timestamp: string;
  productName?: string;
  location?: string;
}

const ScanLogScreen = ({ navigation }: any) => {
  const [scans, setScans] = useState<ScanLog[]>([]);
  const [filteredScans, setFilteredScans] = useState<ScanLog[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'valid' | 'invalid'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  // Mock data - replace with API call
  const mockScans: ScanLog[] = [
    { id: '1', code: 'QR123456', type: 'qr', status: 'valid', timestamp: '2024-01-08 10:30:00', productName: 'Product A', location: 'Warehouse 1' },
    { id: '2', code: '890123456789', type: 'barcode', status: 'invalid', timestamp: '2024-01-08 10:15:00', location: 'Store 3' },
    { id: '3', code: 'QR789012', type: 'qr', status: 'valid', timestamp: '2024-01-07 14:20:00', productName: 'Product B', location: 'Warehouse 2' },
    { id: '4', code: '345678901234', type: 'barcode', status: 'valid', timestamp: '2024-01-06 09:45:00', productName: 'Product C', location: 'Distribution Center' },
    { id: '5', code: 'Manual123', type: 'manual', status: 'invalid', timestamp: '2024-01-05 16:10:00' },
  ];

  const loadScans = () => {
    setScans(mockScans);
    applyFilters(mockScans, searchQuery, selectedFilter, dateFilter);
  };

  const applyFilters = (data: ScanLog[], query: string, statusFilter: string, dateRange: string) => {
    let filtered = [...data];

    // Search filter
    if (query) {
      filtered = filtered.filter(scan =>
        scan.code.toLowerCase().includes(query.toLowerCase()) ||
        scan.productName?.toLowerCase().includes(query.toLowerCase()) ||
        scan.location?.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(scan => scan.status === statusFilter);
    }

    // Date filter (simplified for demo)
    if (dateRange !== 'all') {
      const now = new Date();
      filtered = filtered.filter(scan => {
        const scanDate = new Date(scan.timestamp);
        switch (dateRange) {
          case 'today':
            return scanDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return scanDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return scanDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    setFilteredScans(filtered);
  };

  useEffect(() => {
    loadScans();
  }, []);

  useEffect(() => {
    applyFilters(scans, searchQuery, selectedFilter, dateFilter);
  }, [searchQuery, selectedFilter, dateFilter]);

  const onRefresh = () => {
    setRefreshing(true);
    loadScans();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const renderScanItem = ({ item }: { item: ScanLog }) => (
    <TouchableOpacity
      style={[
        CommonStyles.card,
        { marginBottom: 10, padding: 15 }
      ]}
      onPress={() => navigation.navigate('ScanDetail', { scan: item })}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
            <Icon
              name={item.type === 'qr' ? 'qr-code' : item.type === 'barcode' ? 'bar-chart' : 'keyboard'}
              size={16}
              color="#666"
              style={{ marginRight: 8 }}
            />
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
              {item.code}
            </Text>
            <View
              style={[
                { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginLeft: 8 },
                item.status === 'valid' 
                  ? { backgroundColor: '#E8F5E8' }
                  : { backgroundColor: '#FFF3E0' }
              ]}
            >
              <Text
                style={[
                  { fontSize: 12, fontWeight: '500' },
                  item.status === 'valid' 
                    ? { color: '#4CAF50' }
                    : { color: '#FF9800' }
                ]}
              >
                {item.status.toUpperCase()}
              </Text>
            </View>
          </View>
          
          {item.productName && (
            <Text style={{ fontSize: 14, color: colors.text, marginBottom: 2 }}>
              {item.productName}
            </Text>
          )}
          
          <Text style={{ fontSize: 12, color: colors.textSecondary }}>
            {item.location} • {item.timestamp}
          </Text>
        </View>
        
        <Icon name="chevron-right" size={24} color="#999" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={CommonStyles.container}>
      <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
        <TextInput
          style={[
            CommonStyles.input,
            { marginBottom: 15, backgroundColor: '#f5f5f5' }
          ]}
          placeholder="Search scans..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 10,
              backgroundColor: '#f0f0f0',
              borderRadius: 8,
              marginRight: 10,
            }}
            onPress={() => setFilterModalVisible(true)}
          >
            <Icon name="filter-list" size={20} color={colors.primary} />
            <Text style={{ marginLeft: 5, color: colors.primary }}>
              Filters
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 10,
              backgroundColor: '#f0f0f0',
              borderRadius: 8,
            }}
            onPress={() => {
              // Export functionality
            }}
          >
            <Icon name="download" size={20} color={colors.primary} />
            <Text style={{ marginLeft: 5, color: colors.primary }}>
              Export
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text }}>
            Scan History ({filteredScans.length})
          </Text>
          <Text style={{ fontSize: 14, color: colors.textSecondary }}>
            Showing {selectedFilter !== 'all' ? selectedFilter : 'all'} scans
          </Text>
        </View>
      </View>

      <FlatList
        data={filteredScans}
        renderItem={renderScanItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={{ alignItems: 'center', padding: 40 }}>
            <Icon name="search-off" size={60} color="#ddd" />
            <Text style={{ marginTop: 10, color: colors.textSecondary }}>
              No scans found
            </Text>
          </View>
        }
      />

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={CommonStyles.modalOverlay}>
          <View style={CommonStyles.modalContent}>
            <View style={CommonStyles.modalHeader}>
              <Text style={CommonStyles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Icon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={CommonStyles.modalSectionTitle}>Status</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {['all', 'valid', 'invalid'].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      {
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 20,
                        marginRight: 10,
                        marginBottom: 10,
                      },
                      selectedFilter === status
                        ? { backgroundColor: colors.primary }
                        : { backgroundColor: '#f0f0f0' }
                    ]}
                    onPress={() => setSelectedFilter(status as any)}
                  >
                    <Text
                      style={[
                        selectedFilter === status
                          ? { color: 'white' }
                          : { color: colors.text }
                      ]}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={{ marginBottom: 30 }}>
              <Text style={CommonStyles.modalSectionTitle}>Date Range</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {['all', 'today', 'week', 'month'].map((date) => (
                  <TouchableOpacity
                    key={date}
                    style={[
                      {
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 20,
                        marginRight: 10,
                        marginBottom: 10,
                      },
                      dateFilter === date
                        ? { backgroundColor: colors.primary }
                        : { backgroundColor: '#f0f0f0' }
                    ]}
                    onPress={() => setDateFilter(date as any)}
                  >
                    <Text
                      style={[
                        dateFilter === date
                          ? { color: 'white' }
                          : { color: colors.text }
                      ]}
                    >
                      {date.charAt(0).toUpperCase() + date.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={CommonStyles.primaryButton}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={CommonStyles.buttonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ScanLogScreen;