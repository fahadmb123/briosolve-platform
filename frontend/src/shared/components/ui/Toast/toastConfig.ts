import type { DefaultToastOptions } from 'react-hot-toast';
import type { CSSProperties } from 'react';
import { toast } from 'react-hot-toast';

export const toastContainerStyle: CSSProperties = {
  zIndex: 99999,
  bottom: 36,
};

export const toastOptions: DefaultToastOptions = {
  position: 'bottom-center',
  duration: 3500,
  style: {
    borderRadius: '9999px',
    padding: '12px 32px',
    fontWeight: 600,
    fontSize: '0.875rem',
    letterSpacing: '0.01em',
    maxWidth: '520px',
    textAlign: 'center',
    justifyContent: 'center',
  },
  success: {
    style: {
      background: '#22C55E',
      color: '#FFFFFF',
      boxShadow: '0 10px 25px -4px rgba(34, 197, 94, 0.45)',
    },
  },
  error: {
    style: {
      background: '#EF4444',
      color: '#FFFFFF',
      boxShadow: '0 10px 25px -4px rgba(239, 68, 68, 0.45)',
    },
  },
  loading: {
    style: {
      background: '#1F2937',
      color: '#FFFFFF',
      boxShadow: '0 10px 25px -4px rgba(0, 0, 0, 0.35)',
    },
  },
};

export const infoToastStyle: CSSProperties = {
  background: '#2563EB',
  color: '#FFFFFF',
  boxShadow: '0 10px 25px -4px rgba(37, 99, 235, 0.45)',
};

let isConfigured = false;

export function configureToastInterceptors() {
  if (isConfigured) return;
  isConfigured = true;

  const origSuccess = toast.success;
  const origError = toast.error;
  const origLoading = toast.loading;
  const origCustom = toast.custom;

  toast.success = ((message, opts) => {
    toast.remove();
    return origSuccess(message, opts);
  }) as typeof toast.success;

  toast.error = ((message, opts) => {
    toast.remove();
    const msgStr = typeof message === 'string' ? message : '';
    const isInfo = /already\s+(verified|registered|exists|used|your\s+current)/i.test(msgStr) || msgStr.toLowerCase().includes('already verified');
    if (isInfo) {
      return toast(message, {
        ...opts,
        style: {
          ...infoToastStyle,
          ...(opts?.style || {}),
        },
      });
    }
    return origError(message, opts);
  }) as typeof toast.error;

  toast.loading = ((message, opts) => {
    toast.remove();
    return origLoading(message, opts);
  }) as typeof toast.loading;

  toast.custom = ((message, opts) => {
    toast.remove();
    return origCustom(message, opts);
  }) as typeof toast.custom;
}
