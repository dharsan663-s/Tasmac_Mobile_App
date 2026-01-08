import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  RefreshControl,
  Alert,
  StyleSheet,
} from 'react-native';
import { CommonStyles } from '../styles/commonStyles';
import { colors } from '../styles/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScanLog {
  id: string;
  code: string;
  type: 'qr' | 'barcode' | 'manual';
  status: 'valid' | 'invalid';
  timestamp: string;
  productName?: string;
  location?: string;
  details?: string;
}

interface ScanLogScreenProps {
  navigation: any;
  route?: {
    params?: {
      newScan?: {
        code: string;
        type: 'qr' | 'barcode' | 'manual';
        status: 'valid' | 'invalid';
        productName?: string;
        location?: string;
        details?: string;
      };
    };
  };
}

const ScanLogScreen: React.FC<ScanLogScreenProps> = ({ navigation, route }) => {
  const [scans, setScans] = useState<ScanLog[]>([]);
  const [filteredScans, setFilteredScans] = useState<ScanLog[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'valid' | 'invalid'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  // Initial mock data
  const initialScans: ScanLog[] = [
    { id: '1', code: 'QR123456', type: 'qr', status: 'valid', timestamp: '2024-01-08 10:30:00', productName: 'Product A', location: 'Warehouse 1' },
    { id: '2', code: '890123456789', type: 'barcode', status: 'invalid', timestamp: '2024-01-08 10:15:00', location: 'Store 3' },
    { id: '3', code: 'QR789012', type: 'qr', status: 'valid', timestamp: '2024-01-07 14:20:00', productName: 'Product B', location: 'Warehouse 2' },
    { id: '4', code: '345678901234', type: 'barcode', status: 'valid', timestamp: '2024-01-06 09:45:00', productName: 'Product C', location: 'Distribution Center' },
    { id: '5', code: 'Manual123', type: 'manual', status: 'invalid', timestamp: '2024-01-05 16:10:00' },
  ];

  // Function to add new scan log
  const addScanLog = (newScan: Omit<ScanLog, 'id' | 'timestamp'>) => {
    const timestamp = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(',', '');

    const newLog: ScanLog = {
      id: Date.now().toString(),
      ...newScan,
      timestamp,
    };

    setScans(prev => [newLog, ...prev]);
    
    // Show success message
    Alert.alert(
      'Scan Log Added',
      `Successfully added ${newScan.code} to scan log`,
      [{ text: 'OK' }]
    );

    console.log('✅ ScanLogScreen - Added new scan:', newLog);

    return newLog;
  };

  // Check for new scan from navigation params
  useEffect(() => {
    console.log('📱 ScanLogScreen - Route params:', route?.params);
    if (route?.params?.newScan) {
      const { newScan } = route.params;
      console.log('📱 ScanLogScreen - Adding new scan from params:', newScan);
      addScanLog(newScan);
      
      // Clear params after processing
      navigation.setParams({ newScan: undefined });
    }
  }, [route?.params?.newScan]);

  const loadScans = () => {
    // In real app, fetch from API/local storage
    setScans(initialScans);
    applyFilters(initialScans, searchQuery, selectedFilter, dateFilter);
  };

  const applyFilters = (data: ScanLog[], query: string, statusFilter: string, dateRange: string) => {
    let filtered = [...data];

    // Search filter
    if (query) {
      filtered = filtered.filter(scan =>
        scan.code.toLowerCase().includes(query.toLowerCase()) ||
        scan.productName?.toLowerCase().includes(query.toLowerCase()) ||
        scan.location?.toLowerCase().includes(query.toLowerCase()) ||
        scan.details?.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(scan => scan.status === statusFilter);
    }

    // Date filter
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

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    setFilteredScans(filtered);
  };

  useEffect(() => {
    loadScans();
  }, []);

  useEffect(() => {
    applyFilters(scans, searchQuery, selectedFilter, dateFilter);
  }, [scans, searchQuery, selectedFilter, dateFilter]);

  const onRefresh = () => {
    setRefreshing(true);
    loadScans();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleManualAdd = () => {
    Alert.prompt(
      'Add Scan Manually',
      'Enter the scan code:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add', 
          onPress: (code: string | undefined) => { // Fixed: code can be undefined
            if (code && code.trim()) {
              const newScan: Omit<ScanLog, 'id' | 'timestamp'> = {
                code: code.trim(),
                type: 'manual',
                status: 'valid',
                productName: 'Manually Added',
              };
              addScanLog(newScan);
            }
          }
        }
      ]
    );
  };

  const handleGoToScan = () => {
    console.log('📱 ScanLogScreen - Navigating to Scan tab');
    navigation.navigate('ScanTab', {
      screen: 'Scan'
    });
  };

  const handleGoBack = () => {
    // Go back to previous screen or to Home if no history
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('HomeTab', {
        screen: 'Home'
      });
    }
  };

  const renderScanItem = ({ item }: { item: ScanLog }) => (
    <TouchableOpacity
      style={[
        CommonStyles.card,
        { marginBottom: 10, padding: 15 }
      ]}
      onPress={() => console.log('View scan details:', item)}
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
            {item.location ? `${item.location} • ` : ''}{item.timestamp}
          </Text>
          
          {item.details && (
            <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4, fontStyle: 'italic' }}>
              {item.details}
            </Text>
          )}
        </View>
        
        <Icon name="chevron-right" size={24} color="#999" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <View style={CommonStyles.container}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan Log</Text>
          <TouchableOpacity onPress={handleManualAdd} style={styles.addButton}>
            <Icon name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search and Filter Section */}
        <View style={{ paddingHorizontal: 20, paddingTop: 15 }}>
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
              onPress={handleGoToScan}
            >
              <Icon name="qr-code-scanner" size={20} color={colors.primary} />
              <Text style={{ marginLeft: 5, color: colors.primary }}>
                New Scan
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text }}>
              Scan History ({filteredScans.length})
            </Text>
            <Text style={{ fontSize: 14, color: colors.textSecondary }}>
              {selectedFilter !== 'all' ? selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1) : 'All'} scans
              {dateFilter !== 'all' ? ` • ${dateFilter}` : ''}
            </Text>
          </View>
        </View>

        {/* Scan List */}
        <FlatList
          data={filteredScans}
          renderItem={renderScanItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={{ alignItems: 'center', padding: 40 }}>
              <Icon name="search-off" size={60} color="#ddd" />
              <Text style={{ marginTop: 10, color: colors.textSecondary, fontSize: 16 }}>
                No scans found
              </Text>
              <TouchableOpacity
                style={{
                  marginTop: 20,
                  backgroundColor: colors.primary,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 8,
                }}
                onPress={handleGoToScan}
              >
                <Text style={{ color: 'white', fontWeight: '600' }}>
                  Scan Your First Code
                </Text>
              </TouchableOpacity>
            </View>
          }
          ListHeaderComponent={
            filteredScans.length > 0 ? (
              <Text style={{ 
                fontSize: 12, 
                color: colors.textSecondary, 
                marginBottom: 10,
                fontStyle: 'italic' 
              }}>
                Tap on any scan to view details
              </Text>
            ) : null
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
                onPress={() => {
                  setFilterModalVisible(false);
                  applyFilters(scans, searchQuery, selectedFilter, dateFilter);
                }}
              >
                <Text style={CommonStyles.buttonText}>Apply Filters</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[CommonStyles.secondaryButton, { marginTop: 10 }]}
                onPress={() => {
                  setSelectedFilter('all');
                  setDateFilter('all');
                  setFilterModalVisible(false);
                  applyFilters(scans, searchQuery, 'all', 'all');
                }}
              >
                <Text style={[CommonStyles.buttonText, { color: colors.primary }]}>
                  Clear All Filters
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ScanLogScreen;