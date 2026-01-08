import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
  TextInput,
  Platform,
} from 'react-native';
import { CommonStyles } from '../styles/commonStyles';
import { colors } from '../styles/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScanScreenProps {
  navigation: any;
}

const ScanScreen: React.FC<ScanScreenProps> = ({ navigation }) => {
  const [scanned, setScanned] = useState(false);
  const [scanningType, setScanningType] = useState<'qr' | 'barcode'>('qr');
  const [loading, setLoading] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [manualEntryModalVisible, setManualEntryModalVisible] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Check camera permission
  useEffect(() => {
    // For now, we'll assume permission is granted
    // In a real app, you'd use Permissions API
    setHasPermission(true);
  }, []);

  const requestCameraPermission = async () => {
    try {
      // Simplified permission request
      // In a real app, use:
      // import * as ImagePicker from 'expo-image-picker';
      // const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      // For now, simulate permission granted
      setHasPermission(true);
      setCameraVisible(true);
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      Alert.alert('Error', 'Failed to request camera permission');
    }
  };

  const handleBarCodeScanned = async ({ type, data }: any) => {
    if (scanned) return;
    
    setScanned(true);
    setLoading(true);
    
    // Simulate API validation
    setTimeout(() => {
      setLoading(false);
      setCameraVisible(false);
      
      // For demo - randomly determine if scan is valid
      const isValid = Math.random() > 0.3;
      
      if (isValid) {
        navigation.navigate('ValidScan', { scanData: data, scanType: scanningType });
      } else {
        navigation.navigate('InvalidScan', { scanData: data, scanType: scanningType });
      }
      
      setScanned(false);
    }, 2000);
  };

  const handleManualEntry = () => {
    Alert.alert(
      'Manual Entry',
      'Enter the code manually:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Validate',
          style: 'default',
          onPress: () => {
            setManualEntryModalVisible(true);
          },
        },
      ]
    );
  };

  const handleManualCodeSubmit = () => {
    if (!manualCode.trim()) {
      Alert.alert('Error', 'Please enter a code');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setManualEntryModalVisible(false);
      const isValid = Math.random() > 0.3;
      if (isValid) {
        navigation.navigate('ValidScan', { 
          scanData: manualCode, 
          scanType: 'manual' 
        });
      } else {
        navigation.navigate('InvalidScan', { 
          scanData: manualCode, 
          scanType: 'manual' 
        });
      }
      setManualCode('');
    }, 1500);
  };

  // Render camera placeholder or implement alternative scanning
  const renderCameraPlaceholder = () => (
    <View
      style={{
        flex: 1,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: 250,
          height: 250,
          borderWidth: 2,
          borderColor: '#4CAF50',
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Icon name="qr-code-scanner" size={80} color="#4CAF50" />
        <Text style={{ color: 'white', marginTop: 20, fontSize: 16 }}>
          Camera Preview
        </Text>
        <Text style={{ color: '#AAA', marginTop: 10, textAlign: 'center' }}>
          Point at {scanningType === 'qr' ? 'QR code' : 'barcode'}
        </Text>
      </View>
      
      <View style={{ 
        position: 'absolute', 
        bottom: 30, 
        left: 0, 
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
      }}>
        <TouchableOpacity
          style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            padding: 15,
            borderRadius: 30,
          }}
          onPress={() => setCameraVisible(false)}
        >
          <Text style={{ color: 'white' }}>Close</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={{
            backgroundColor: '#4CAF50',
            padding: 15,
            borderRadius: 30,
          }}
          onPress={() => {
            // Simulate a scan
            const mockData = scanningType === 'qr' 
              ? 'QR-' + Math.random().toString(36).substr(2, 9)
              : Math.floor(1000000000000 + Math.random() * 9000000000000).toString();
            handleBarCodeScanned({ data: mockData });
          }}
        >
          <Text style={{ color: 'white' }}>Simulate Scan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (hasPermission === null) {
    return (
      <View style={CommonStyles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 20 }}>Checking camera permissions...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={CommonStyles.container}>
        <Text style={{ marginBottom: 20, textAlign: 'center' }}>
          No access to camera. Please enable camera permissions in your device settings.
        </Text>
        <TouchableOpacity 
          style={CommonStyles.primaryButton} 
          onPress={requestCameraPermission}
        >
          <Text style={CommonStyles.buttonText}>Request Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[CommonStyles.secondaryButton, { marginTop: 10 }]}
          onPress={() => setHasPermission(true)}
        >
          <Text style={[CommonStyles.buttonText, { color: colors.primary }]}>
            Use Demo Mode
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
    <View style={CommonStyles.container}>
      <Text style={CommonStyles.title}>Scan Code</Text>
      <Text style={CommonStyles.subtitle}>
        Choose scan type and point camera at {scanningType === 'qr' ? 'QR code' : 'barcode'}
      </Text>

      <View style={{ flexDirection: 'row', marginVertical: 20 }}>
        <TouchableOpacity
          style={[
            { 
              padding: 15, 
              marginRight: 10, 
              borderRadius: 8,
              alignItems: 'center',
              flex: 1,
            },
            scanningType === 'qr'
              ? { backgroundColor: colors.primary }
              : { backgroundColor: '#E0E0E0' },
          ]}
          onPress={() => setScanningType('qr')}
        >
          <Icon 
            name="qr-code" 
            size={24} 
            color={scanningType === 'qr' ? 'white' : '#666'} 
            style={{ marginBottom: 5 }}
          />
          <Text style={{ 
            color: scanningType === 'qr' ? 'white' : 'black',
            fontSize: 12,
          }}>
            QR Code
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            { 
              padding: 15, 
              borderRadius: 8,
              alignItems: 'center',
              flex: 1,
            },
            scanningType === 'barcode'
              ? { backgroundColor: colors.primary }
              : { backgroundColor: '#E0E0E0' },
          ]}
          onPress={() => setScanningType('barcode')}
        >
          <Icon 
            name="bar-chart" 
            size={24} 
            color={scanningType === 'barcode' ? 'white' : '#666'} 
            style={{ marginBottom: 5 }}
          />
          <Text style={{ 
            color: scanningType === 'barcode' ? 'white' : 'black',
            fontSize: 12,
          }}>
            Barcode
          </Text>
        </TouchableOpacity>
      </View>

      {!cameraVisible ? (
        <TouchableOpacity
          style={CommonStyles.primaryButton}
          onPress={requestCameraPermission}
        >
          <Text style={CommonStyles.buttonText}>Open Camera Scanner</Text>
        </TouchableOpacity>
      ) : (
        <Modal
          animationType="slide"
          transparent={false}
          visible={cameraVisible}
          onRequestClose={() => setCameraVisible(false)}
        >
          {renderCameraPlaceholder()}
        </Modal>
      )}

      <TouchableOpacity
        style={[CommonStyles.secondaryButton, { marginTop: 20 }]}
        onPress={handleManualEntry}
      >
        <Text style={[CommonStyles.buttonText, { color: colors.primary }]}>
          Enter Code Manually
        </Text>
      </TouchableOpacity>

      {/* Manual Entry Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={manualEntryModalVisible}
        onRequestClose={() => setManualEntryModalVisible(false)}
      >
        <View style={CommonStyles.modalOverlay}>
          <View style={CommonStyles.modalContent}>
            <View style={CommonStyles.modalHeader}>
              <Text style={CommonStyles.modalTitle}>Manual Entry</Text>
              <TouchableOpacity onPress={() => setManualEntryModalVisible(false)}>
                <Icon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={{ marginBottom: 15, color: colors.textSecondary }}>
              Enter the code manually:
            </Text>

            <TextInput
              style={CommonStyles.input}
              placeholder="Enter code here..."
              value={manualCode}
              onChangeText={setManualCode}
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                style={[
                  CommonStyles.secondaryButton,
                  { flex: 1, marginRight: 10, paddingVertical: 12 }
                ]}
                onPress={() => {
                  setManualEntryModalVisible(false);
                  setManualCode('');
                }}
              >
                <Text style={[CommonStyles.buttonText, { color: colors.primary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  CommonStyles.primaryButton,
                  { 
                    flex: 1, 
                    paddingVertical: 12,
                    opacity: manualCode.trim() ? 1 : 0.5
                  }
                ]}
                onPress={handleManualCodeSubmit}
                disabled={!manualCode.trim()}
              >
                <Text style={CommonStyles.buttonText}>
                  Validate
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {loading && (
        <View style={CommonStyles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 10, color: 'white' }}>Validating scan...</Text>
        </View>
      )}
    </View>
    </SafeAreaView>
  );
};

export default ScanScreen;