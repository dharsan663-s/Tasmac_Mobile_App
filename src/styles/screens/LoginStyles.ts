import { StyleSheet } from 'react-native';
import { colors } from '../colors';
import { spacing } from '../spacing';
import { typography } from '../typography';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: typography.title,
    color: colors.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  link: {
    color: colors.primary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
