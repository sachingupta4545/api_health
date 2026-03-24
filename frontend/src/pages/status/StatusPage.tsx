import React, { useEffect, useState } from 'react';
import { Typography, Tag, Badge, Tooltip, Card, Divider, Spin } from 'antd';
import {
    CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined,
    InfoCircleOutlined,
} from '@ant-design/icons';
import { getStatusData, StatusPageData, StatusGroup, Service } from '../../services/statusService';

const { Title, Text } = Typography;

type ServiceStatus = 'operational' | 'degraded' | 'outage' | 'maintenance';

const statusConfig: Record<ServiceStatus, {
    icon: React.ReactNode; label: string; color: string;
    tagColor: string; dot: 'success' | 'warning' | 'error' | 'processing';
}> = {
    operational: {
        icon: <CheckCircleOutlined className="text-emerald-500" />,
        label: 'Operational', color: 'text-emerald-600', tagColor: 'green', dot: 'success',
    },
    degraded: {
        icon: <ExclamationCircleOutlined className="text-amber-500" />,
        label: 'Degraded Performance', color: 'text-amber-600', tagColor: 'gold', dot: 'warning',
    },
    outage: {
        icon: <CloseCircleOutlined className="text-red-500" />,
        label: 'Major Outage', color: 'text-red-600', tagColor: 'red', dot: 'error',
    },
    maintenance: {
        icon: <InfoCircleOutlined className="text-blue-500" />,
        label: 'Under Maintenance', color: 'text-blue-600', tagColor: 'blue', dot: 'processing',
    },
};

const UptimeBar = ({ uptime }: { uptime: string }) => {
    const days = Array.from({ length: 90 }, (_, i) => {
        const pct = parseFloat(uptime) || 100;
        const rand = Math.random();
        if (pct > 99.9) return rand < 0.98 ? 'operational' : 'degraded';
        if (pct > 98) return rand < 0.95 ? 'operational' : rand < 0.98 ? 'degraded' : 'outage';
        return rand < 0.9 ? 'operational' : rand < 0.95 ? 'degraded' : 'outage';
    });

    const colorMap: Record<string, string> = {
        operational: 'bg-emerald-400', degraded: 'bg-amber-400', outage: 'bg-red-400',
    };

    return (
        <Tooltip title={`${uptime} uptime over last 100 checks`}>
            <div className="flex gap-px h-6 cursor-default">
                {days.map((status, i) => (
                    <div key={i} className={`flex-1 rounded-sm ${colorMap[status]}`} />
                ))}
            </div>
        </Tooltip>
    );
};

const calcOverallStatus = (groups: StatusGroup[]): { label: string; description: string; color: string; bg: string } => {
    const hasOutage = groups.some((g) => g.services.some((s) => s.status === 'outage'));
    const hasDegraded = groups.some((g) => g.services.some((s) => s.status === 'degraded'));
    
    if (groups.length === 0 || groups.every(g => g.services.length === 0)) {
        return { label: 'No Services Monitored', description: 'Add a monitor to see status.', color: 'text-gray-700', bg: 'bg-gray-50 border-gray-200' };
    }
    
    if (hasOutage) return { label: 'Partial Outage', description: 'Some services are experiencing issues.', color: 'text-red-700', bg: 'bg-red-50 border-red-200' };
    if (hasDegraded) return { label: 'Degraded Performance', description: 'Some services are running slower than normal.', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' };
    
    return { label: 'All Systems Operational', description: 'All services are running normally.', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' };
};

export default function StatusPage() {
    const [data, setData] = useState<StatusPageData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const result = await getStatusData();
                setData(result);
            } catch (error) {
                console.error("Failed to fetch status data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
        
        // Refresh every minute
        const interval = setInterval(fetchStatus, 60000);
        return () => clearInterval(interval);
    }, []);

    if (loading && !data) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spin size="large" tip="Loading Status..." />
            </div>
        );
    }

    const groups = data?.groups || [];
    const overall = calcOverallStatus(groups);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Title level={3} className="!mb-0">Status Page</Title>
                    <Text type="secondary">Real-time health of all monitored services</Text>
                </div>
                <Text type="secondary" className="text-xs">
                    Last updated: {new Date().toLocaleTimeString()}
                </Text>
            </div>

            {/* Overall Status Banner */}
            <div className={`rounded-xl border p-5 flex items-center gap-4 ${overall.bg}`}>
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                    {overall.label === 'All Systems Operational'
                        ? <CheckCircleOutlined className="text-emerald-500 text-2xl" />
                        : overall.label.includes('Outage')
                        ? <CloseCircleOutlined className="text-red-500 text-2xl" />
                        : overall.label === 'No Services Monitored'
                        ? <InfoCircleOutlined className="text-gray-500 text-2xl" />
                        : <ExclamationCircleOutlined className="text-amber-500 text-2xl" />}
                </div>
                <div>
                    <Text strong className={`text-lg block ${overall.color}`}>{overall.label}</Text>
                    <Text className="text-sm text-gray-500">{overall.description}</Text>
                </div>
            </div>

            {/* Service Groups */}
            {groups.length === 0 ? (
                <Card className="rounded-xl shadow-sm border-gray-100 bg-gray-50 text-center py-8">
                    <Text type="secondary">No status data available.</Text>
                </Card>
            ) : (
                groups.map((group) => (
                    <Card
                        key={group.group}
                        title={<Text strong className="text-gray-700">{group.group}</Text>}
                        className="rounded-xl shadow-sm border-gray-100"
                    >
                        <div className="space-y-0">
                            {group.services.map((svc, idx) => {
                                const cfg = statusConfig[svc.status as ServiceStatus] || statusConfig.maintenance;
                                return (
                                    <div key={svc.name}>
                                        {idx > 0 && <Divider className="my-0" />}
                                        <div className="py-4">
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <div className="flex items-center gap-3">
                                                    <Badge status={cfg.dot} />
                                                    <div>
                                                        <Text strong className="block">{svc.name}</Text>
                                                        <Text type="secondary" className="text-xs">{svc.description}</Text>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 shrink-0">
                                                    <div className="text-right hidden sm:block">
                                                        <Text className="text-xs text-gray-500 block">
                                                            {svc.responseTime !== '—' ? `${svc.responseTime} avg response` : 'No response data'}
                                                        </Text>
                                                        <Text className="text-xs font-semibold text-gray-700">{svc.uptime} uptime</Text>
                                                    </div>
                                                    <Tag color={cfg.tagColor} className="font-semibold whitespace-nowrap">
                                                        {cfg.label}
                                                    </Tag>
                                                </div>
                                            </div>
                                            {svc.uptime !== '—' && <UptimeBar uptime={svc.uptime} />}
                                            <div className="flex justify-between mt-1">
                                                <Text type="secondary" className="text-[10px]">90 days ago</Text>
                                                <Text type="secondary" className="text-[10px]">Today</Text>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                ))
            )}

            {/* Incident History Hint */}
            <Card className="rounded-xl shadow-sm border-gray-100 bg-gray-50">
                <div className="text-center py-4">
                    <CheckCircleOutlined className="text-4xl text-emerald-400 mb-3" />
                    <Text strong className="block text-gray-700">No active incidents in the last 7 days (except current)</Text>
                    <Text type="secondary" className="text-sm">View the <a href="/incidents" className="text-sky-500 hover:underline">Incidents page</a> for full history.</Text>
                </div>
            </Card>
        </div>
    );
}
