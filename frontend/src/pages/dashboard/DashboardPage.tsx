import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Server, Shield, Scan, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { assets, scans } from '@/services/api';
import type { Asset, Scan as ScanType } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Badge, ScanStatusBadge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { LoadingState, ErrorState } from '@/components/ui/EmptyState';
import { staggerContainer, fadeUp } from '@/animations';
import { Link } from 'react-router-dom';

const ASSET_COLORS: Record<string, string> = {
  domain:          '#35D6E8',
  ip_address:      '#638CFF',
  web_application: '#10B981',
};

function StatCard({ icon: Icon, label, value, sub, accent }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; accent?: string;
}) {
  return (
    <Card tilt spotlight animate>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-10 h-10 rounded-xl bg-bg-secondary border border-border-default flex items-center justify-center`}>
            <Icon size={18} className={accent ?? 'text-accent-cyan'} />
          </div>
        </div>
        <div className={`font-mono text-3xl font-bold mb-1 ${accent ?? 'text-accent-cyan'}`}>
          {value}
        </div>
        <div className="text-sm text-text-primary font-inter font-medium">{label}</div>
        {sub && <div className="text-xs text-text-secondary mt-0.5 font-inter">{sub}</div>}
      </div>
    </Card>
  );
}

export function DashboardPage() {
  const { user } = useAuth();
  const [assetList, setAssetList] = useState<Asset[]>([]);
  const [scanList,  setScanList]  = useState<ScanType[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [a, s] = await Promise.all([assets.list(), scans.list()]);
      setAssetList(a);
      setScanList(s);
    } catch (e) {
      setError('Failed to load dashboard data. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const verified  = assetList.filter(a => a.verified_at !== null).length;
  const unverified = assetList.length - verified;
  const pending    = scanList.filter(s => s.status === 'pending').length;

  // Pie chart data for asset types
  const typeCounts = assetList.reduce<Record<string, number>>((acc, a) => {
    acc[a.asset_type] = (acc[a.asset_type] ?? 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(typeCounts).map(([type, count]) => ({ name: type, value: count }));

  if (loading) return (
    <div className="p-8">
      <LoadingState message="Loading dashboard data…" />
    </div>
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Page header */}
      <motion.div
        className="mb-8"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.p variants={fadeUp} className="text-xs font-mono text-text-secondary uppercase tracking-widest mb-1">
          Welcome back
        </motion.p>
        <motion.h1 variants={fadeUp} className="font-space text-3xl font-bold text-text-primary">
          {user?.name ?? 'Dashboard'}
        </motion.h1>
        <motion.p variants={fadeUp} className="text-text-secondary text-sm font-inter mt-1">
          Tenant ID: <span className="font-mono text-accent-cyan">{user?.tenant_id}</span>
        </motion.p>
      </motion.div>

      {error && (
        <ErrorState message={error} onRetry={load} />
      )}

      {!error && (
        <>
          {/* Stats grid */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <StatCard icon={Server}       label="Total Assets"        value={assetList.length} sub="Registered" />
            <StatCard icon={CheckCircle2} label="Verified Assets"     value={verified} accent="text-success" sub="DNS verified" />
            <StatCard icon={Clock}        label="Awaiting Verification" value={unverified} accent="text-warning" sub="Needs DNS record" />
            <StatCard icon={Scan}         label="Total Scans"         value={scanList.length} sub={`${pending} pending`} />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Asset type distribution */}
            <Card animate className="lg:col-span-1">
              <div className="p-6">
                <h3 className="font-space text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Shield size={16} className="text-accent-cyan" />
                  Asset Distribution
                </h3>
                {pieData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieData.map((entry) => (
                            <Cell key={entry.name} fill={ASSET_COLORS[entry.name] ?? '#6B7A99'} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ background: '#141B25', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12, fontFamily: 'JetBrains Mono' }}
                          labelStyle={{ color: '#E8EDF5' }}
                          itemStyle={{ color: '#6B7A99' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2 mt-2">
                      {pieData.map(d => (
                        <div key={d.name} className="flex items-center justify-between text-xs font-mono">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: ASSET_COLORS[d.name] ?? '#6B7A99' }} />
                            <span className="text-text-secondary capitalize">{d.name.replace('_', ' ')}</span>
                          </div>
                          <span className="text-text-primary font-semibold">{d.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-text-secondary">
                    <Server size={28} className="mb-3 opacity-30" />
                    <p className="text-xs font-inter">No assets registered yet</p>
                    <Link to="/assets" className="text-accent-cyan text-xs mt-2 hover:underline">Add your first asset →</Link>
                  </div>
                )}
              </div>
            </Card>

            {/* Recent scans */}
            <Card animate className="lg:col-span-2">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-space text-base font-semibold text-text-primary flex items-center gap-2">
                    <TrendingUp size={16} className="text-accent-cyan" />
                    Recent Scans
                  </h3>
                  <Link to="/scans" className="text-xs text-accent-cyan hover:underline font-mono">View all →</Link>
                </div>
                {scanList.length > 0 ? (
                  <div className="space-y-3">
                    {scanList.slice(0, 6).map(scan => (
                      <div key={scan.id} className="flex items-center justify-between py-2.5 border-b border-border-default last:border-0">
                        <div>
                          <p className="text-sm text-text-primary font-inter">
                            {scan.scan_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </p>
                          <p className="text-xs text-text-secondary font-mono mt-0.5">
                            {new Date(scan.requested_at).toLocaleString()}
                          </p>
                        </div>
                        <ScanStatusBadge status={scan.status} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-text-secondary">
                    <Scan size={28} className="mb-3 opacity-30" />
                    <p className="text-xs font-inter">No scans requested yet</p>
                    <Link to="/scans" className="text-accent-cyan text-xs mt-2 hover:underline">Request a scan →</Link>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
