'use client';

/**
 * StatusBadge - Consistent status indicator with distinct colors
 *
 * Props:
 * - status: 'open', 'progress', 'complete', 'error'
 * - label: Optional custom label (defaults based on status)
 * - icon: Optional icon to display
 * - size: 'sm', 'md', 'lg'
 */
export default function StatusBadge({
  status = 'open',
  label = null,
  icon = null,
  size = 'md'
}) {
  const statusConfig = {
    open: {
      className: 'status-open',
      defaultLabel: 'Open',
      defaultIcon: '●'
    },
    progress: {
      className: 'status-progress',
      defaultLabel: 'In Progress',
      defaultIcon: '◐'
    },
    complete: {
      className: 'status-complete',
      defaultLabel: 'Complete',
      defaultIcon: '✓'
    },
    error: {
      className: 'status-error',
      defaultLabel: 'Error',
      defaultIcon: '✕'
    },
    pending: {
      className: 'status-open',
      defaultLabel: 'Pending',
      defaultIcon: '○'
    },
    processing: {
      className: 'status-progress',
      defaultLabel: 'Processing',
      defaultIcon: '⟳'
    },
    shipped: {
      className: 'status-progress',
      defaultLabel: 'Shipped',
      defaultIcon: '📦'
    },
    delivered: {
      className: 'status-complete',
      defaultLabel: 'Delivered',
      defaultIcon: '✓'
    },
    cancelled: {
      className: 'status-error',
      defaultLabel: 'Cancelled',
      defaultIcon: '✕'
    }
  };

  const config = statusConfig[status] || statusConfig.open;
  const displayLabel = label || config.defaultLabel;
  const displayIcon = icon || config.defaultIcon;

  const sizeStyles = {
    sm: { fontSize: '0.75rem', padding: '4px 10px' },
    md: { fontSize: '0.85rem', padding: '6px 12px' },
    lg: { fontSize: '0.95rem', padding: '8px 16px' }
  };

  return (
    <span
      className={`status-badge ${config.className}`}
      style={sizeStyles[size]}
    >
      <span className="icon-sm">{displayIcon}</span>
      {displayLabel}
    </span>
  );
}

/**
 * OrderStatusBadge - Specific for order statuses
 */
export function OrderStatusBadge({ status }) {
  const statusMap = {
    'pending': 'open',
    'payment_received': 'progress',
    'purchased': 'progress',
    'shipping': 'progress',
    'delivered': 'complete',
    'cancelled': 'error'
  };

  const labelMap = {
    'pending': 'Pending Payment',
    'payment_received': 'Payment Received',
    'purchased': 'Item Purchased',
    'shipping': 'In Transit',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled'
  };

  return (
    <StatusBadge
      status={statusMap[status] || 'open'}
      label={labelMap[status] || status}
    />
  );
}

/**
 * TripStatusBadge - Specific for trip statuses
 */
export function TripStatusBadge({ status }) {
  const statusMap = {
    'planning': 'open',
    'active': 'progress',
    'completed': 'complete',
    'cancelled': 'error'
  };

  const labelMap = {
    'planning': 'Planning',
    'active': 'Active Trip',
    'completed': 'Completed',
    'cancelled': 'Cancelled'
  };

  return (
    <StatusBadge
      status={statusMap[status] || 'open'}
      label={labelMap[status] || status}
    />
  );
}
