import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Breadcrumb, Tag, Badge, Descriptions, Timeline, Button, Alert,
    Typography, Divider, Card, Space
} from 'antd';
import {
    ArrowLeftOutlined, CheckCircleOutlined, ExclamationCircleOutlined,
    ClockCircleOutlined, WarningOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const mockDetail: Record<string, any> = {
    '1': {
        id: 'INC-001', title: 'Auth Service Unreachable',
        severity: 'critical', status: 'resolved',
        monitor: 'Auth Service', affectedUrl: 'auth.guard.com',
        startedAt: '2026-03-23 08:14:00', resolvedAt: '2026-03-23 08:42:00',
        duration: '28m',
        description: 'The authentication service became unreachable due to a network misconfiguration during a rolling deployment. All login requests returned 503.',
        timeline: [
            { time: '08:14:00', type: 'error', label: 'Incident Detected', body: 'Monitor reported HTTP 503 from auth.guard.com.' },
            { time: '08:18:00', type: 'warning', label: 'Alert Triggered', body: 'On-call engineer notified via email and Slack.' },
            { time: '08:25:00', type: 'info', label: 'Investigation Started', body: 'Engineer identified a misconfigured Nginx upstream during deployment.' },
            { time: '08:39:00', type: 'success', label: 'Fix Applied', body: 'Nginx config corrected and service redeployed.' },
            { time: '08:42:00', type: 'success', label: 'Resolved', body: 'Monitor confirmed service back online. 100% uptime restored.' },
        ],
        affectedServices: ['Login API', 'Token Refresh', 'Session Service'],
    },
    '2': {
        id: 'INC-002', title: 'Payment Gateway Timeout',
        severity: 'high', status: 'investigating',
        monitor: 'Payment Gateway', affectedUrl: 'stripe.external.api',
        startedAt: '2026-03-23 11:55:00', resolvedAt: null,
        duration: '2h 14m',
        description: 'The payment gateway is intermittently timing out. Transactions are failing for ~30% of users. Root cause under investigation.',
        timeline: [
            { time: '11:55:00', type: 'error', label: 'Incident Detected', body: 'Response time exceeded 5000ms threshold for payment gateway.' },
            { time: '12:02:00', type: 'warning', label: 'Alert Triggered', body: 'Critical alert sent to payments team.' },
            { time: '12:15:00', type: 'info', label: 'Investigation Started', body: 'Payments team reviewing Stripe API logs and dashboards.' },
        ],
        affectedServices: ['Checkout API', 'Subscription Service'],
    },
};

const severityColor: Record<string, string> = {
    critical: 'red', high: 'orange', medium: 'yellow', low: 'blue',
};

const statusConfig: Record<string, { status: 'error' | 'warning' | 'success'; label: string }> = {
    open: { status: 'error', label: 'Open' },
    investigating: { status: 'warning', label: 'Investigating' },
    resolved: { status: 'success', label: 'Resolved' },
};

const timelineIcons: Record<string, React.ReactNode> = {
    success: <CheckCircleOutlined className="text-green-500" />,
    error: <ExclamationCircleOutlined className="text-red-500" />,
    warning: <WarningOutlined className="text-orange-500" />,
    info: <ClockCircleOutlined className="text-blue-500" />,
};

export default function IncidentDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const incident = id ? mockDetail[id] : null;

    if (!incident) {
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

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb
                items={[
                    { title: <span onClick={() => navigate('/incidents')} className="cursor-pointer">Incidents</span> },
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
                        <Tag color={severityColor[incident.severity]} className="uppercase font-bold text-xs">
                            {incident.severity}
                        </Tag>
                        <Badge
                            status={statusConfig[incident.status]?.status}
                            text={<span className="font-semibold">{statusConfig[incident.status]?.label}</span>}
                        />
                    </div>
                    <Title level={3} className="!mb-1">{incident.title}</Title>
                    <Text type="secondary">{incident.affectedUrl}</Text>
                </div>

                {incident.status !== 'resolved' && (
                    <Space>
                        <Button type="primary" danger>Mark as Resolved</Button>
                        <Button>Acknowledge</Button>
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
                    <Card title="Incident Details" className="rounded-xl shadow-sm border-gray-100">
                        <Descriptions column={2} bordered size="small">
                            <Descriptions.Item label="Monitor">{incident.monitor}</Descriptions.Item>
                            <Descriptions.Item label="Affected URL">{incident.affectedUrl}</Descriptions.Item>
                            <Descriptions.Item label="Started At">{incident.startedAt}</Descriptions.Item>
                            <Descriptions.Item label="Resolved At">{incident.resolvedAt ?? '—'}</Descriptions.Item>
                            <Descriptions.Item label="Duration" span={2}>{incident.duration}</Descriptions.Item>
                        </Descriptions>

                        <Divider />

                        <div>
                            <Text strong className="block mb-2">Description</Text>
                            <Paragraph className="text-gray-600 text-sm">{incident.description}</Paragraph>
                        </div>

                        <Divider />

                        <div>
                            <Text strong className="block mb-3">Affected Services</Text>
                            <Space wrap>
                                {incident.affectedServices.map((svc: string) => (
                                    <Tag key={svc} color="blue">{svc}</Tag>
                                ))}
                            </Space>
                        </div>
                    </Card>
                </div>

                {/* Timeline */}
                <div>
                    <Card title="Timeline" className="rounded-xl shadow-sm border-gray-100">
                        <Timeline
                            items={incident.timeline.map((t: any) => ({
                                dot: timelineIcons[t.type],
                                children: (
                                    <div>
                                        <Text className="font-mono text-xs text-gray-400">{t.time}</Text>
                                        <Text strong className="block text-sm">{t.label}</Text>
                                        <Text type="secondary" className="text-xs">{t.body}</Text>
                                    </div>
                                ),
                            }))}
                        />
                    </Card>
                </div>
            </div>
        </div>
    );
}
