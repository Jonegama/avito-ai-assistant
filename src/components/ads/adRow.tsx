import { Link } from 'react-router-dom';
import type { Item } from '../../types/item';
import { formatPrice, getCategoryLabel } from '../../utils/itemHelpers';

type AdRowProps = {
  item: Item;
};

function AdRow({ item }: AdRowProps) {
  return (
    <Link
      to={`/ads/${item.id}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '18px',
        width: '100%',
        minHeight: '122px',
        padding: '16px 18px',
        border: '1px solid #e7e4ea',
        borderRadius: '14px',
        background: '#ffffff',
        overflow: 'hidden',
        textDecoration: 'none',
        color: '#2d2a31',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '96px',
          height: '72px',
          borderRadius: '10px',
          background: '#eeeeef',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg
          viewBox="0 0 64 64"
          aria-hidden="true"
          style={{ width: '42px', height: '42px', color: '#9c98a1', display: 'block' }}
        >
          <rect
            x="9"
            y="13"
            width="46"
            height="38"
            rx="3"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
          <circle cx="21" cy="24" r="4" fill="currentColor" />
          <path d="M16 43L28 30L36 38L44 27L52 43H16Z" fill="currentColor" />
        </svg>
      </div>

      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            color: '#9a96a0',
            fontSize: '12px',
            lineHeight: 1.2,
            marginBottom: '6px',
          }}
        >
          {getCategoryLabel(item.category)}
        </div>

        <div
          style={{
            width: '100%',
            fontSize: '20px',
            lineHeight: '1.25',
            fontWeight: 500,
            color: '#2f2c33',
            textAlign: 'left',
            wordBreak: 'break-word',
            marginBottom: '6px',
          }}
        >
          {item.title}
        </div>

        <div
          style={{
            width: '100%',
            fontSize: '16px',
            lineHeight: '1.25',
            fontWeight: 700,
            color: '#3d3b41',
            textAlign: 'left',
            marginBottom: item.needsRevision ? '8px' : '0',
          }}
        >
          {formatPrice(item.price)}
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            minHeight: '24px',
            padding: '0 10px',
            borderRadius: '999px',
            background: item.needsRevision ? '#fff1cf' : 'transparent',
            color: item.needsRevision ? '#bf7a00' : 'transparent',
            fontSize: '12px',
            lineHeight: 1,
            visibility: item.needsRevision ? 'visible' : 'hidden',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#bf7a00',
              display: 'inline-block',
            }}
          />
          <span>Требует доработок</span>
        </div>
      </div>
    </Link>
  );
}

export default AdRow;