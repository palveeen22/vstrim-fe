import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

interface HeaderBackProps {
  title?: string;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  bgColor?: string;
  iconColor?: string;
  titleColor?: string;
  backButtonBgColor?: string;
}

const HeaderBack = ({
  title,
  onBackPress,
  bgColor = '#ffffff',
  iconColor = '#333',
  titleColor = '#333333',
  backButtonBgColor = '#F6F5F5',
  rightComponent,
}: HeaderBackProps) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.headerContainer, { backgroundColor: bgColor }]}>
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: backButtonBgColor }]}
        onPress={handleBackPress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Icon name="arrow-back-outline" size={22} color={iconColor} />
      </TouchableOpacity>
      {title && (
        <Text style={[styles.headerTitle, { color: titleColor }]}>
          {title}
        </Text>
      )}
      <View style={styles.rightContainer}>
        {rightComponent || null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  backButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  rightContainer: {
    minWidth: 28,
  },
});

export default HeaderBack;