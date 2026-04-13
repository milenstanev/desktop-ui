import React, { useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppDispatch } from '~/core/hooks';
import { addWindow } from '~/features/Desktop/DesktopSlice';
import {
  loadRemoteFeature,
  getAvailableRemotes,
} from '~/app-shell/loadRemoteFeature';
import { hasFeature } from '~/core/feature-registry';
import styles from './MicroFrontendDemo.module.css';

const MicroFrontendDemo: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const remotes = getAvailableRemotes();
  const analyticsLoaded = hasFeature('analytics');

  const handleLoadAnalytics = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const feature = await loadRemoteFeature('analytics');
      const id = uuidv4();
      dispatch(
        addWindow({
          id,
          name: feature.displayName,
          remoteFeatureName: 'analytics',
          layout: undefined,
          lazyLoadReducerName: feature.reducer?.name,
        })
      );
      setExpanded(false);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'Failed to load Analytics remote'
      );
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  return (
    <div className={styles.panel}>
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-label="Micro-frontend architecture demo"
      >
        <BarChart3 size={16} />
        <span>Architecture</span>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {expanded && (
        <div className={styles.content}>
          <p className={styles.description}>
            <strong>Local features</strong> → loaded from monolith (Counter,
            Notes, Timer…). <strong>Remote features</strong> → loaded via Module
            Federation at runtime.
          </p>
          <div className={styles.actions}>
            {remotes.includes('analytics') && (
              <button
                type="button"
                onClick={handleLoadAnalytics}
                disabled={loading}
                className={styles.loadButton}
              >
                {loading ? 'Loading…' : 'Load Analytics Feature'}
              </button>
            )}
          </div>
          {error && <p className={styles.error}>{error}</p>}
          {analyticsLoaded && (
            <p className={styles.success}>Analytics remote loaded.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MicroFrontendDemo;
