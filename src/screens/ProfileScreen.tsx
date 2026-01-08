import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { ProfileStyles } from '../styles/screens/ProfileStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen = ({ navigation }: any) => {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    company: 'TASMAC Inc.',
    position: 'Scanning Operator',
    joinDate: '2024-01-15',
  });

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          }),
        },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Coming Soon', 'Edit profile feature will be available soon!');
  };

  const menuItems = [
    { icon: 'history', title: 'Scan History', onPress: () => navigation.navigate('ScanLogTab') },
    { icon: 'settings', title: 'Settings', onPress: () => Alert.alert('Settings', 'Settings screen coming soon!') },
    { icon: 'help', title: 'Help & Support', onPress: () => Alert.alert('Help', 'Help screen coming soon!') },
    { icon: 'privacy-tip', title: 'Privacy Policy', onPress: () => Alert.alert('Privacy', 'Privacy policy screen coming soon!') },
    { icon: 'description', title: 'Terms of Service', onPress: () => Alert.alert('Terms', 'Terms of service screen coming soon!') },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <ScrollView style={ProfileStyles.container}>
        <View style={ProfileStyles.header}>
          <View style={ProfileStyles.avatarContainer}>
            <View style={ProfileStyles.avatar}>
              <Text style={ProfileStyles.avatarText}>
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <TouchableOpacity style={ProfileStyles.editAvatarButton}>
              <Icon name="camera-alt" size={20} color="white" />
            </TouchableOpacity>
          </View>
          
          <Text style={ProfileStyles.userName}>{user.name}</Text>
          <Text style={ProfileStyles.userEmail}>{user.email}</Text>
          <Text style={ProfileStyles.userPosition}>{user.position}</Text>
        </View>

        <View style={ProfileStyles.statsContainer}>
          <View style={ProfileStyles.statItem}>
            <Text style={ProfileStyles.statValue}>245</Text>
            <Text style={ProfileStyles.statLabel}>Total Scans</Text>
          </View>
          <View style={ProfileStyles.statItem}>
            <Text style={ProfileStyles.statValue}>89%</Text>
            <Text style={ProfileStyles.statLabel}>Success Rate</Text>
          </View>
          <View style={ProfileStyles.statItem}>
            <Text style={ProfileStyles.statValue}>42</Text>
            <Text style={ProfileStyles.statLabel}>Days Active</Text>
          </View>
        </View>

        <View style={ProfileStyles.infoCard}>
          <View style={ProfileStyles.infoRow}>
            <Icon name="business" size={20} color="#666" />
            <Text style={ProfileStyles.infoLabel}>Company:</Text>
            <Text style={ProfileStyles.infoValue}>{user.company}</Text>
          </View>
          <View style={ProfileStyles.infoRow}>
            <Icon name="phone" size={20} color="#666" />
            <Text style={ProfileStyles.infoLabel}>Phone:</Text>
            <Text style={ProfileStyles.infoValue}>{user.phone}</Text>
          </View>
          <View style={ProfileStyles.infoRow}>
            <Icon name="event" size={20} color="#666" />
            <Text style={ProfileStyles.infoLabel}>Member Since:</Text>
            <Text style={ProfileStyles.infoValue}>{user.joinDate}</Text>
          </View>
        </View>

        <View style={ProfileStyles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={ProfileStyles.menuItem}
              onPress={item.onPress}
            >
              <View style={ProfileStyles.menuItemLeft}>
                <Icon name={item.icon} size={24} color="#666" />
                <Text style={ProfileStyles.menuItemText}>{item.title}</Text>
              </View>
              <Icon name="chevron-right" size={24} color="#999" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={ProfileStyles.actionsContainer}>
          <TouchableOpacity
            style={ProfileStyles.editButton}
            onPress={handleEditProfile}
          >
            <Text style={ProfileStyles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={ProfileStyles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={ProfileStyles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;