import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckIcon } from '../ui/Icons';

interface WatchUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  movieTitle: string;
}

interface Offer {
  offer_id: string | number;
  name_short: string;
  adcopy: string;
  picture: string;
  link: string;
}

export const WatchUnlockModal: React.FC<WatchUnlockModalProps> = ({
  isOpen,
  onClose,
  movieTitle
}) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    fetch('/api/offers')
      .then(res => res.json())
      .then(data => {
        if (data.offers && Array.isArray(data.offers)) {
          setOffers(data.offers.slice(0, 4));
        } else {
          setOffers([
            {
              offer_id: '1',
              name_short: 'Fast Verification',
              adcopy: 'Install & open app for 30s to unlock stream',
              picture: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&q=80',
              link: '#'
            },
            {
              offer_id: '2',
              name_short: 'Quick Survey',
              adcopy: 'Answer 3 questions to verify stream access',
              picture: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&q=80',
              link: '#'
            }
          ]);
        }
      })
      .catch(() => {
        setOffers([
          {
            offer_id: '1',
            name_short: 'Quick Verification',
            adcopy: 'Complete one free sponsor task below to continue',
            picture: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&q=80',
            link: '#'
          }
        ]);
      })
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}
      >
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(5, 7, 10, 0.88)',
            backdropFilter: 'blur(10px)'
          }}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '460px',
            backgroundColor: '#12141a',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
            zIndex: 1,
            color: '#fff'
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--text-muted, #717686)',
              fontSize: '1.2rem',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            ✕
          </button>

          {/* Header بدون Unlock Instant Streaming */}
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 6px 0', color: '#fff' }}>
              {movieTitle}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #9da2b4)', margin: 0, lineHeight: 1.4 }}>
              Complete any quick task below to start your HD stream immediately:
            </p>
          </div>

          {/* Offers List - كيضغط على العرض مباشرة */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {loading ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#717686', fontSize: '0.875rem' }}>
                Loading available tasks...
              </div>
            ) : (
              offers.map(offer => (
                <a
                  key={offer.offer_id}
                  href={offer.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    color: '#fff',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = 'rgba(229, 169, 59, 0.12)';
                    e.currentTarget.style.borderColor = 'rgba(229, 169, 59, 0.4)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  }}
                >
                  <img
                    src={offer.picture}
                    alt=""
                    style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
                      {offer.name_short}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #9da2b4)', marginTop: '2px' }}>
                      {offer.adcopy}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: 'var(--accent, #e5a93b)',
                      color: '#08090c',
                      padding: '4px 10px',
                      borderRadius: '6px'
                    }}
                  >
                    Open
                  </span>
                </a>
              ))
            )}
          </div>

          {/* Footer note */}
          <div
            style={{
              marginTop: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              color: 'var(--text-muted, #717686)'
            }}
          >
            <CheckIcon size={14} color="#22c55e" />
            <span>Stream unlocks automatically after completion</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};