import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../styles/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';


const { width } = Dimensions.get('window');

interface ScanStatsCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
}

const ScanStatsCard: React.FC<ScanStatsCardProps> = ({ title, value, icon, color }) => {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: `${color}20` }
        ]}
      >
        <Icon name={icon} size={24} color={color} />
      </View>
      <Text style={styles.valueText}>
        {value}
      </Text>
      <Text style={styles.titleText}>
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  valueText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  titleText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default ScanStatsCard;