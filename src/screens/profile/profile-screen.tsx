import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  Switch,
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

const ProfileScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [holidayMode, setHolidayMode] = React.useState(false);

  const handleShareShop = () => {
    Alert.alert('Share Shop', 'Fitur share akan segera tersedia');
  };

  // Menu items dengan actions
  const menuSections: MenuItem[][] = [
    [
      {
        id: 'community',
        icon: 'clipboard-outline',
        label: 'My Comunities',
        showChevron: true,
        onPress: () => navigation.navigate('MyCommunity'),
      },
      {
        id: 'settings',
        icon: 'settings-outline',
        label: 'Manage Account',
        showChevron: true,
        onPress: () => navigation.navigate('Settings'),
      },
      {
        id: 'share',
        icon: 'share-social-outline',
        label: 'Share Account',
        showChevron: true,
        onPress: handleShareShop,
      },
    ],
    [
      {
        id: 'charity',
        icon: 'earth-outline',
        label: 'Support with Us',
        showChevron: true,
        onPress: () => navigation.navigate('Charity'),
      },
      {
        id: 'faq',
        icon: 'help-circle-outline',
        label: 'Frequently Asked Questions',
        showChevron: true,
        onPress: () => navigation.navigate('FAQ'),
      },
      {
        id: 'tac',
        icon: 'reader-outline',
        label: 'Terms and Conditions',
        showChevron: true,
        onPress: () => navigation.navigate('TnC'),
      },
    ], [
      {
        id: 'support',
        icon: 'chatbubble-ellipses-outline',
        label: 'Contact Support',
        showChevron: true,
        onPress: () => navigation.navigate('Support'),
      },
      {
        id: 'nonactive',
        icon: 'notifications-outline',
        label: 'Mode liburan',
        showSwitch: true,
        switchValue: holidayMode,
        // onPress: () => { },
      },
    ]
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

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
            title='Profile'
            onBackPress={() => navigation.goBack()}
            bgColor='#F9FAFB'
          />
        </View>

        {/* User Profile Card */}
        <TouchableOpacity
          style={styles.profileCard}
          onPress={() => navigation.navigate('Profile')}
          activeOpacity={0.7}
        >
          <View style={styles.profileContent}>
            {user?.image ? (
              <Image
                source={{ uri: user.image }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {user?.name ? getInitials(user.name) : 'U'}
                </Text>
              </View>
            )}

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {user?.name || 'User'}
              </Text>
              <Text style={styles.profileSubtext}>See profile</Text>
            </View>
          </View>

          <Icon name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

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

                  {item.showSwitch && (
                    <Switch
                      value={item.switchValue}
                      onValueChange={(value) => {
                        if (item.id === 'holiday') {
                          setHolidayMode(value);
                        }
                      }}
                      trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                      thumbColor="#fff"
                    />
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3F4F6',
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  profileSubtext: {
    fontSize: 14,
    color: '#6B7280',
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
});

export default ProfileScreen;