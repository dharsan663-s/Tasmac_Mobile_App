import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CommonStyles } from '../styles/commonStyles';
import { colors } from '../styles/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

const ValidScanScreen = ({ route, navigation }: any) => {
  const { scanData, scanType } = route.params || {};

// In ValidScanScreen.tsx, update the handleAddToLog function:
const handleAddToLog = () => {
  console.log('📱 ValidScanScreen - Adding to scan log:', scanData);
  
  // Navigate to ScanLog screen in the tab navigator
  navigation.navigate('ScanLogTab', {
    screen: 'ScanLogMain',
    params: {
      newScan: {
        code: scanData || 'Unknown',
        type: scanType || 'barcode',
        status: 'valid',
        productName: 'Scanned Device',
        location: 'Repair Center',
        details: `Scanned from ${scanType === 'qr' ? 'QR Code' : 'Barcode'} scanner`,
        timestamp: new Date().toISOString(),
      }
    }
  });
};

// Update handleScanAgain:
const handleScanAgain = () => {
  navigation.goBack(); // Go back to ScanScreen
};

// Update handleGoBack:
const handleGoBack = () => {
  navigation.goBack();
};

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <View style={CommonStyles.container}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan Result</Text>
          <View style={{ width: 40 }} /> {/* Spacer for alignment */}
        </View>

        <View style={{ alignItems: 'center', marginVertical: 40 }}>
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: '#4CAF50',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <Icon name="check" size={50} color="white" />
          </View>
          
          <Text style={[CommonStyles.title, { color: '#4CAF50' }]}>
            Valid Scan!
          </Text>
          <Text style={CommonStyles.subtitle}>
            {scanType === 'qr' ? 'QR Code' : 
             scanType === 'barcode' ? 'Barcode' : 'Manual Entry'} verified successfully
          </Text>
        </View>

        <View style={CommonStyles.card}>
          <Text style={CommonStyles.cardTitle}>Scan Details</Text>
          <View style={CommonStyles.detailRow}>
            <Text style={CommonStyles.detailLabel}>Type:</Text>
            <Text style={CommonStyles.detailValue}>
              {scanType?.toUpperCase() || 'N/A'}
            </Text>
          </View>
          <View style={CommonStyles.detailRow}>
            <Text style={CommonStyles.detailLabel}>Code:</Text>
            <Text style={[CommonStyles.detailValue, styles.codeText]} numberOfLines={1}>
              {scanData || 'N/A'}
            </Text>
          </View>
          <View style={CommonStyles.detailRow}>
            <Text style={CommonStyles.detailLabel}>Status:</Text>
            <Text style={[CommonStyles.detailValue, { color: '#4CAF50' }]}>
              VALID
            </Text>
          </View>
          <View style={CommonStyles.detailRow}>
            <Text style={CommonStyles.detailLabel}>Time:</Text>
            <Text style={CommonStyles.detailValue}>
              {new Date().toLocaleTimeString()}
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 30 }}>
          <TouchableOpacity
            style={[CommonStyles.primaryButton, styles.addToLogButton]}
            onPress={handleAddToLog}
          >
            <Icon name="save" size={20} color="white" style={{ marginRight: 10 }} />
            <Text style={CommonStyles.buttonText}>Add to Scan Log</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[CommonStyles.secondaryButton, { marginTop: 15 }]}
            onPress={handleScanAgain}
          >
            <Icon name="qr-code-scanner" size={20} color={colors.primary} style={{ marginRight: 10 }} />
            <Text style={[CommonStyles.buttonText, { color: colors.primary }]}>
              Scan Another Code
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[CommonStyles.secondaryButton, { marginTop: 15 }]}
            onPress={handleGoBack}
          >
            <Icon name="close" size={20} color={colors.textSecondary} style={{ marginRight: 10 }} />
            <Text style={[CommonStyles.buttonText, { color: colors.textSecondary }]}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
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
    paddingBottom: 20,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  codeText: {
    fontFamily: 'monospace',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  addToLogButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ValidScanScreen;