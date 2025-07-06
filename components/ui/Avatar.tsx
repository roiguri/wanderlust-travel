import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import { User } from 'lucide-react-native';
import { theme } from '@/theme';

export interface AvatarProps {
  source?: { uri: string } | number;
  name?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  variant?: 'circular' | 'rounded' | 'square';
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  showBorder?: boolean;
  borderColor?: string;
}

export default function Avatar({
  source,
  name,
  size = 'medium',
  variant = 'circular',
  style,
  imageStyle,
  showBorder = false,
  borderColor = theme.border.default,
}: AvatarProps) {
  const dimensions = getAvatarSize(size);
  const borderRadius = getBorderRadius(variant, dimensions);
  
  const containerStyle = [
    styles.container,
    {
      width: dimensions,
      height: dimensions,
      borderRadius,
    },
    showBorder && {
      borderWidth: 2,
      borderColor,
    },
    style,
  ];

  const avatarImageStyle = [
    styles.image,
    {
      width: dimensions,
      height: dimensions,
      borderRadius,
    },
    imageStyle,
  ];

  // Generate initials from name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate background color from name
  const getBackgroundColor = (name: string): string => {
    const colors = [
      theme.colors.primary[500],
      theme.colors.secondary[500],
      theme.colors.accent[500],
      theme.colors.primary[400],
      theme.colors.secondary[400],
      theme.colors.accent[400],
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  if (source) {
    return (
      <View style={containerStyle}>
        <Image
          source={source}
          style={avatarImageStyle}
          resizeMode="cover"
        />
      </View>
    );
  }

  if (name) {
    const initials = getInitials(name);
    const backgroundColor = getBackgroundColor(name);
    
    return (
      <View style={[containerStyle, { backgroundColor }]}>
        <Text style={[styles.initials, getInitialsSize(size)]}>
          {initials}
        </Text>
      </View>
    );
  }

  // Default fallback with user icon
  return (
    <View style={[containerStyle, styles.fallback]}>
      <User
        size={dimensions * 0.5}
        color={theme.text.inverse}
      />
    </View>
  );
}

function getAvatarSize(size: string): number {
  switch (size) {
    case 'small':
      return 32;
    case 'medium':
      return 48;
    case 'large':
      return 64;
    case 'xlarge':
      return 96;
    default:
      return 48;
  }
}

function getBorderRadius(variant: string, dimensions: number): number {
  switch (variant) {
    case 'circular':
      return dimensions / 2;
    case 'rounded':
      return theme.borderRadius.lg;
    case 'square':
      return 0;
    default:
      return dimensions / 2;
  }
}

function getInitialsSize(size: string) {
  switch (size) {
    case 'small':
      return { fontSize: 12 };
    case 'medium':
      return { fontSize: 16 };
    case 'large':
      return { fontSize: 20 };
    case 'xlarge':
      return { fontSize: 28 };
    default:
      return { fontSize: 16 };
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    // Image styles are applied dynamically
  },
  initials: {
    color: theme.text.inverse,
    fontWeight: theme.typography.fontWeights.semibold,
    includeFontPadding: false,
  },
  fallback: {
    backgroundColor: theme.colors.gray[400],
  },
});