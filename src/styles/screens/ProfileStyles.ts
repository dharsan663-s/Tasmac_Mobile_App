import { StyleSheet } from 'react-native';
import { colors } from '../colors';
import { spacing } from '../spacing';
import { typography } from '../typography';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.md,
  },

  avatarContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.gray,
    marginBottom: spacing.sm,
  },

  name: {
    fontSize: typography.title,
    fontWeight: '600',
    color: colors.black,
  },

  email: {
    fontSize: typography.text,
    color: colors.gray,
    marginTop: spacing.sm,
  },

  infoCard: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  infoText: {
    fontSize: typography.text,
    color: colors.black,
  },
});

export default styles;
