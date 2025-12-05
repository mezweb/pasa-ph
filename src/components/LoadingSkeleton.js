'use client';

/**
 * Loading Skeleton components - Grey pulse loaders instead of spinners
 *
 * Available components:
 * - ProductCardSkeleton: For product cards
 * - SellerCardSkeleton: For seller profiles
 * - TextSkeleton: For text lines
 * - ImageSkeleton: For images
 * - TableRowSkeleton: For table rows
 * - GenericSkeleton: Customizable skeleton
 */

const pulseAnimation = {
  animation: 'pulse 1.5s ease-in-out infinite'
};

const skeletonBase = {
  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
  backgroundSize: '200% 100%',
  borderRadius: '8px',
  ...pulseAnimation
};

export function ProductCardSkeleton() {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #eee',
      padding: '15px',
      width: '100%'
    }}>
      {/* Image */}
      <div style={{
        ...skeletonBase,
        width: '100%',
        paddingBottom: '75%', // 4:3 aspect ratio
        marginBottom: '12px'
      }}></div>

      {/* Title */}
      <div style={{
        ...skeletonBase,
        height: '20px',
        width: '80%',
        marginBottom: '8px'
      }}></div>

      {/* Price */}
      <div style={{
        ...skeletonBase,
        height: '24px',
        width: '40%',
        marginBottom: '8px'
      }}></div>

      {/* Seller info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
        <div style={{
          ...skeletonBase,
          width: '32px',
          height: '32px',
          borderRadius: '50%'
        }}></div>
        <div style={{
          ...skeletonBase,
          height: '16px',
          width: '100px'
        }}></div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

export function SellerCardSkeleton() {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #eee',
      padding: '20px'
    }}>
      {/* Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
        <div style={{
          ...skeletonBase,
          width: '64px',
          height: '64px',
          borderRadius: '50%'
        }}></div>
        <div style={{ flex: 1 }}>
          <div style={{
            ...skeletonBase,
            height: '20px',
            width: '60%',
            marginBottom: '8px'
          }}></div>
          <div style={{
            ...skeletonBase,
            height: '16px',
            width: '40%'
          }}></div>
        </div>
      </div>

      {/* Bio */}
      <div style={{
        ...skeletonBase,
        height: '14px',
        width: '100%',
        marginBottom: '6px'
      }}></div>
      <div style={{
        ...skeletonBase,
        height: '14px',
        width: '90%',
        marginBottom: '15px'
      }}></div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '20px' }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ flex: 1 }}>
            <div style={{
              ...skeletonBase,
              height: '18px',
              width: '100%',
              marginBottom: '4px'
            }}></div>
            <div style={{
              ...skeletonBase,
              height: '14px',
              width: '60%'
            }}></div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

export function TextSkeleton({ lines = 3, width = '100%' }) {
  return (
    <div style={{ width }}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          style={{
            ...skeletonBase,
            height: '16px',
            width: index === lines - 1 ? '70%' : '100%',
            marginBottom: index < lines - 1 ? '10px' : '0'
          }}
        ></div>
      ))}
      <style jsx>{`
        @keyframes pulse {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

export function ImageSkeleton({ width = '100%', height = '200px', borderRadius = '8px' }) {
  return (
    <>
      <div style={{
        ...skeletonBase,
        width,
        height,
        borderRadius
      }}></div>
      <style jsx>{`
        @keyframes pulse {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </>
  );
}

export function TableRowSkeleton({ columns = 4 }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} style={{ padding: '15px 10px' }}>
          <div style={{
            ...skeletonBase,
            height: '16px',
            width: index === 0 ? '80%' : '60%'
          }}></div>
        </td>
      ))}
      <style jsx>{`
        @keyframes pulse {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </tr>
  );
}

export function GenericSkeleton({ width = '100%', height = '100px', borderRadius = '8px', style = {} }) {
  return (
    <>
      <div style={{
        ...skeletonBase,
        width,
        height,
        borderRadius,
        ...style
      }}></div>
      <style jsx>{`
        @keyframes pulse {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </>
  );
}

/**
 * Dashboard Skeleton - For loading dashboard layouts
 */
export function DashboardSkeleton() {
  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{
          ...skeletonBase,
          height: '32px',
          width: '250px',
          marginBottom: '10px'
        }}></div>
        <div style={{
          ...skeletonBase,
          height: '18px',
          width: '400px'
        }}></div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #eee',
            padding: '20px'
          }}>
            <div style={{
              ...skeletonBase,
              height: '18px',
              width: '60%',
              marginBottom: '12px'
            }}></div>
            <div style={{
              ...skeletonBase,
              height: '28px',
              width: '40%'
            }}></div>
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        border: '1px solid #eee',
        padding: '20px'
      }}>
        <div style={{
          ...skeletonBase,
          height: '24px',
          width: '200px',
          marginBottom: '20px'
        }}></div>
        <TextSkeleton lines={5} />
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

/**
 * Product Grid Skeleton - For loading product grids
 */
export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '20px',
      padding: '20px'
    }}>
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export default GenericSkeleton;
