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

type ProfileField = {
  id: string;
  icon: string;
  label: string;
  value: string;
  iconColor?: string;
};

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

  // Format join date
  const formatJoinDate = (dateString?: string) => {
    if (!dateString) return 'Recently joined';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // Format date of birth
  const formatDateOfBirth = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long',
      day: 'numeric',
      year: 'numeric' 
    });
  };

  // Get location from coordinates
  const getLocation = () => {
    if (user?.coordinates?.city) {
      return user.coordinates.city;
    }
    return user?.location || '-';
  };

  // Format interests
  const formatInterests = () => {
    if (!user?.interests || user.interests.length === 0) return '-';
    return user.interests.join(', ');
  };

  // Format vibes
  const formatVibes = () => {
    if (!user?.vibes || user.vibes.length === 0) return '-';
    return user.vibes.map((vibe: string) => 
      vibe.charAt(0).toUpperCase() + vibe.slice(1)
    ).join(', ');
  };

  // Format join reasons
  const formatJoinReasons = () => {
    if (!user?.joinReasons || user.joinReasons.length === 0) return '-';
    return user.joinReasons
      .map((reason: string) => 
        reason.split('_').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ')
      )
      .join(', ');
  };

  // Get communities count
  const getCommunitiesCount = () => {
    return user?.communities?.length || 0;
  };

  // Profile fields configuration
  const profileFields: ProfileField[] = [
    {
      id: 'username',
      icon: 'at-outline',
      label: 'Username',
      value: user?.username || '-',
    },
    {
      id: 'email',
      icon: 'mail-outline',
      label: 'Email',
      value: user?.email || '-',
    },
    {
      id: 'dateOfBirth',
      icon: 'calendar-outline',
      label: 'Date of Birth',
      value: formatDateOfBirth(user?.dateOfBirth),
    },
    {
      id: 'location',
      icon: 'location-outline',
      label: 'Location',
      value: getLocation(),
    },
    {
      id: 'verified',
      icon: user?.isVerified ? 'checkmark-circle' : 'close-circle-outline',
      label: 'Account Status',
      value: user?.isVerified ? 'Verified ✓' : 'Not Verified',
      iconColor: user?.isVerified ? '#10B981' : '#6B7280',
    },
  ];

  // Additional info fields
  const additionalFields: ProfileField[] = [
    {
      id: 'interests',
      icon: 'heart-outline',
      label: 'Interests',
      value: formatInterests(),
    },
    {
      id: 'vibes',
      icon: 'flash-outline',
      label: 'Vibes',
      value: formatVibes(),
    },
    {
      id: 'joinReasons',
      icon: 'bulb-outline',
      label: 'Join Reason',
      value: formatJoinReasons(),
    },
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
            title={user?.username}
            onBackPress={() => navigation.goBack()}
            bgColor="#F9FAFB"
          />
        </View>

        {/* Profile Header Card */}
        <View style={styles.profileHeader}>
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            {user?.image ? (
              <Image
                source={{ uri: user.image }}
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
                <Icon name="checkmark-circle" size={24} color="#10B981" />
              </View>
            )}
          </View>

          {/* Name & Bio */}
          <Text style={styles.profileName}>{user?.name || 'User'}</Text>
          <Text style={styles.username}>@{user?.username || 'username'}</Text>

          {user?.bio && (
            <Text style={styles.profileBio}>{user.bio}</Text>
          )}

          {user?.tokens && (
            <Text style={styles.profileBio}>{`💰 ${user.tokens}`}</Text>
          )}

          {/* Join Date Badge */}
          <View style={styles.joinBadge}>
            <Icon name="calendar-outline" size={14} color="#6B7280" />
            <Text style={styles.joinText}>
              Joined {formatJoinDate(user?.createdAt)}
            </Text>
          </View>
        </View>

        {/* Match Score Card */}
        <View style={styles.matchCard}>
          <View style={styles.matchHeader}>
            <View style={styles.matchTitleContainer}>
              <Icon name="heart" size={20} color="#FF6B35" />
              <Text style={styles.matchTitle}>Community Match</Text>
            </View>
            <View style={styles.matchScoreContainer}>
              <Text style={styles.matchScore}>85%</Text>
            </View>
          </View>
          
          <Text style={styles.matchDescription}>
            Based on your interests, location, and community involvement
          </Text>

          {/* Match Indicators */}
          <View style={styles.matchIndicators}>
            {user?.interests && user.interests.length > 0 && (
              <View style={styles.matchIndicator}>
                <View style={[styles.indicatorDot, { backgroundColor: '#10B981' }]} />
                <Text style={styles.indicatorText}>
                  {user.interests.length} Interest{user.interests.length > 1 ? 's' : ''}
                </Text>
              </View>
            )}
            {user?.coordinates?.city && (
              <View style={styles.matchIndicator}>
                <View style={[styles.indicatorDot, { backgroundColor: '#3B82F6' }]} />
                <Text style={styles.indicatorText}>{user.coordinates.city}</Text>
              </View>
            )}
            {user?.isVerified && (
              <View style={styles.matchIndicator}>
                <View style={[styles.indicatorDot, { backgroundColor: '#10B981' }]} />
                <Text style={styles.indicatorText}>Verified Member</Text>
              </View>
            )}
            {user?.onboardingCompleted && (
              <View style={styles.matchIndicator}>
                <View style={[styles.indicatorDot, { backgroundColor: '#F59E0B' }]} />
                <Text style={styles.indicatorText}>Profile Complete</Text>
              </View>
            )}
          </View>
        </View>

        {/* Profile Information Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
        </View>

        <View style={styles.infoSection}>
          {profileFields.map((field, index) => (
            <View
              key={field.id}
              style={[
                styles.infoItem,
                index === profileFields.length - 1 && styles.infoItemLast,
              ]}
            >
              <View style={styles.infoLeft}>
                <View style={styles.iconContainer}>
                  <Icon 
                    name={field.icon} 
                    size={20} 
                    color={field.iconColor || '#6B7280'} 
                  />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>{field.label}</Text>
                  <Text style={styles.infoValue}>{field.value}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Interests & Preferences Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Interests & Preferences</Text>
        </View>

        <View style={styles.infoSection}>
          {additionalFields.map((field, index) => (
            <View
              key={field.id}
              style={[
                styles.infoItem,
                index === additionalFields.length - 1 && styles.infoItemLast,
              ]}
            >
              <View style={styles.infoLeft}>
                <View style={styles.iconContainer}>
                  <Icon name={field.icon} size={20} color="#6B7280" />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>{field.label}</Text>
                  <Text style={styles.infoValue}>{field.value}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Stats Card */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Activity</Text>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Icon name="people" size={24} color="#FF6B35" />
            </View>
            <Text style={styles.statNumber}>{getCommunitiesCount()}</Text>
            <Text style={styles.statLabel}>Communities</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Icon name="gift" size={24} color="#FF6B35" />
            </View>
            <Text style={styles.statNumber}>
              {user?.dailyQuizzes?.length || 0}
            </Text>
            <Text style={styles.statLabel}>Daily Quizzes</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Icon name="star" size={24} color="#FF6B35" />
            </View>
            <Text style={styles.statNumber}>{user?.tokens || 0}</Text>
            <Text style={styles.statLabel}>Tokens</Text>
          </View>
        </View>

        {/* Badges Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Achievements</Text>
        </View>

        <View style={styles.badgesContainer}>
          {user?.onboardingCompleted && (
            <View style={styles.badge}>
              <View style={[styles.badgeIcon, { backgroundColor: '#FEF3C7' }]}>
                <Icon name="trophy" size={24} color="#F59E0B" />
              </View>
              <Text style={styles.badgeLabel}>Onboarding Complete</Text>
            </View>
          )}

          {user?.isVerified && (
            <View style={styles.badge}>
              <View style={[styles.badgeIcon, { backgroundColor: '#D1FAE5' }]}>
                <Icon name="checkmark-circle" size={24} color="#10B981" />
              </View>
              <Text style={styles.badgeLabel}>Verified User</Text>
            </View>
          )}

          {getCommunitiesCount() > 0 && (
            <View style={styles.badge}>
              <View style={[styles.badgeIcon, { backgroundColor: '#DBEAFE' }]}>
                <Icon name="people" size={24} color="#3B82F6" />
              </View>
              <Text style={styles.badgeLabel}>Community Member</Text>
            </View>
          )}
        </View>

        {/* Hangout Places (if any) */}
        {user?.hangoutPlaces && user.hangoutPlaces.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Hangout Places</Text>
            </View>
            <View style={styles.infoSection}>
              <Text style={styles.emptyText}>
                {user.hangoutPlaces.length} place(s) saved
              </Text>
            </View>
          </>
        )}
        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
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
  profileHeader: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  avatarSection: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3F4F6',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
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
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
    lineHeight: 20,
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
  matchCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  matchTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  matchTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  matchScoreContainer: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  matchScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  matchDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 16,
  },
  matchIndicators: {
    gap: 8,
  },
  matchIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  indicatorText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  sectionHeader: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  infoSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoItemLast: {
    borderBottomWidth: 0,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 12,
  },
  badgesContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  badge: {
    flex: 1,
    alignItems: 'center',
  },
  badgeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeLabel: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingVertical: 16,
  },
  bottomSpacing: {
    height: 40,
  },
});