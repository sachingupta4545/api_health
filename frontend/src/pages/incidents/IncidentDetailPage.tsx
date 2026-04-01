import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Breadcrumb, Tag, Badge, Descriptions, Timeline, Button, Alert,
    Typography, Divider, Card, Space, Skeleton, message, Empty,
} from 'antd';
import {
    ArrowLeftOutlined, CheckCircleOutlined, ExclamationCircleOutlined,
    ClockCircleOutlined, WarningOutlined, ReloadOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { getIncidentById, updateIncident, Incident, TimelineEvent } from '../../services/incidentService';

const { Title, Text, Paragraph } = Typography;

const severityColor: Record<string, string> = {
    critical: 'red',
    high: 'orange',
    medium: 'yellow',
    low: 'blue',
};

const statusConfig: Record<string, { status: 'error' | 'warning' | 'success' | 'default'; label: string }> = {
    open: { status: 'error', label: 'Open' },
    investigating: { status: 'warning', label: 'Investigating' },
    resolved: { status: 'success', label: 'Resolved' },
};

const timelineIcons: Record<string, React.ReactNode> = {
    success: <CheckCircleOutlined style={{ color: '#22c55e' }} />,
    error: <ExclamationCircleOutlined style={{ color: '#ef4444' }} />,
    warning: <WarningOutlined style={{ color: '#f97316' }} />,
    info: <ClockCircleOutlined style={{ color: '#3b82f6' }} />,
};

const calculateDuration = (startedAt: string, resolvedAt: string | null): string => {
    const start = dayjs(startedAt);
    const end = resolvedAt ? dayjs(resolvedAt) : dayjs();
    const diffMinutes = end.diff(start, 'minute');
    if (diffMinutes < 60) return `${diffMinutes}m`;
    const hours = Math.floor(diffMinutes / 60);
    const mins = diffMinutes % 60;
    return `${hours}h ${mins}m`;
};

export default function IncidentDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [incident, setIncident] = useState<Incident | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<'resolve' | 'acknowledge' | null>(null);
    const [notFound, setNotFound] = useState(false);

    const fetchIncident = useCallback(async () => {
        if (!id) return;
        try {
            setLoading(true);
            setError(null);
            setNotFound(false);
            const response = await getIncidentById(id);
            setIncident(response.incident);
        } catch (err: any) {
            if (err.response?.status === 404) {
                setNotFound(true);
            } else {
                setError(err.response?.data?.message || 'Failed to load incident details.');
            }
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchIncident();
    }, [fetchIncident]);

    const handleStatusUpdate = async (newStatus: 'resolved' | 'investigating') => {
        if (!incident) return;
        const actionKey = newStatus === 'resolved' ? 'resolve' : 'acknowledge';
        try {
            setActionLoading(actionKey);
            const response = await updateIncident(incident._id, { status: newStatus });
            setIncident(response.incident);
            message.success(
                newStatus === 'resolved'
                    ? 'Incident marked as resolved.'
                    : 'Incident acknowledged — status set to Investigating.'
            );
        } catch (err: any) {
            message.error(err.response?.data?.message || 'Failed to update incident status.');
        } finally {
            setActionLoading(null);
        }
    };

    /* ── Not found ── */
    if (!loading && notFound) {
        return (
            <div className="space-y-4">
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/incidents')}>
                    Back to Incidents
                </Button>
                <Alert
                    type="error"
                    showIcon
                    message="Incident Not Found"
                    description={`No incident found with ID "${id}". It may have been deleted or the ID is incorrect.`}
                    action={
                        <Button size="small" onClick={() => navigate('/incidents')}>
                            View All Incidents
                        </Button>
                    }
                />
            </div>
        );
    }

    /* ── Error state ── */
    if (!loading && error) {
        return (
            <div className="space-y-4">
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/incidents')}>
                    Back to Incidents
                </Button>
                <Alert
                    type="error"
                    showIcon
                    message="Failed to Load Incident"
                    description={error}
                    action={
                        <Button size="small" icon={<ReloadOutlined />} onClick={fetchIncident}>
                            Retry
                        </Button>
                    }
                />
            </div>
        );
    }

    /* ── Loading skeleton ── */
    if (loading || !incident) {
        return (
            <div className="space-y-6">
                <Skeleton.Input active style={{ width: 240, height: 20 }} />
                <Skeleton active paragraph={{ rows: 2 }} />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card>
                            <Skeleton active paragraph={{ rows: 6 }} />
                        </Card>
                    </div>
                    <Card>
                        <Skeleton active paragraph={{ rows: 8 }} />
                    </Card>
                </div>
            </div>
        );
    }

    const duration = calculateDuration(incident.startedAt, incident.resolvedAt);
    const timeline: TimelineEvent[] = incident.timeline ?? [];
    const affectedServices: string[] = incident.affectedServices ?? [];

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb
                items={[
                    {
                        title: (
                            <span
                                onClick={() => navigate('/incidents')}
                                className="cursor-pointer"
                            >
                                Incidents
                            </span>
                        ),
                    },
                    { title: incident.id },
                ]}
            />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <Button
                            icon={<ArrowLeftOutlined />}
                            size="small"
                            onClick={() => navigate('/incidents')}
                        />
                        <Text className="font-mono text-sm text-gray-500">{incident.id}</Text>
                        <Tag
                            color={severityColor[incident.severity]}
                            className="uppercase font-bold text-xs"
                        >
                            {incident.severity}
                        </Tag>
                        <Badge
                            status={statusConfig[incident.status]?.status ?? 'default'}
                            text={
                                <span className="font-semibold">
                                    {statusConfig[incident.status]?.label ?? incident.status}
                                </span>
                            }
                        />
                    </div>
                    <Title level={3} className="!mb-1">
                        {incident.title}
                    </Title>
                    <Text type="secondary">{incident.affectedUrl}</Text>
                </div>

                {incident.status !== 'resolved' && (
                    <Space>
                        <Button
                            type="primary"
                            danger
                            loading={actionLoading === 'resolve'}
                            onClick={() => handleStatusUpdate('resolved')}
                        >
                            Mark as Resolved
                        </Button>
                        {incident.status === 'open' && (
                            <Button
                                loading={actionLoading === 'acknowledge'}
                                onClick={() => handleStatusUpdate('investigating')}
                            >
                                Acknowledge
                            </Button>
                        )}
                    </Space>
                )}
            </div>

            {/* Active Incident Warning */}
            {incident.status !== 'resolved' && (
                <Alert
                    type="warning"
                    showIcon
                    message="This incident is currently active"
                    description="Service disruption is ongoing. Engineers are actively investigating."
                    banner
                />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Details Card */}
                <div className="lg:col-span-2 space-y-6">
                    <Card
                        title="Incident Details"
                        className="rounded-xl shadow-sm border-gray-100"
                        extra={
                            <Button
                                size="small"
                                icon={<ReloadOutlined />}
                                onClick={fetchIncident}
                                loading={loading}
                            >
                                Refresh
                            </Button>
                        }
                    >
                        <Descriptions column={2} bordered size="small">
                            <Descriptions.Item label="Incident ID">
                                <Text className="font-mono">{incident.id}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Monitor">
                                {incident.monitorId?.name ?? '—'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Affected URL">
                                {incident.affectedUrl || '—'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Severity">
                                <Tag
                                    color={severityColor[incident.severity]}
                                    className="uppercase font-semibold text-xs"
                                >
                                    {incident.severity}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Started At">
                                {dayjs(incident.startedAt).format('YYYY-MM-DD HH:mm:ss')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Resolved At">
                                {incident.resolvedAt
                                    ? dayjs(incident.resolvedAt).format('YYYY-MM-DD HH:mm:ss')
                                    : '—'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Duration" span={2}>
                                <Text className="font-mono">{duration}</Text>
                            </Descriptions.Item>
                        </Descriptions>

                        {incident.description && (
                            <>
                                <Divider />
                                <div>
                                    <Text strong className="block mb-2">
                                        Description
                                    </Text>
                                    <Paragraph className="text-gray-600 text-sm !mb-0">
                                        {incident.description}
                                    </Paragraph>
                                </div>
                            </>
                        )}

                        {affectedServices.length > 0 && (
                            <>
                                <Divider />
                                <div>
                                    <Text strong className="block mb-3">
                                        Affected Services
                                    </Text>
                                    <Space wrap>
                                        {affectedServices.map((svc) => (
                                            <Tag key={svc} color="blue">
                                                {svc}
                                            </Tag>
                                        ))}
                                    </Space>
                                </div>
                            </>
                        )}
                    </Card>
                </div>

                {/* Timeline */}
                <div>
                    <Card title="Timeline" className="rounded-xl shadow-sm border-gray-100">
                        {timeline.length === 0 ? (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="No timeline events recorded yet."
                            />
                        ) : (
                            <Timeline
                                items={timeline.map((t: TimelineEvent) => ({
                                    dot: timelineIcons[t.type] ?? timelineIcons.info,
                                    children: (
                                        <div>
                                            <Text className="font-mono text-xs text-gray-400">
                                                {t.time}
                                            </Text>
                                            <Text strong className="block text-sm">
                                                {t.label}
                                            </Text>
                                            <Text type="secondary" className="text-xs">
                                                {t.body}
                                            </Text>
                                        </div>
                                    ),
                                }))}
                            />
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
