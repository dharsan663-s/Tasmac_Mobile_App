import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { HomeStyles } from '../styles/screens/HomeStyles';
import ScanStatsCard from '../components/ScanStatsCard';
import RecentScansList from '../components/RecentScansList';

const { width } = Dimensions.get('window');

interface ScanData {
  id: string;
  type: 'qr' | 'barcode';
  status: 'valid' | 'invalid';
  timestamp: string;
  productName?: string;
}

const HomeScreen = ({ navigation }: any) => {
  const [refreshing, setRefreshing] = useState(false);
  const [todayStats, setTodayStats] = useState({
    totalScans: 0,
    validScans: 0,
    invalidScans: 0,
  });
  const [recentScans, setRecentScans] = useState<ScanData[]>([
    { id: '1', type: 'qr', status: 'valid', timestamp: '10:30 AM', productName: 'Product A' },
    { id: '2', type: 'barcode', status: 'invalid', timestamp: '10:15 AM', productName: 'Scan 2' },
    { id: '3', type: 'qr', status: 'valid', timestamp: '09:45 AM', productName: 'Product B' },
  ]);

  const loadTodayData = () => {
    const mockStats = {
      totalScans: 24,
      validScans: 18,
      invalidScans: 6,
    };
    setTodayStats(mockStats);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadTodayData();
    setTimeout(() => setRefreshing(false), 1000);
  };

  useEffect(() => {
    loadTodayData();
  }, []);

  const navigateToScan = () => {
    navigation.navigate('Scan');
  };

  const navigateToScanLog = () => {
    navigation.navigate('ScanLog');
  };

  // Format date as shown in your screenshot
  const formatDate = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <ScrollView
      style={HomeStyles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      <View style={HomeStyles.header}>
        <Text style={HomeStyles.welcomeText}>Good Morning!</Text>
        <Text style={HomeStyles.dateText}>
          {formatDate()}
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCardWrapper}>
          <ScanStatsCard
            title="Total Scans"
            value={todayStats.totalScans.toString()}
            icon="scan"
            color="#4CAF50"
          />
        </View>
        <View style={styles.statCardWrapper}>
          <ScanStatsCard
            title="Valid Scans"
            value={todayStats.validScans.toString()}
            icon="check-circle"
            color="#2196F3"
          />
        </View>
        <View style={styles.statCardWrapper}>
          <ScanStatsCard
            title="Invalid Scans"
            value={todayStats.invalidScans.toString()}
            icon="error"
            color="#FF9800"
          />
        </View>
      </View>

      <View style={HomeStyles.actionsContainer}>
        <TouchableOpacity
          style={HomeStyles.primaryActionButton}
          onPress={navigateToScan}
        >
          <Text style={HomeStyles.primaryActionButtonText}>Start Scanning</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={HomeStyles.secondaryActionButton}
          onPress={navigateToScanLog}
        >
          <Text style={HomeStyles.secondaryActionButtonText}>View Scan Log</Text>
        </TouchableOpacity>
      </View>

      <View style={HomeStyles.recentScansContainer}>
        <View style={HomeStyles.sectionHeader}>
          <Text style={HomeStyles.sectionTitle}>Recent Scans</Text>
          <TouchableOpacity onPress={navigateToScanLog}>
            <Text style={HomeStyles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <RecentScansList scans={recentScans} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  statCardWrapper: {
    width: (width - 40) / 3, // 40 = padding (15+15) + margins
  },
});

export default HomeScreen;