import { StyleSheet } from 'react-native';
import { colors } from '../colors';
import { spacing } from '../spacing';
import { typography } from '../typography';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
  },

  title: {
    fontSize: typography.title,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 6,
    padding: spacing.sm,
    marginBottom: spacing.md,
    fontSize: typography.text,
  },

  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: spacing.md,
  },

  buttonText: {
    color: colors.white,
    fontSize: typography.text,
    fontWeight: '500',
  },

  link: {
    color: colors.primary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});

export default styles;
