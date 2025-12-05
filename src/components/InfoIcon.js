'use client';

import Tooltip from './Tooltip';

/**
 * InfoIcon - Question mark icon with tooltip
 *
 * Usage:
 * import InfoIcon from '@/components/InfoIcon';
 * import { TOOLTIPS } from '@/lib/copy';
 *
 * <InfoIcon text={TOOLTIPS.serviceFee} />
 * <InfoIcon text="Custom tooltip text" position="right" />
 *
 * Props:
 * - text: Tooltip text to display
 * - position: 'top', 'bottom', 'left', 'right' (default: 'top')
 * - size: 'sm', 'md', 'lg' (default: 'md')
 * - color: Custom color (default: '#666')
 */
export default function InfoIcon({
  text,
  position = 'top',
  size = 'md',
  color = '#666'
}) {
  const sizes = {
    sm: '0.75rem',
    md: '0.875rem',
    lg: '1rem'
  };

  return (
    <Tooltip text={text} position={position}>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: sizes[size] === '0.75rem' ? '16px' : sizes[size] === '0.875rem' ? '18px' : '20px',
          height: sizes[size] === '0.75rem' ? '16px' : sizes[size] === '0.875rem' ? '18px' : '20px',
          borderRadius: '50%',
          border: `1.5px solid ${color}`,
          color: color,
          fontSize: sizes[size],
          fontWeight: '600',
          cursor: 'help',
          marginLeft: '6px',
          transition: 'all 0.2s ease',
          flexShrink: 0
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = color;
          e.currentTarget.style.color = 'white';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = color;
        }}
      >
        ?
      </span>
    </Tooltip>
  );
}

/**
 * LabelWithInfo - Label with inline info icon
 *
 * Usage:
 * <LabelWithInfo label="Service Fee" tooltip={TOOLTIPS.serviceFee} />
 */
export function LabelWithInfo({
  label,
  tooltip,
  required = false,
  position = 'top',
  size = 'md'
}) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      marginBottom: '8px'
    }}>
      <label style={{
        fontSize: '0.95rem',
        fontWeight: '600',
        color: '#333'
      }}>
        {label}
        {required && <span style={{ color: '#dc3545', marginLeft: '4px' }}>*</span>}
      </label>
      <InfoIcon text={tooltip} position={position} size={size} />
    </div>
  );
}

/**
 * ServiceFeeLabel - Pre-configured for service fee
 */
export function ServiceFeeLabel({ amount }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 0'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: '0.95rem', color: '#666' }}>Service Fee (10%)</span>
        <InfoIcon
          text="A 10% tip for the traveler who's shopping, carrying, and delivering your item from abroad. This covers their effort, luggage space, and delivery time."
          position="top"
          size="sm"
        />
      </div>
      <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#333' }}>
        {amount}
      </span>
    </div>
  );
}
