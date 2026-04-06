import { Link } from 'react-router-dom';
import type { Item } from '../../types/item';
import { formatPrice, getCategoryLabel } from '../../utils/itemHelpers';

type AdCardProps = {
  item: Item;
};

function AdCard({ item }: AdCardProps) {
  return (
    <Link
      to={`/ads/${item.id}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '240px',
        border: '1px solid #e7e4ea',
        borderRadius: '14px',
        background: '#ffffff',
        overflow: 'hidden',
        textDecoration: 'none',
        color: '#2d2a31',
      }}
    >
      <div
        style={{
          height: '126px',
          margin: '10px 10px 0',
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
          style={{ width: '56px', height: '56px', color: '#9c98a1', display: 'block' }}
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
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '10px 12px 14px',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: '22px',
            padding: '0 8px',
            border: '1px solid #ddd9df',
            borderRadius: '999px',
            background: '#ffffff',
            color: '#75717a',
            fontSize: '12px',
            lineHeight: 1,
            marginBottom: '10px',
          }}
        >
          {getCategoryLabel(item.category)}
        </div>

        <div
          style={{
            width: '100%',
            minHeight: '52px',
            fontSize: '18px',
            lineHeight: '1.3',
            fontWeight: 500,
            color: '#2f2c33',
            textAlign: 'left',
            wordBreak: 'break-word',
            marginBottom: '14px',
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
            marginBottom: '16px',
          }}
        >
          {formatPrice(item.price)}
        </div>

        <div
          style={{
            marginTop: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            minHeight: '28px',
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

export default AdCard;