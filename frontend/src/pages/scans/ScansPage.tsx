import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Scan as ScanIcon, Globe, Cpu, Monitor, ChevronDown } from 'lucide-react';
import type { Scan, Asset, ScanCreate } from '@/types';
import { scans as scanApi, assets as assetApi, getApiError } from '@/services/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ScanStatusBadge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/EmptyState';
import { staggerContainer, fadeUp } from '@/animations';

const SCAN_TYPES = [
  { value: 'asset_inventory',         label: 'Asset Inventory' },
  { value: 'tls_configuration',       label: 'TLS Configuration' },
  { value: 'http_security_headers',   label: 'HTTP Security Headers' },
];

const ASSET_ICONS: Record<string, React.ElementType> = {
  domain: Globe, ip_address: Cpu, web_application: Monitor,
};

function RequestScanModal({ open, onClose, onCreated }: {
  open: boolean; onClose: () => void; onCreated: () => void;
}) {
  const [assetList, setAssetList] = useState<Asset[]>([]);
  const [assetId,   setAssetId]   = useState('');
  const [scanType,  setScanType]  = useState('asset_inventory');
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  useEffect(() => {
    if (open) {
      assetApi.list().then(list => {
        const eligible = list.filter(a => a.verified_at !== null && a.asset_type !== 'ip_address');
        setAssetList(eligible);
        if (eligible.length > 0) setAssetId(String(eligible[0].id));
      });
    }
  }, [open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetId) { setError('Select an asset'); return; }
    setLoading(true); setError('');
    try {
      await scanApi.create({ asset_id: parseInt(assetId), scan_type: scanType as ScanCreate['scan_type'] });
      onCreated(); onClose();
    } catch (e) { setError(getApiError(e)); }
    finally { setLoading(false); }
  };

  return (
    <Modal open={open} onClose={onClose} title="Request Security Scan" size="md"
      footer={
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" loading={loading} onClick={submit}>Request Scan</Button>
        </div>
      }
    >
      <div className="space-y-5">
        {assetList.length === 0 ? (
          <div className="bg-warning/8 border border-warning/20 rounded-xl p-4 text-sm text-warning font-inter">
            ⚠ No verified assets available. Only verified domains and web applications can be scanned.
            Verify an asset first from the Assets page.
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <Select
              label="Target Asset (verified only)"
              value={assetId}
              onChange={e => setAssetId(e.target.value)}
              options={assetList.map(a => ({ value: String(a.id), label: `${a.name} (${a.value})` }))}
            />
            <Select
              label="Scan Type"
              value={scanType}
              onChange={e => setScanType(e.target.value)}
              options={SCAN_TYPES}
            />
            <div className="bg-bg-secondary rounded-xl border border-border-default p-4 text-xs font-mono text-text-secondary">
              <p className="text-text-primary font-semibold mb-1">Scan Scope</p>
              <p>Single registered asset only. No subdomain expansion or out-of-scope targets.</p>
            </div>
            {error && <p className="text-critical text-sm bg-critical/10 border border-critical/20 rounded-lg px-4 py-3">{error}</p>}
          </form>
        )}
      </div>
    </Modal>
  );
}

export function ScansPage() {
  const [scanList, setScanList] = useState<Scan[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [reqOpen,  setReqOpen]  = useState(false);

  const load = async () => {
    setLoading(true); setError('');
    try { setScanList(await scanApi.list()); }
    catch { setError('Failed to load scans.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <motion.div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8" variants={staggerContainer} initial="initial" animate="animate">
        <div>
          <motion.p variants={fadeUp} className="text-xs font-mono text-text-secondary uppercase tracking-widest mb-1">Security Operations</motion.p>
          <motion.h1 variants={fadeUp} className="font-space text-3xl font-bold text-text-primary">Scan History</motion.h1>
        </div>
        <motion.div variants={fadeUp}>
          <Button variant="primary" icon={<Plus size={16} />} onClick={() => setReqOpen(true)}>
            Request Scan
          </Button>
        </motion.div>
      </motion.div>

      {error && <ErrorState message={error} onRetry={load} />}
      {loading && !error && <LoadingState message="Loading scan history…" />}

      {!loading && !error && scanList.length === 0 && (
        <EmptyState
          icon={<ScanIcon size={28} />}
          title="No scans requested yet"
          description="Request your first security assessment. Only verified assets are eligible for scanning."
          action={{ label: 'Request a Scan', onClick: () => setReqOpen(true) }}
        />
      )}

      {!loading && !error && scanList.length > 0 && (
        <Card animate>
          <div className="divide-y divide-border-default">
            {scanList.map((scan, i) => (
              <motion.div
                key={scan.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:bg-bg-card-hover transition-colors"
                variants={fadeUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-lg bg-bg-secondary border border-border-default flex items-center justify-center flex-shrink-0">
                    <ScanIcon size={16} className="text-accent-cyan" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary font-inter">
                      {scan.scan_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                    <p className="text-xs font-mono text-text-secondary mt-0.5">
                      Asset ID: {scan.asset_id} · Scan #{scan.id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-xs text-text-secondary font-mono sm:text-right">
                  <div>
                    <p className="mb-0.5">Requested</p>
                    <p className="text-text-primary">{new Date(scan.requested_at).toLocaleString()}</p>
                  </div>
                  <ScanStatusBadge status={scan.status} />
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Intelligence coming-soon panel */}
      <motion.div
        className="mt-8 bg-bg-secondary border border-border-default rounded-2xl p-8 text-center"
        variants={fadeUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-blue/8 border border-accent-blue/20 text-accent-blue text-xs font-mono tracking-widest uppercase mb-5">
          Planned Feature
        </div>
        <h3 className="font-space text-xl font-semibold text-text-primary mb-3">
          Vulnerability Findings &amp; Risk Scores
        </h3>
        <p className="text-text-secondary text-sm font-inter max-w-md mx-auto mb-5">
          Detailed vulnerability findings, CVE lookup, severity scoring, and risk timelines are on
          the product roadmap. The backend scan engine is currently being developed.
        </p>
        <div className="inline-flex flex-wrap gap-2 justify-center">
          {['CVE Intelligence', 'CVSS Scoring', 'Risk Timeline', 'Threat Attribution', 'Remediation Guidance'].map(f => (
            <span key={f} className="px-3 py-1 rounded-full text-xs font-mono text-text-secondary border border-border-default">
              {f}
            </span>
          ))}
        </div>
      </motion.div>

      <RequestScanModal open={reqOpen} onClose={() => setReqOpen(false)} onCreated={load} />
    </div>
  );
}
