import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  // Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderBack from '../../components/header-back';
import { useAuth } from '../../contexts/auth-context';


const MyCommunityScreen = ({ navigation }: any) => {
  const { user } = useAuth();


  console.log(user?.communities, "<<<<<<<");

  const handleCommunityPress = (communityId: string) => {
    // Navigate to community detail
    Alert.alert('Community Detail', `Navigating to community ${communityId}`);
  };

  // const handleLeaveCommunity = (communityId: string, communityName: string) => {
  //   Alert.alert(
  //     'Leave Community',
  //     `Are you sure you want to leave "${communityName}"?`,
  //     [
  //       {
  //         text: 'Cancel',
  //         style: 'cancel',
  //       },
  //       {
  //         text: 'Leave',
  //         style: 'destructive',
  //         onPress: () => {
  //           setCommunities(prev =>
  //             prev.map(comm =>
  //               comm.id === communityId
  //                 ? { ...comm, isJoined: false, memberCount: comm.memberCount - 1 }
  //                 : comm
  //             )
  //           );
  //           Alert.alert('Success', 'You have left the community');
  //         },
  //       },
  //     ]
  //   );
  // };

  const handleExploreMore = () => {
    Alert.alert('Explore Communities', 'Feature coming soon!');
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      Hobbies: 'color-palette-outline',
      Safety: 'shield-checkmark-outline',
      Food: 'restaurant-outline',
      Sports: 'football-outline',
      Education: 'school-outline',
    };
    return icons[category] || 'people-outline';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Hobbies: '#10B981',
      Safety: '#3B82F6',
      Food: '#F59E0B',
      Sports: '#EF4444',
      Education: '#8B5CF6',
    };
    return colors[category] || '#6B7280';
  };

  const joinedCommunities = user?.communities

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
            title="My Communities"
            onBackPress={() => navigation.goBack()}
            bgColor="#F9FAFB"
          />
        </View>

        {/* Communities List Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Communities</Text>
          <TouchableOpacity onPress={handleExploreMore}>
            <Text style={styles.exploreButton}>Explore More</Text>
          </TouchableOpacity>
        </View>

        {/* Communities List */}
        {joinedCommunities?.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="people-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No Communities Yet</Text>
            <Text style={styles.emptyDescription}>
              Join communities to connect with people who share your interests
            </Text>
            <TouchableOpacity
              style={styles.exploreCTA}
              onPress={handleExploreMore}
            >
              <Text style={styles.exploreCTAText}>Explore Communities</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.communitiesList}>
            {joinedCommunities?.map((community, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.communityCard}
                onPress={() => handleCommunityPress(community.id)}
                activeOpacity={0.7}
              >
                {/* Community Image/Icon */}
                <View style={styles.communityLeft}>
                  {/* {community.image ? (
                    <Image
                      source={{ uri: community.image }}
                      style={styles.communityImage}
                    />
                  ) : (
                    <View
                      style={[
                        styles.communityIconPlaceholder,
                        {
                          backgroundColor:
                            getCategoryColor(community.category) + '15',
                        },
                      ]}
                    >
                      <Icon
                        name={getCategoryIcon(community.category)}
                        size={28}
                        color={getCategoryColor(community.category)}
                      />
                    </View>
                  )} */}

                  <View style={styles.communityInfo}>
                    <Text style={styles.communityName} numberOfLines={1}>
                      {community?.community?.name}
                    </Text>
                    <Text style={styles.communityDescription} numberOfLines={2}>
                      {community?.community?.description}
                    </Text>
                    <View style={styles.communityMeta}>
                      {/* <Icon name="people" size={14} color="#9CA3AF" /> */}
                      {/* <Text style={styles.memberCount}>
                        {community.memberCount.toLocaleString()} members
                      </Text> */}
                      {/* <View
                        style={[
                          styles.categoryBadge,
                          {
                            backgroundColor:
                              getCategoryColor(community.category) + '15',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.categoryText,
                            { color: getCategoryColor(community.category) },
                          ]}
                        >
                          {community.category}
                        </Text>
                      </View> */}
                    </View>
                  </View>
                </View>

                {/* Action Button */}
                {/* <TouchableOpacity
                  style={styles.leaveButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleLeaveCommunity(community.id, community.name);
                  }}
                >
                  <Icon name="exit-outline" size={20} color="#EF4444" />
                </TouchableOpacity> */}
              </TouchableOpacity>
            ))}
          </View>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  exploreButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  exploreCTA: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  exploreCTAText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  communitiesList: {
    paddingHorizontal: 16,
  },
  communityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  communityLeft: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-start',
  },
  communityImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  communityIconPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  communityInfo: {
    flex: 1,
    marginLeft: 12,
  },
  communityName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  communityDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 18,
  },
  communityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  memberCount: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
    marginRight: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  leaveButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  bottomSpacing: {
    height: 32,
  },
});

export default MyCommunityScreen;