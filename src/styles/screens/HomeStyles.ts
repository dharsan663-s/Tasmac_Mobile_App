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

  header: {
    marginBottom: spacing.lg,
  },

  title: {
    fontSize: typography.title,
    fontWeight: '600',
    color: colors.primary,
  },

  subtitle: {
    fontSize: typography.text,
    color: colors.gray,
    marginTop: spacing.sm,
  },

  card: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  cardText: {
    fontSize: typography.text,
    color: colors.black,
  },

  button: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: 6,
    alignItems: 'center',
  },

  buttonText: {
    color: colors.white,
    fontSize: typography.text,
    fontWeight: '500',
  },
});

export default styles;
