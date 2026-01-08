import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Alert
} from 'react-native';
import {
  Camera,
  useCameraDevices,
  useCodeScanner,
} from 'react-native-vision-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');
const SCAN_SIZE = width * 0.7;
const BORDER_WIDTH = 2;

// Define types for the scanned code
interface ScannedCode {
  value?: string;
  type?: string;
  [key: string]: any;
}

const ScanScreen = ({ navigation, route }: any) => {
  const devices = useCameraDevices();
  const device = devices.find(d => d.position === 'back');

  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [scanLineAnim] = useState(new Animated.Value(0));
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);

  // Animation for scanning line
  useEffect(() => {
    if (!scanned) {
      const animateScanLine = () => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(scanLineAnim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(scanLineAnim, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        ).start();
      };
      animateScanLine();
    } else {
      scanLineAnim.stopAnimation();
    }
  }, [scanned, scanLineAnim]);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'ean-8', 'code-128', 'code-39', 'upc-e', 'upc-a'],
    onCodeScanned: (codes: ScannedCode[]) => {
      if (codes.length > 0 && !scanned) {
        const code = codes[0];
        const value = code?.value;
        const type = code?.type;
        
        // Check if value exists and is a valid string
        if (!value || typeof value !== 'string' || value.trim() === '') {
          console.log('📱 ScanScreen - Invalid or empty code value:', code);
          return;
        }

        console.log('📱 ScanScreen - Code Scanned:', {
          value,
          type,
          timestamp: new Date().toISOString(),
          scannedStatus: scanned
        });

        // Check if we've already scanned this code recently
        if (lastScannedCode === value) {
          console.log('📱 ScanScreen - Duplicate scan detected, ignoring');
          return;
        }

        setScanned(true);
        setLastScannedCode(value);
        
        // Log the scan event
        console.log('📱 ScanScreen - Processing scan:', {
          value: value.substring(0, 20) + '...',
          length: value.length,
          type
        });

        // Small delay for visual feedback
        setTimeout(() => {
          try {
            console.log('📱 ScanScreen - Navigating to ValidScan with data:', {
              scanData: value,
              scanType: 'barcode',
              screen: 'ValidScan'
            });

            // Check if ValidScan screen exists
            if (navigation) {
              // Navigate to ValidScan screen
              navigation.navigate('ValidScan', {
                scanData: value,
                scanType: 'barcode',
              });
              
              // Log successful navigation
              console.log('✅ ScanScreen - Navigation successful to ValidScan');
            } else {
              console.error('❌ ScanScreen - Navigation object is undefined');
              Alert.alert('Error', 'Navigation not available');
            }
          } catch (error) {
            console.error('❌ ScanScreen - Navigation error:', error);
            Alert.alert('Navigation Error', 'Could not navigate to scan results');
          }
        }, 500);
      } else if (codes.length > 0) {
        const codeValue = codes[0]?.value;
        if (codeValue) {
          console.log('⚠️ ScanScreen - Ignoring scan, already processing:', {
            value: codeValue.substring(0, 20) + '...'
          });
        }
      }
    },
  });

  useEffect(() => {
    (async () => {
      try {
        console.log('📱 ScanScreen - Requesting camera permission...');
        const permission = await Camera.requestCameraPermission();
        console.log('📱 ScanScreen - Camera permission:', permission);
        setHasPermission(permission === 'granted');
        
        if (permission !== 'granted') {
          Alert.alert(
            'Camera Permission Required',
            'Please enable camera access to scan barcodes.',
            [
              {
                text: 'Go Back',
                onPress: () => navigation.goBack()
              },
              {
                text: 'Open Settings',
                onPress: () => {
                  // You might want to open app settings here
                  console.log('Opening settings...');
                }
              }
            ]
          );
        }
      } catch (error) {
        console.error('❌ ScanScreen - Permission error:', error);
        Alert.alert('Error', 'Failed to request camera permission');
      }
    })();
  }, []);

// In ScanScreen.tsx, update the handleManualEntry function:
const handleManualEntry = () => {
  console.log('📱 ScanScreen - Manual entry button pressed');
  navigation.navigate('ValidScan', {
    scanData: 'Manual Entry',
    scanType: 'manual',
  });
};

