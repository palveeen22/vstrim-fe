import { useAuth } from '../../../contexts/AuthContext';
import { HeaderBack } from '../../../shared/components';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// type ProfileField = {
//   id: string;
//   icon: string;
//   label: string;
//   value: string;
//   iconColor?: string;
// };

export const MyProfileScreen = ({ navigation }: any) => {
  const { user } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // // Format join date
  // const formatJoinDate = (dateString?: string) => {
  //   if (!dateString) return 'Recently joined';
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString('en-US', {
  //     month: 'long',
  //     year: 'numeric',
  //   });
  // };

  // // Format date of birth
  // const formatDateOfBirth = (dateString?: string | null) => {
  //   if (!dateString) return '-';
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString('en-US', {
  //     month: 'long',
  //     day: 'numeric',
  //     year: 'numeric',
  //   });
  // };

  // // Get location from coordinates
  // const getLocation = () => {
  //   if (user?.coordinates?.city) {
  //     return user.coordinates.city;
  //   }
  //   return user?.coordinates || '-';
  // };

  // // Format interests
  // const formatInterests = () => {
  //   if (!user?.interests || user.interests.length === 0) return '-';
  //   return user.interests.join(', ');
  // };

  // // Format vibes
  // const formatVibes = () => {
  //   if (!user?.vibes || user.vibes.length === 0) return '-';
  //   return user.vibes
  //     .map((vibe: string) => vibe.charAt(0).toUpperCase() + vibe.slice(1))
  //     .join(', ');
  // };

  // // Format join reasons
  // const formatJoinReasons = () => {
  //   if (!user?.joinReasons || user.joinReasons.length === 0) return '-';
  //   return user.joinReasons
  //     .map((reason: string) =>
  //       reason
  //         .split('_')
  //         .map(
  //           word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
  //         )
  //         .join(' '),
  //     )
  //     .join(', ');
  // };

  // // Get communities count
  // const getCommunitiesCount = () => {
  //   return user?.communities?.length || 0;
  // };

  // // Profile fields configuration
  // const profileFields: ProfileField[] = [
  //   {
  //     id: 'username',
  //     icon: 'at-outline',
  //     label: 'Username',
  //     value: user?.username || '-',
  //   },
  //   {
  //     id: 'email',
  //     icon: 'mail-outline',
  //     label: 'Email',
  //     value: user?.email || '-',
  //   },
  //   {
  //     id: 'dateOfBirth',
  //     icon: 'calendar-outline',
  //     label: 'Date of Birth',
  //     value: formatDateOfBirth(user?.dateOfBirth),
  //   },
  //   {
  //     id: 'location',
  //     icon: 'location-outline',
  //     label: 'Location',
  //     value: getLocation(),
  //   },
  //   {
  //     id: 'verified',
  //     icon: user?.isVerified ? 'checkmark-circle' : 'close-circle-outline',
  //     label: 'Account Status',
  //     value: user?.isVerified ? 'Verified ✓' : 'Not Verified',
  //     iconColor: user?.isVerified ? '#10B981' : '#6B7280',
  //   },
  // ];

  // // Additional info fields
  // const additionalFields: ProfileField[] = [
  //   {
  //     id: 'interests',
  //     icon: 'heart-outline',
  //     label: 'Interests',
  //     value: formatInterests(),
  //   },
  //   {
  //     id: 'vibes',
  //     icon: 'flash-outline',
  //     label: 'Vibes',
  //     value: formatVibes(),
  //   },
  //   {
  //     id: 'joinReasons',
  //     icon: 'bulb-outline',
  //     label: 'Join Reason',
  //     value: formatJoinReasons(),
  //   },
  // ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <HeaderBack
            title={user?.username}
            onBackPress={() => navigation.goBack()}
            bgColor="#D6E8F5"
          />
        </View>

        {/* Profile Header Card */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarSection}>
            {user?.photoProfile ? (
              <Image
                source={{ uri: user.photoProfile }}
                style={styles.avatarLarge}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {user?.name ? getInitials(user.name) : 'U'}
                </Text>
              </View>
            )}
            {user?.isVerified && (
              <View style={styles.verifiedBadge}>
                <Icon name="checkmark-circle" size={24} color="#007BFF" />
              </View>
            )}
          </View>

          {/* Name & Bio */}
          <View style={styles.profileInfoCol}>
            <Text style={styles.profileName}>{user?.name || 'User'}</Text>
            <Text style={styles.username}>@{user?.username || 'username'}</Text>

            {/* Join Date Badge */}
            {/* <View style={styles.joinBadge}>
              <Icon name="calendar-outline" size={14} color="#6B7280" />
              <Text style={styles.joinText}>
                Joined {formatJoinDate(user?.createdAt)}
              </Text>
            </View> */}

            {user?.tokens && (
              <View style={styles.tokenContainer}>
                <Image
                  source={require('../../../assets/icons/token.png')}
                  style={styles.tokenEmoji}
                  resizeMode="contain"
                />
                <Text style={styles.tokenText}>
                  {user?.tokens}
                </Text>
              </View>
            )}

          </View>

          {/* {user?.bio && (
            <Text style={styles.profileBio}>{user.bio}</Text>
          )} */}
        </View>
        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#D6E8F5',
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#D6E8F5',
    gap: 16,
  },
  profileInfoCol: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignContent: 'center',
  },
  avatarSection: {
    position: 'relative',
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E5E5EA',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '600',
    color: '#8E8E93',
  },
  tokenContainer: {
    flexDirection: "row",
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 4,
  },
  tokenEmoji: {
    width: 25,
    height: 25,
  },
  tokenText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#D8E9F6',
    borderRadius: 12,
    padding: 2,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  profileBio: {
    fontSize: 14,
    color: '#6B7280',
  },
  joinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  joinText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 40,
  },
});
