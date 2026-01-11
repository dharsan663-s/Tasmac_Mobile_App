// screens/ImportFileScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
  Dimensions,
  Modal,
  SafeAreaView,
} from 'react-native';

import XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  pick,
  types,
  DocumentPickerResponse,
} from '@react-native-documents/picker';

const { width: screenWidth } = Dimensions.get('window');

interface FileData {
  name: string;
  size: number;
  type: string;
  uri: string;
}

interface TableData {
  headers: string[];
  rows: any[][];
}

const ImportFileScreen: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean>(true);
  useEffect(() => {
    if (Platform.OS === 'android' && Platform.Version < 30) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      ).then(granted => {
        if (!granted) setPermissionModalVisible(true);
        setHasPermission(granted);
      });
    }
  }, []);
const selectFile = async () => {
  try {
    const res: DocumentPickerResponse[] = await pick({
      type: [
        types.xls,
        types.xlsx,
        types.csv,
        types.plainText,
      ],
      allowMultiSelection: false,
    });

    const file = res[0];
    if (!file) return;

    if (file.size && file.size > 10 * 1024 * 1024) {
      Alert.alert('File too large', 'Max allowed size is 10MB');
      return;
    }

    setSelectedFile({
      name: file.name ?? 'Unknown',
      size: file.size ?? 0,
      type: file.type ?? '',
      uri: file.uri,
    });

    setTableData(null);
  } catch (e: any) {
    if (e?.code !== 'DOCUMENT_PICKER_CANCELED') {
      console.error(e);
      Alert.alert('Error', 'File selection failed');
    }
  }
};
  const parseExcel = async (uri: string): Promise<TableData> => {
    let path = uri;

    if (uri.startsWith('content://')) {
      const dest = `${RNFS.CachesDirectoryPath}/${Date.now()}.xlsx`;
      await RNFS.copyFile(uri, dest);
      path = dest;
    }

    const base64 = await RNFS.readFile(path, 'base64');
    const wb = XLSX.read(base64, { type: 'base64' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];

    const headers = data[0]?.map(String) ?? [];
    const rows = data.slice(1);

    return { headers, rows };
  };
  const parseCSV = async (uri: string): Promise<TableData> => {
    let path = uri;

    if (uri.startsWith('content://')) {
      const dest = `${RNFS.CachesDirectoryPath}/${Date.now()}.csv`;
      await RNFS.copyFile(uri, dest);
      path = dest;
    }

    const content = await RNFS.readFile(path, 'utf8');
    const lines = content.split('\n').filter(Boolean);
    const headers = lines[0].split(',');
    const rows = lines.slice(1).map(l => l.split(','));

    return { headers, rows };
  };
  const uploadFile = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setUploadProgress(0);

    try {
      const timer = setInterval(() => {
        setUploadProgress(p => Math.min(p + 10, 90));
      }, 100);

      let data: TableData;

      if (selectedFile.name.endsWith('.csv')) {
        data = await parseCSV(selectedFile.uri);
      } else {
        data = await parseExcel(selectedFile.uri);
      }

      clearInterval(timer);
      setUploadProgress(100);

      setTimeout(() => {
        setTableData(data);
        setLoading(false);
      }, 300);
    } catch (e) {
      setLoading(false);
      Alert.alert('Error', 'Failed to process file');
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Icon name="cloud-upload" size={32} color="#fff" />
        <Text style={styles.headerTitle}>Data Import</Text>
      </View>

      <ScrollView>
        {/* SELECT FILE */}
        <View style={styles.card}>
          <TouchableOpacity style={styles.browseButton} onPress={selectFile}>
            <Icon name="folder-open" size={20} color="#fff" />
            <Text style={styles.browseButtonText}>Browse File</Text>
          </TouchableOpacity>

          {selectedFile && (
            <Text style={styles.fileName}>{selectedFile.name}</Text>
          )}
        </View>

        {/* UPLOAD */}
        <View style={styles.card}>
          <TouchableOpacity
            style={[
              styles.uploadButton,
              (!selectedFile || loading) && { opacity: 0.6 },
            ]}
            onPress={uploadFile}
            disabled={!selectedFile || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.uploadText}>Upload & Process</Text>
            )}
          </TouchableOpacity>

          {loading && (
            <Text style={styles.progressText}>{uploadProgress}%</Text>
          )}
        </View>

        {/* TABLE */}
        {tableData && (
          <View style={styles.card}>
            <Text style={styles.tableTitle}>
              Rows: {tableData.rows.length} | Columns:{' '}
              {tableData.headers.length}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ImportFileScreen;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', paddingTop: 16 },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 4,
  },
  browseButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  browseButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
  uploadButton: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  uploadText: {
    color: '#fff',
    fontWeight: '600',
  },
  fileName: {
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  progressText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#007AFF',
    fontWeight: '600',
  },
  tableTitle: {
    fontWeight: '600',
    textAlign: 'center',
  },
});
