import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { CommonStyles } from '../styles/commonStyles';
import { colors } from '../styles/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

const InvalidScanScreen = ({ route, navigation }: any) => {
  const { scanData, scanType } = route.params || {};
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportText, setReportText] = useState('');

  const handleReport = () => {
    setReportModalVisible(true);
  };

  const submitReport = () => {
    if (!reportText.trim()) {
      Alert.alert('Error', 'Please describe the issue');
      return;
    }

    console.log('Report submitted:', {
      scanData,
      scanType,
      report: reportText,
      timestamp: new Date().toISOString(),
    });

    setReportModalVisible(false);
    setReportText('');
    
    Alert.alert(
      'Report Submitted',
      'Thank you for your feedback. We will review this issue.',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const handleScanAgain = () => {
    navigation.goBack(); // Go back to ScanScreen
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <View style={CommonStyles.container}>
        <View style={{ alignItems: 'center', marginVertical: 40 }}>
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: '#FF9800',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <Icon name="warning" size={50} color="white" />
          </View>
          
          <Text style={[CommonStyles.title, { color: '#FF9800' }]}>
            Invalid Scan
          </Text>
          <Text style={[CommonStyles.subtitle, { textAlign: 'center' }]}>
            The scanned code could not be verified.{'\n'}Please try again or report the issue.
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
            <Text style={[CommonStyles.detailValue, { color: '#FF9800' }]}>
              INVALID
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
            style={[CommonStyles.primaryButton, { backgroundColor: '#FF9800' }]}
            onPress={handleReport}
          >
            <Text style={CommonStyles.buttonText}>Report Issue</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[CommonStyles.secondaryButton, { marginTop: 15 }]}
            onPress={handleScanAgain}
          >
            <Text style={[CommonStyles.buttonText, { color: colors.primary }]}>
              Try Scanning Again
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ marginTop: 20 }}
            onPress={handleGoBack}
          >
            <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>
              Close
            </Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={reportModalVisible}
          onRequestClose={() => setReportModalVisible(false)}
        >
          <View style={CommonStyles.modalOverlay}>
            <View style={CommonStyles.modalContent}>
              <View style={CommonStyles.modalHeader}>
                <Text style={CommonStyles.modalTitle}>Report Issue</Text>
                <TouchableOpacity onPress={() => setReportModalVisible(false)}>
                  <Icon name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <Text style={{ marginBottom: 10, color: colors.textSecondary }}>
                Please describe the issue you encountered:
              </Text>

              <TextInput
                style={{
                  backgroundColor: colors.inputBackground,
                  borderWidth: 1,
                  borderColor: colors.inputBorder,
                  borderRadius: 8,
                  padding: 12,
                  minHeight: 100,
                  textAlignVertical: 'top',
                  marginBottom: 20,
                }}
                placeholder="Describe the issue here..."
                value={reportText}
                onChangeText={setReportText}
                multiline
                numberOfLines={4}
              />

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity
                  style={[
                    CommonStyles.secondaryButton,
                    { flex: 1, marginRight: 10, paddingVertical: 12 }
                  ]}
                  onPress={() => setReportModalVisible(false)}
                >
                  <Text style={[CommonStyles.buttonText, { color: colors.primary }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    CommonStyles.primaryButton,
                    { flex: 1, paddingVertical: 12 }
                  ]}
                  onPress={submitReport}
                  disabled={!reportText.trim()}
                >
                  <Text style={CommonStyles.buttonText}>
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default InvalidScanScreen;