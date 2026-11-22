import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "../../../auth/stores/auth.store";
import "./NotificationsCenter.css";
import { useNotificationStore } from "../../stores/notification.store";
import {
  useGetNotifications,
  useMarkAllNotificationsRead,
  useUpdateNotificationStatus,
} from "../../hooks/useNotifications";
import { mapNotificationToUnified } from "../../utils/notification.mapper";
import { NotificationHeaderBanner } from "./components/NotificationHeaderBanner";

import {
  NotificationToolbar,
  type NotificationFilterTab,
} from "./components/NotificationToolbar";
import { NotificationEmptyState } from "./components/NotificationEmptyState";
import { NotificationItem } from "./components/NotificationItem";
import { NotificationSkeletonItem } from "../../components/NotificationSkeletonItem";
import {
  TIME_GROUPS,
  ROLE_CONFIGS,
  type UserRole,
  type UnifiedNotificationItem,
  type NotificationResponseDto,
} from "../../types/notification.types";

export interface NotificationsCenterProps {
  role?: UserRole;
}

export default function NotificationsCenter({
  role: propRole,
}: NotificationsCenterProps) {
  const location = useLocation();
  const userRole = useAuthStore((state) => state.user?.role);

  const activeRole: UserRole = useMemo(() => {
    if (propRole) return propRole;
    if (location.pathname.startsWith("/admin")) return "ADMIN";
    if (location.pathname.startsWith("/provider")) return "PROVIDER";
    const upper = userRole?.toUpperCase();
    if (upper === "ADMIN" || upper === "PROVIDER" || upper === "CUSTOMER") {
      return upper as UserRole;
    }
    return "CUSTOMER";
  }, [propRole, location.pathname, userRole]);

  const config = ROLE_CONFIGS[activeRole] || ROLE_CONFIGS.CUSTOMER;

  const [activeTab, setActiveTab] = useState<NotificationFilterTab>("all");
  const activeTabRef = useRef<NotificationFilterTab>("all");
  activeTabRef.current = activeTab;

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const isLoadingMoreRef = useRef<boolean>(false);
  const pageRef = useRef<number>(1);
  const totalPagesRef = useRef<number>(1);

  const [notifications, setNotifications] = useState<NotificationResponseDto[]>([]);

  const updateGlobalNotification = useNotificationStore(
    (state) => state.updateNotification,
  );
  const removeGlobalNotification = useNotificationStore(
    (state) => state.removeNotification,
  );

  const updateNotification = useCallback(
    (id: string, changes: Partial<Pick<NotificationResponseDto, "is_read" | "read_at">>) => {
      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...changes } : item))
      );
      updateGlobalNotification(id, changes);
    },
    [updateGlobalNotification]
  );

  const removeNotification = useCallback(
    (id: string) => {
      setNotifications((prev) => prev.filter((item) => item.id !== id));
      removeGlobalNotification(id);
    },
    [removeGlobalNotification]
  );

  const getNotificationsMutation = useGetNotifications();
  const markAllMutation = useMarkAllNotificationsRead();
  const updateStatusMutation = useUpdateNotificationStatus();

  const isPendingRef = useRef<boolean>(false);
  isPendingRef.current = getNotificationsMutation.isPending;
  const cooldownUntilRef = useRef<number>(0);
  const lastScrollYRef = useRef<number>(0);

  useEffect(() => {
    const handleNewNotification = (e: Event) => {
      const detail = (e as CustomEvent).detail as NotificationResponseDto;
      if (detail) {
        setNotifications((prev) => {
          if (prev.some((n) => n.id === detail.id)) return prev;
          return [detail, ...prev];
        });
      }
    };
    window.addEventListener("app:notification", handleNewNotification);
    return () => {
      window.removeEventListener("app:notification", handleNewNotification);
    };
  }, []);

  const fetchPageNotifications = useCallback((pageNum: number, isReset: boolean = false, overrideTab?: NotificationFilterTab) => {
    const tab = overrideTab || activeTabRef.current;
    if (pageNum > 1) {
      isLoadingMoreRef.current = true;
      setIsLoadingMore(true);
    }
    getNotificationsMutation.mutate(
      { page: pageNum, limit: 5, unreadOnly: tab === "unread" ? true : undefined },
      {
        onSuccess: (res) => {
          isLoadingMoreRef.current = false;
          setIsLoadingMore(false);
          lastScrollYRef.current = window.scrollY || document.documentElement.scrollTop;
          cooldownUntilRef.current = Date.now() + 500;
          if (res?.data) {
            if (Array.isArray(res.data)) {
              setNotifications(res.data);
              totalPagesRef.current = 1;
              setTotalPages(1);
            } else {
              const incoming = res.data.notifications || [];
              if (incoming.length === 0) {
                totalPagesRef.current = pageNum;
                setTotalPages(pageNum);
                return;
              }
              setNotifications((prev) => {
                if (isReset || pageNum === 1) return incoming;
                const existingIds = new Set(prev.map((n) => n.id));
                const newUnique = incoming.filter((n) => !existingIds.has(n.id));
                if (newUnique.length === 0) {
                  totalPagesRef.current = pageNum;
                  setTotalPages(pageNum);
                  return prev;
                }
                return [...prev, ...newUnique];
              });
              const pages = res.data.totalPages || 1;
              setTotalPages(pages);
              totalPagesRef.current = pages;
            }
          }
        },
        onError: () => {
          isLoadingMoreRef.current = false;
          setIsLoadingMore(false);
          cooldownUntilRef.current = Date.now() + 500;
        }
      }
    );
  }, [getNotificationsMutation]);

  const fetchPageNotificationsRef = useRef(fetchPageNotifications);
  fetchPageNotificationsRef.current = fetchPageNotifications;

  const handleSelectTab = useCallback((tab: NotificationFilterTab) => {
    setActiveTab(tab);
    activeTabRef.current = tab;
    pageRef.current = 1;
    setPage(1);
    setNotifications([]);
    fetchPageNotifications(1, true, tab);
  }, [fetchPageNotifications]);

  const triggerLoadMore = useCallback(() => {
    if (
      pageRef.current >= totalPagesRef.current ||
      isPendingRef.current ||
      isLoadingMoreRef.current ||
      Date.now() < cooldownUntilRef.current
    ) {
      return;
    }

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const rect = sentinel.getBoundingClientRect();
    if (rect.top <= window.innerHeight + 150) {
      isLoadingMoreRef.current = true;
      setIsLoadingMore(true);
      const nextPage = pageRef.current + 1;
      pageRef.current = nextPage;
      setPage(nextPage);
      fetchPageNotificationsRef.current(nextPage, false);
    }
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 5) {
        triggerLoadMore();
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartY - e.touches[0].clientY > 10) {
        triggerLoadMore();
      }
    };

    const handleScroll = () => {
      const currentY = window.scrollY || document.documentElement.scrollTop;
      if (currentY > lastScrollYRef.current + 15) {
        triggerLoadMore();
      }
      lastScrollYRef.current = currentY;
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [triggerLoadMore]);

  useEffect(() => {
    pageRef.current = 1;
    setPage(1);
    fetchPageNotifications(1, true);
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          triggerLoadMore();
        }
      },
      { rootMargin: "150px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [triggerLoadMore]);

  const unifiedNotifications: UnifiedNotificationItem[] = useMemo(() => {
    const sorted = [...notifications].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return sorted.map((n) => mapNotificationToUnified(n, activeRole));
  }, [notifications, activeRole]);

  const unreadCount = useMemo(
    () => unifiedNotifications.filter((n) => n.unread).length,
    [unifiedNotifications],
  );

  const handleMarkAllRead = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const readAt = new Date();
      notifications.forEach((notification) => {
        if (!notification.is_read) {
          updateNotification(notification.id, {
            is_read: true,
            read_at: readAt,
          });
        }
      });

      markAllMutation.mutate();
    },
    [notifications, updateNotification, markAllMutation],
  );

  const toggleReadStatus = useCallback(
    (id: string) => {
      const target = notifications.find((n) => n.id === id);
      if (!target) return;

      const nextRead = !target.is_read;
      const readAt = nextRead ? new Date() : null;

      updateNotification(id, {
        is_read: nextRead,
        read_at: readAt,
      });

      updateStatusMutation.mutate({
        id,
        data: {
          isRead: nextRead,
          readAt,
        },
      });
    },
    [notifications, updateNotification, updateStatusMutation],
  );

  const filteredNotifications = useMemo(() => {
    return unifiedNotifications.filter((item) => {
      if (activeTab === "unread" && !item.unread) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesSubtitle = item.subtitle.toLowerCase().includes(query);
        const matchesMeta =
          item.metaTags?.some(
            (tag) =>
              tag.value.toLowerCase().includes(query) ||
              tag.label?.toLowerCase().includes(query),
          ) ?? false;

        if (!matchesTitle && !matchesSubtitle && !matchesMeta) {
          return false;
        }
      }
      return true;
    });
  }, [unifiedNotifications, activeTab, searchQuery]);



  const groups = useMemo(() => {
    const result = TIME_GROUPS.map((groupName) => ({
      group: groupName,
      items: filteredNotifications.filter((n) => n.group === groupName),
    })).filter((g) => g.items.length > 0);

    const matchedIds = new Set(result.flatMap((g) => g.items.map((i) => i.id)));
    const unassigned = filteredNotifications.filter((n) => !matchedIds.has(n.id));

    if (unassigned.length > 0) {
      result.push({
        group: "Earlier this month",
        items: unassigned,
      });
    }

    return result;
  }, [filteredNotifications]);

  const resetFilters = useCallback(() => {
    setActiveTab("all");
    setSearchQuery("");
  }, []);

  const isFiltered = Boolean(activeTab !== "all" || searchQuery);

  return (
    <div className="app-content notif-center-container">
      <NotificationHeaderBanner
        config={config}
        unreadCount={unreadCount}
        onMarkAllAsRead={handleMarkAllRead}
      />

      <NotificationToolbar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={unifiedNotifications.length}
        unreadCount={unreadCount}
      />

      {getNotificationsMutation.isPending && notifications.length === 0 ? (
        <div className="notif-group-card">
          <div className="notif-list">
            {Array.from({ length: 5 }).map((_, idx) => (
              <NotificationSkeletonItem key={idx} />
            ))}
          </div>
        </div>
      ) : groups.length === 0 ? (
        <NotificationEmptyState
          isFiltered={isFiltered}
          onResetFilters={resetFilters}
        />
      ) : (
        groups.map(({ group, items }) => (
          <div key={group} className="notif-group-card">
            <div className="notif-group-header">
              <span>{group}</span>
              <span>
                {items.length} {items.length === 1 ? "alert" : "alerts"}
              </span>
            </div>
            <div className="notif-list">
              {items.map((item) => (
                <NotificationItem
                  key={item.id}
                  item={item}
                  onToggleRead={toggleReadStatus}
                  onRemove={removeNotification}
                />
              ))}
            </div>
          </div>
        ))
      )}

      {isLoadingMore && (
        <div className="notif-group-card">
          <div className="notif-list">
            {Array.from({ length: 3 }).map((_, idx) => (
              <NotificationSkeletonItem key={`sk-${idx}`} />
            ))}
          </div>
        </div>
      )}

      {page < totalPages && (
        <div ref={sentinelRef} className="notif-sentinel" />
      )}

      {page >= totalPages && filteredNotifications.length > 5 && (
        <div className="notif-end-message">
          <span>You've reached the end of your notifications</span>
        </div>
      )}
    </div>
  );
}
