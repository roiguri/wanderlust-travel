import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '@/components/ui/Button';
import FormInput from '@/components/ui/FormInput';
import Card from '@/components/ui/Card';
import { useState } from 'react';
import { theme } from '@/theme';

export default function ExploreTab() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePrimaryAction = () => {
    Alert.alert('Primary Button', 'Primary button pressed!');
  };

  const handleSecondaryAction = () => {
    Alert.alert('Secondary Button', 'Secondary button pressed!');
  };

  const handleCardPress = () => {
    Alert.alert('Card Pressed', 'Interactive card was tapped!');
  };

  const handleLogin = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Login', `Email: ${email}`);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Design System</Text>
          <Text style={styles.subtitle}>Airbnb-inspired components for our trip planning app</Text>
          
          {/* Button Examples */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Buttons</Text>
            <Text style={styles.sectionDescription}>Primary and secondary button variants with different sizes</Text>
            
            <View style={styles.buttonRow}>
              <Button
                title="Primary Large"
                onPress={handlePrimaryAction}
                variant="primary"
                size="large"
                style={styles.buttonSpacing}
              />
            </View>
            
            <View style={styles.buttonRow}>
              <Button
                title="Primary"
                onPress={handlePrimaryAction}
                variant="primary"
                style={styles.buttonSpacing}
              />
              <Button
                title="Secondary"
                onPress={handleSecondaryAction}
                variant="secondary"
                style={styles.buttonSpacing}
              />
            </View>
            
            <View style={styles.buttonRow}>
              <Button
                title="Small"
                onPress={handlePrimaryAction}
                variant="primary"
                size="small"
                style={styles.buttonSpacing}
              />
              <Button
                title="Disabled"
                onPress={handlePrimaryAction}
                variant="primary"
                size="small"
                disabled
                style={styles.buttonSpacing}
              />
              <Button
                title="Loading"
                onPress={handleLogin}
                variant="primary"
                size="small"
                loading={loading}
              />
            </View>
          </Card>

          {/* Form Input Examples */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Form Inputs</Text>
            <Text style={styles.sectionDescription}>Clean, accessible form inputs with validation states</Text>
            
            <FormInput
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              required
            />
            
            <FormInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              required
            />
            
            <FormInput
              label="Destination"
              placeholder="Where would you like to go?"
              error="Please enter a valid destination"
            />
            
            <Button
              title={loading ? "Signing In..." : "Sign In"}
              onPress={handleLogin}
              variant="primary"
              loading={loading}
              style={{ marginTop: theme.spacing[2] }}
            />
          </Card>

          {/* Card Examples */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Cards</Text>
            <Text style={styles.sectionDescription}>Flexible card components with different variants</Text>
          </Card>
          
          <Card variant="elevated" style={styles.section}>
            <Text style={styles.cardTitle}>Elevated Card</Text>
            <Text style={styles.cardDescription}>
              This card has enhanced shadow for more prominence. Perfect for featured content or important actions.
            </Text>
          </Card>
          
          <Card variant="outlined" style={styles.section}>
            <Text style={styles.cardTitle}>Outlined Card</Text>
            <Text style={styles.cardDescription}>
              This card uses a border instead of shadow for a cleaner look. Great for secondary content.
            </Text>
          </Card>
          
          <Card onPress={handleCardPress} style={styles.section}>
            <Text style={styles.cardTitle}>Interactive Card</Text>
            <Text style={styles.cardDescription}>
              This card is pressable and will show feedback when tapped. Tap me to see it in action!
            </Text>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.semanticColors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacingPatterns.screen.horizontal,
  },
  title: {
    ...theme.textStyles.h2,
    color: theme.semanticColors.text.primary,
    marginBottom: theme.spacing[2],
    textAlign: 'center',
    includeFontPadding: false,
  },
  subtitle: {
    ...theme.textStyles.body1,
    color: theme.semanticColors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing[6],
    includeFontPadding: false,
  },
  section: {
    marginBottom: theme.spacing[6],
  },
  sectionTitle: {
    ...theme.textStyles.h4,
    color: theme.semanticColors.text.primary,
    marginBottom: theme.spacing[2],
    includeFontPadding: false,
  },
  sectionDescription: {
    ...theme.textStyles.body2,
    color: theme.semanticColors.text.secondary,
    marginBottom: theme.spacing[4],
    includeFontPadding: false,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing[3],
    flexWrap: 'wrap',
  },
  buttonSpacing: {
    marginRight: theme.spacing[3],
    marginBottom: theme.spacing[2],
  },
  cardTitle: {
    ...theme.textStyles.h5,
    color: theme.semanticColors.text.primary,
    marginBottom: theme.spacing[2],
    includeFontPadding: false,
  },
  cardDescription: {
    ...theme.textStyles.body2,
    color: theme.semanticColors.text.secondary,
    includeFontPadding: false,
  },
});