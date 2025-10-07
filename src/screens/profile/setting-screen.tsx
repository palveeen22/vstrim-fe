import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../contexts/auth-context';
import HeaderBack from '../../components/header-back';

type MenuItem = {
  id: string;
  icon: string;
  label: string;
  rightText?: string;
  showChevron?: boolean;
  showSwitch?: boolean;
  switchValue?: boolean;
  onPress?: () => void;
};

const SettingScreen = ({ navigation }: any) => {
  const { logout } = useAuth();

  const handleShareShop = () => {
    Alert.alert('Share Shop', 'Fitur share akan segera tersedia');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Apakah Anda yakin ingin keluar?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Gagal logout. Silakan coba lagi.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Menu items dengan actions
  const menuSections: MenuItem[][] = [
    [
      {
        id: 'community',
        icon: 'person-circle-outline',
        label: 'Edit Profile',
        showChevron: true,
        onPress: () => navigation.navigate('MyCommunity'),
      },
      {
        id: 'settings',
        icon: 'settings-outline',
        label: 'Acount Settings',
        showChevron: true,
        onPress: () => navigation.navigate('Settings'),
      },
      {
        id: 'notif',
        icon: 'notifications-outline',
        label: 'Notifications',
        showChevron: true,
        onPress: handleShareShop,
      },
    ],
    [
      {
        id: 'location',
        icon: 'location-outline',
        label: 'My Location',
        showChevron: true,
        onPress: () => navigation.navigate('Charity'),
      },
    ], [

      {
        id: 'logout',
        icon: 'log-out-outline',
        label: 'Logout',
        showChevron: true,
        onPress: handleLogout
      },
    ]
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <HeaderBack
            title='Settings'
            onBackPress={() => navigation.goBack()}
            bgColor='#F9FAFB'
          />
        </View>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.menuSection}>
            {section.map((item, itemIndex) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  itemIndex === section.length - 1 && styles.menuItemLast,
                ]}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemLeft}>
                  <Icon name={item.icon} size={24} color="#374151" />
                  <Text style={styles.menuItemLabel}>{item.label}</Text>
                </View>

                <View style={styles.menuItemRight}>
                  {item.rightText && (
                    <Text style={styles.menuItemRightText}>
                      {item.rightText}
                    </Text>
                  )}
                  {item.showChevron && (
                    <Icon name="chevron-forward" size={20} color="#9CA3AF" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
  },
  menuSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemLabel: {
    fontSize: 16,
    color: '#1e1e1e',
    marginLeft: 16,
    fontWeight: '500',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuItemRightText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 32,
  },
});

export default SettingScreen;