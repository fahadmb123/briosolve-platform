export type UserRole = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';

export type NotificationTimeGroup = 'Today' | 'Yesterday' | 'Earlier this week' | 'Earlier this month';

export interface NotificationAction {
  label: string;
  link: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
}

export interface NotificationMetaTag {
  label?: string;
  value: string;
  icon?: string;
}

export interface UnifiedNotificationItem {
  id: string;
  role: UserRole;
  category: string;
  title: string;
  subtitle: string;
  time: string;
  group: NotificationTimeGroup;
  unread: boolean;
  icon: string;
  iconColor: string;
  iconBg: string;
  badgeLabel?: string;
  badgeType?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  metaTags?: NotificationMetaTag[];
  primaryAction?: NotificationAction;
  secondaryAction?: NotificationAction;
}

export interface NotificationCategoryTab {
  id: string;
  label: string;
}

export interface NotificationStatCard {
  id: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  value: string | number;
  label: string;
}

export interface RoleNotificationConfig {
  headerTitle: string;
  headerIcon: string;
  headerSubtitle: string;
  settingsLink: string;
  settingsLabel: string;
  badgePillText?: string;
  categories: NotificationCategoryTab[];
  getStats: (notifications: UnifiedNotificationItem[], unreadCount: number) => NotificationStatCard[];
}
