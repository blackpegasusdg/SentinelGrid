import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Globe, Cpu, Monitor, Trash2, Edit2, ChevronRight, Copy, CheckCircle } from 'lucide-react';
import type { Asset, AssetCreate, AssetUpdate } from '@/types';
import { assets as assetApi, getApiError } from '@/services/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, VerificationBadge } from '@/components/ui/Badge';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Modal, ConfirmDialog } from '@/components/ui/Modal';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/EmptyState';
import { staggerContainer, fadeUp } from '@/animations';

const ASSET_TYPE_ICONS: Record<string, React.ElementType> = {
  domain:          Globe,
  ip_address:      Cpu,
  web_application: Monitor,
};

const ASSET_TYPE_OPTIONS = [
  { value: 'domain',          label: 'Domain' },
  { value: 'ip_address',      label: 'IP Address' },
  { value: 'web_application', label: 'Web Application' },
];

function AssetCard({ asset, onEdit, onDelete, onViewVerification }: {
  asset: Asset;
  onEdit: (a: Asset) => void;
  onDelete: (a: Asset) => void;
  onViewVerification: (a: Asset) => void;
}) {
  const Icon = ASSET_TYPE_ICONS[asset.asset_type] ?? Globe;
  const verified = asset.verified_at !== null;
  return (
    <Card tilt spotlight hover cursorLabel="VIEW" animate>
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-bg-secondary border border-border-default flex items-center justify-center">
              <Icon size={16} className="text-accent-cyan" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary font-inter truncate max-w-[180px]">{asset.name}</p>
              <p className="text-xs text-text-secondary font-mono truncate max-w-[180px]">{asset.value}</p>
            </div>
          </div>
          <VerificationBadge verified={verified} />
        </div>

        {asset.description && (
          <p className="text-xs text-text-secondary font-inter mb-3 line-clamp-2">{asset.description}</p>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-border-default">
          <Badge variant="default" className="text-xs font-mono">
            {asset.asset_type.replace('_', ' ').toUpperCase()}
          </Badge>
          <div className="flex items-center gap-1">
            {asset.asset_type !== 'ip_address' && !verified && (
              <button
                onClick={() => onViewVerification(asset)}
                className="text-xs text-accent-cyan hover:underline font-mono px-2 py-1 hover:bg-accent-cyan/8 rounded transition-colors"
              >
                Verify
              </button>
            )}
            <button onClick={() => onEdit(asset)} className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-white/4 rounded transition-colors">
              <Edit2 size={14} />
            </button>
            <button onClick={() => onDelete(asset)} className="p-1.5 text-text-secondary hover:text-critical hover:bg-critical/8 rounded transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function VerificationModal({ asset, open, onClose, onVerified }: {
  asset: Asset | null; open: boolean; onClose: () => void; onVerified: () => void;
}) {
  const [tokenData, setTokenData] = useState<{ record_name: string; record_value: string } | null>(null);
  const [loading,   setLoading]   = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error,     setError]     = useState('');
  const [copied,    setCopied]    = useState(false);
  const [success,   setSuccess]   = useState(false);

  useEffect(() => {
    if (!open) { setTokenData(null); setError(''); setSuccess(false); }
  }, [open]);

  if (!asset) return null;

  const generateToken = async () => {
    setLoading(true); setError('');
    try {
      const res = await assetApi.generateVerificationToken(asset.id);
      setTokenData({ record_name: res.record_name, record_value: res.record_value });
    } catch (e) { setError(getApiError(e)); }
    finally { setLoading(false); }
  };

  const verify = async () => {
    setVerifying(true); setError('');
    try {
      await assetApi.verifyOwnership(asset.id);
      setSuccess(true);
      setTimeout(() => { onVerified(); onClose(); }, 1500);
    } catch (e) { setError(getApiError(e)); }
    finally { setVerifying(false); }
  };

  const copyValue = () => {
    if (tokenData) { navigator.clipboard.writeText(tokenData.record_value); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  return (
    <Modal open={open} onClose={onClose} title="Verify Asset Ownership" size="lg">
      <div className="space-y-5">
        <p className="text-text-secondary text-sm font-inter">
          Add this DNS TXT record to verify ownership of <span className="font-mono text-accent-cyan">{asset.value}</span>.
        </p>

        {!tokenData ? (
          <Button variant="secondary" onClick={generateToken} loading={loading} className="w-full">
            Generate Verification Token
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="bg-bg-secondary rounded-xl border border-border-default p-4 space-y-3">
              <div>
                <p className="text-xs font-mono text-text-secondary uppercase tracking-widest mb-1">Record Name (TXT)</p>
                <code className="text-sm font-mono text-text-primary block break-all">{tokenData.record_name}</code>
              </div>
              <div className="border-t border-border-default pt-3">
                <p className="text-xs font-mono text-text-secondary uppercase tracking-widest mb-1">Record Value</p>
                <div className="flex items-start gap-2">
                  <code className="text-sm font-mono text-accent-cyan break-all flex-1">{tokenData.record_value}</code>
                  <button onClick={copyValue} className="flex-shrink-0 p-1.5 text-text-secondary hover:text-accent-cyan rounded transition-colors" title="Copy">
                    {copied ? <CheckCircle size={16} className="text-success" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>
            <p className="text-xs text-text-secondary font-inter">
              After adding the DNS record, it may take a few minutes to propagate. Then click Verify.
            </p>
            {error && <p className="text-critical text-sm bg-critical/10 border border-critical/20 rounded-lg px-4 py-3">{error}</p>}
            {success && <p className="text-success text-sm bg-success/10 border border-success/20 rounded-lg px-4 py-3">✓ Asset verified successfully!</p>}
            <Button variant="primary" onClick={verify} loading={verifying} className="w-full" iconRight={<CheckCircle size={16} />}>
              Verify Ownership
            </Button>
          </div>
        )}
        {error && !tokenData && <p className="text-critical text-sm">{error}</p>}
      </div>
    </Modal>
  );
}

function AssetFormModal({ open, onClose, onSaved, existing }: {
  open: boolean; onClose: () => void; onSaved: () => void; existing?: Asset;
}) {
  const [name,      setName]      = useState(existing?.name ?? '');
  const [assetType, setAssetType] = useState<AssetCreate['asset_type']>(existing?.asset_type ?? 'domain');
  const [value,     setValue]     = useState(existing?.value ?? '');
  const [desc,      setDesc]      = useState(existing?.description ?? '');
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  useEffect(() => {
    if (open) {
      setName(existing?.name ?? '');
      setAssetType(existing?.asset_type ?? 'domain');
      setValue(existing?.value ?? '');
      setDesc(existing?.description ?? '');
      setError('');
    }
  }, [open, existing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Name is required'); return; }
    if (!value.trim()) { setError('Asset value is required'); return; }
    setLoading(true); setError('');
    try {
      if (existing) {
        await assetApi.update(existing.id, { name, asset_type: assetType as AssetCreate['asset_type'], value, description: desc || null });
      } else {
        await assetApi.create({ name, asset_type: assetType as AssetCreate['asset_type'], value, description: desc });
      }
      onSaved();
      onClose();
    } catch (e) { setError(getApiError(e)); }
    finally { setLoading(false); }
  };

  return (
    <Modal open={open} onClose={onClose} title={existing ? 'Edit Asset' : 'Register New Asset'} size="md"
      footer={
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" loading={loading} onClick={handleSubmit}>
            {existing ? 'Save Changes' : 'Register Asset'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Asset Name" value={name} onChange={e => setName(e.target.value)} placeholder="Production API Gateway" />
        <Select
          label="Asset Type"
          value={assetType}
          onChange={e => setAssetType(e.target.value as AssetCreate['asset_type'])}
          options={ASSET_TYPE_OPTIONS}
        />
        <Input
          label="Asset Value"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder={assetType === 'domain' ? 'example.com' : assetType === 'ip_address' ? '192.168.1.1' : 'https://app.example.com'}
        />
        <Textarea label="Description (optional)" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Brief description of this asset…" rows={2} />
        {error && <p className="text-critical text-sm bg-critical/10 border border-critical/20 rounded-lg px-4 py-3">{error}</p>}
      </form>
    </Modal>
  );
}

export function AssetsPage() {
  const [assetList, setAssetList]   = useState<Asset[]>([]);
  const [loading,   setLoading]     = useState(true);
  const [error,     setError]       = useState('');
  const [search,    setSearch]      = useState('');
  const [filter,    setFilter]      = useState<string>('all');

  const [addOpen,   setAddOpen]     = useState(false);
  const [editAsset, setEditAsset]   = useState<Asset | undefined>();
  const [delAsset,  setDelAsset]    = useState<Asset | null>(null);
  const [delLoading, setDelLoading] = useState(false);
  const [verifyAsset, setVerifyAsset] = useState<Asset | null>(null);

  const load = async () => {
    setLoading(true); setError('');
    try { setAssetList(await assetApi.list()); }
    catch { setError('Failed to load assets. Is the backend running?'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    if (!delAsset) return;
    setDelLoading(true);
    try {
      await assetApi.delete(delAsset.id);
      setDelAsset(null);
      load();
    } catch (e) { setError(getApiError(e)); }
    finally { setDelLoading(false); }
  };

  const filtered = assetList.filter(a => {
    const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.value.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'verified' ? a.verified_at !== null : (filter === 'unverified' ? a.verified_at === null : a.asset_type === filter));
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8" variants={staggerContainer} initial="initial" animate="animate">
        <div>
          <motion.p variants={fadeUp} className="text-xs font-mono text-text-secondary uppercase tracking-widest mb-1">Asset Management</motion.p>
          <motion.h1 variants={fadeUp} className="font-space text-3xl font-bold text-text-primary">Digital Assets</motion.h1>
        </div>
        <motion.div variants={fadeUp}>
          <Button variant="primary" icon={<Plus size={16} />} onClick={() => setAddOpen(true)}>
            Register Asset
          </Button>
        </motion.div>
      </motion.div>

      {/* Filters */}
      <motion.div className="flex flex-col sm:flex-row gap-3 mb-6" variants={fadeUp} initial="initial" animate="animate">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search assets…"
            className="w-full bg-bg-secondary border border-border-default rounded-lg pl-9 pr-4 py-2.5 text-sm text-text-primary font-inter placeholder:text-text-muted focus:outline-none focus:border-accent-cyan transition-colors"
            style={{ cursor: 'text' }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all','domain','ip_address','web_application','verified','unverified'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-xs font-mono transition-all border ${filter === f ? 'border-accent-cyan/40 bg-accent-cyan/8 text-accent-cyan' : 'border-border-default text-text-secondary hover:text-text-primary hover:border-border-hover'}`}
            >
              {f.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </motion.div>

      {error && <ErrorState message={error} onRetry={load} />}
      {loading && !error && <LoadingState message="Loading assets…" />}

      {!loading && !error && (
        filtered.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {filtered.map(a => (
              <AssetCard
                key={a.id}
                asset={a}
                onEdit={a => setEditAsset(a)}
                onDelete={a => setDelAsset(a)}
                onViewVerification={a => setVerifyAsset(a)}
              />
            ))}
          </motion.div>
        ) : (
          <EmptyState
            icon={<Globe size={28} />}
            title={search ? "No assets match your search" : "No assets registered yet"}
            description={search ? "Try different keywords or clear the filter." : "Register your first domain, IP address, or web application to begin monitoring your attack surface."}
            action={!search ? { label: 'Register Your First Asset', onClick: () => setAddOpen(true) } : undefined}
          />
        )
      )}

      {/* Modals */}
      <AssetFormModal open={addOpen} onClose={() => setAddOpen(false)} onSaved={load} />
      <AssetFormModal open={!!editAsset} onClose={() => setEditAsset(undefined)} onSaved={() => { setEditAsset(undefined); load(); }} existing={editAsset} />
      <ConfirmDialog
        open={!!delAsset}
        onClose={() => setDelAsset(null)}
        onConfirm={handleDelete}
        loading={delLoading}
        title="Delete Asset"
        message={`Are you sure you want to delete "${delAsset?.name}"? This action cannot be undone.`}
        confirmLabel="Delete Asset"
      />
      <VerificationModal
        asset={verifyAsset}
        open={!!verifyAsset}
        onClose={() => setVerifyAsset(null)}
        onVerified={load}
      />
    </div>
  );
}