// Update handleClose:
const handleClose = () => {
  console.log('📱 ScanScreen - Close button pressed');
  if (navigation.canGoBack()) {
    navigation.goBack();
  } else {
    // If no back history, navigate to Dashboard
    navigation.navigate('DashboardTab', {
      screen: 'HomeMain'
    });
  }
};

  const handleTorchToggle = () => {
    console.log('📱 ScanScreen - Torch toggled:', !torchOn);
    setTorchOn(!torchOn);
  };

  if (!device) {
    console.log('📱 ScanScreen - No back camera device found');
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>
          Camera not available
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>
          Camera permission required...
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const scanLineTranslateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCAN_SIZE - 4]
  });

  console.log('📱 ScanScreen - Rendering, scanned:', scanned);

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={!scanned}
        codeScanner={codeScanner}
        torch={torchOn ? 'on' : 'off'}
        zoom={device.neutralZoom}
      />

      {/* Overlay */}
      <View style={styles.overlay}>
        {/* Top semi-transparent overlay */}
        <View style={[styles.overlaySection, { height: (height - SCAN_SIZE) / 2 }]} />
        
        {/* Middle section with scanning frame */}
        <View style={styles.middleSection}>
          {/* Left semi-transparent overlay */}
          <View style={[styles.overlaySection, { width: (width - SCAN_SIZE) / 2 }]} />
          
          {/* Scanning frame */}
          <View style={styles.scanFrame}>
            {/* Top-left corner */}
            <View style={styles.cornerTopLeft} />
            {/* Top-right corner */}
            <View style={styles.cornerTopRight} />
            {/* Bottom-left corner */}
            <View style={styles.cornerBottomLeft} />
            {/* Bottom-right corner */}
            <View style={styles.cornerBottomRight} />
            
            {/* Scanning line */}
            <Animated.View 
              style={[
                styles.scanLine,
                {
                  transform: [{ translateY: scanLineTranslateY }]
                }
              ]} 
            />
          </View>
          
          {/* Right semi-transparent overlay */}
          <View style={[styles.overlaySection, { width: (width - SCAN_SIZE) / 2 }]} />
        </View>
        
        {/* Bottom semi-transparent overlay */}
        <View style={[styles.overlaySection, { height: (height - SCAN_SIZE) / 2 }]} />
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionText}>
          Align barcode within the frame
        </Text>
        <Text style={styles.subInstructionText}>
          The barcode will be scanned automatically
        </Text>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleClose}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Barcode</Text>
        <TouchableOpacity
          onPress={handleTorchToggle}
          style={styles.torchButton}
        >
          <Ionicons 
            name={torchOn ? "flash" : "flash-off"} 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>
      </View>

      {/* Manual Entry Button */}
      <TouchableOpacity
        style={styles.manualButton}
        onPress={handleManualEntry}
        disabled={!navigation}
      >
        <Ionicons name="keypad" size={20} color="white" />
        <Text style={styles.manualButtonText}>Enter Manually</Text>
      </TouchableOpacity>

      {/* Scan Indicator */}
      {scanned && (
        <View style={styles.scanIndicator}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.scanIndicatorText}>Processing scan...</Text>
        </View>
      )}

      {/* Debug Info (visible only in development) */}
      {__DEV__ && (
        <View style={styles.debugInfo}>
          <Text style={styles.debugText}>
            Status: {scanned ? 'Processing' : 'Ready'}
          </Text>
          <Text style={styles.debugText}>
            Torch: {torchOn ? 'ON' : 'OFF'}
          </Text>
          {lastScannedCode && (
            <Text style={styles.debugText}>
              Last Scan: {lastScannedCode.substring(0, 10)}...
            </Text>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  loadingText: {
    marginTop: 20,
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlaySection: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  middleSection: {
    flexDirection: 'row',
    width: '100%',
  },
  scanFrame: {
    width: SCAN_SIZE,
    height: SCAN_SIZE,
    borderWidth: BORDER_WIDTH,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#4CAF50',
    borderTopLeftRadius: 10,
  },
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#4CAF50',
    borderTopRightRadius: 10,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#4CAF50',
    borderBottomLeftRadius: 10,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#4CAF50',
    borderBottomRightRadius: 10,
  },
  scanLine: {
    position: 'absolute',
    top: 2,
    left: 10,
    right: 10,
    height: 2,
    backgroundColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  instructionsContainer: {
    position: 'absolute',
    top: (height - SCAN_SIZE) / 2 + SCAN_SIZE + 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 5,
  },
  subInstructionText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textAlign: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingBottom: 15,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  torchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  manualButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    paddingVertical: 15,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  manualButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  scanIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanIndicatorText: {
    color: 'white',
    fontSize: 18,
    marginTop: 10,
    fontWeight: '600',
  },
  debugInfo: {
    position: 'absolute',
    bottom: 100,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    borderRadius: 6,
  },
  debugText: {
    color: '#4CAF50',
    fontSize: 10,
    fontFamily: 'monospace',
  },
});

export default ScanScreen;