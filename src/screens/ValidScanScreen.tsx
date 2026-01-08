import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { CommonStyles } from '../styles/commonStyles';
import { colors } from '../styles/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ValidScanScreen = ({ route, navigation }: any) => {
  const { scanData, scanType } = route.params || {};

  const handleAddToLog = () => {
    // Save to scan log
    Alert.alert('Success', 'Scan added to log successfully');
    navigation.navigate('Dashboard');
  };

  const handleScanAgain = () => {
    navigation.navigate('Scan');
  };

  return (
    <View style={CommonStyles.container}>
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
          <Text style={CommonStyles.detailValue} numberOfLines={1}>
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
          style={CommonStyles.primaryButton}
          onPress={handleAddToLog}
        >
          <Text style={CommonStyles.buttonText}>Add to Scan Log</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[CommonStyles.secondaryButton, { marginTop: 15 }]}
          onPress={handleScanAgain}
        >
          <Text style={[CommonStyles.buttonText, { color: colors.primary }]}>
            Scan Another Code
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ValidScanScreen;