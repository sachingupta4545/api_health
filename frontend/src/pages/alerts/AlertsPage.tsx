import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table, Tag, Button, Switch, Space, Tooltip, Typography,
    Empty, Alert, Badge, Popconfirm, message
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, BellOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

type AlertChannel = 'email' | 'slack' | 'webhook' | 'pagerduty';
type AlertCondition = 'down' | 'slow' | 'ssl_expiry' | 'status_code';

interface AlertRule {
    key: string;
    id: string;
    name: string;
    monitor: string;
    condition: AlertCondition;
    threshold: string;
    channels: AlertChannel[];
    enabled: boolean;
    lastTriggered: string | null;
    triggerCount: number;
}

const channelColors: Record<AlertChannel, string> = {
    email: 'blue', slack: 'purple', webhook: 'cyan', pagerduty: 'red',
};

const conditionLabels: Record<AlertCondition, string> = {
    down: 'Monitor Down',
    slow: 'Response Too Slow',
    ssl_expiry: 'SSL Expiring Soon',
    status_code: 'Unexpected Status Code',
};

const initialAlerts: AlertRule[] = [
    {
        key: '1', id: 'ALT-001', name: 'Auth Service Down Alert',
        monitor: 'Auth Service', condition: 'down', threshold: 'Immediately',
        channels: ['email', 'slack'], enabled: true,
        lastTriggered: '2026-03-23 08:14:00', triggerCount: 3,
    },
    {
        key: '2', id: 'ALT-002', name: 'Payment Gateway High Latency',
        monitor: 'Payment Gateway', condition: 'slow', threshold: '> 3000ms',
        channels: ['pagerduty', 'email'], enabled: true,
        lastTriggered: '2026-03-23 11:55:00', triggerCount: 1,
    },
    {
        key: '3', id: 'ALT-003', name: 'SSL Certificate Warning',
        monitor: 'Auth Service', condition: 'ssl_expiry', threshold: '< 14 days',
        channels: ['email'], enabled: true,
        lastTriggered: null, triggerCount: 0,
    },
    {
        key: '4', id: 'ALT-004', name: 'Admin API 5xx Errors',
        monitor: 'Admin API', condition: 'status_code', threshold: '>= 500',
        channels: ['slack', 'webhook'], enabled: false,
        lastTriggered: '2026-03-22 19:00:00', triggerCount: 2,
    },
    {
        key: '5', id: 'ALT-005', name: 'Search Engine Outage',
        monitor: 'Search Engine', condition: 'down', threshold: 'Immediately',
        channels: ['email', 'pagerduty'], enabled: true,
        lastTriggered: '2026-03-23 13:30:00', triggerCount: 4,
    },
];

export default function AlertsPage() {
    const navigate = useNavigate();
    const [alerts, setAlerts] = useState<AlertRule[]>(initialAlerts);
    const [error] = useState<string | null>(null);

    const toggleAlert = (key: string, enabled: boolean) => {
        setAlerts((prev) => prev.map((a) => (a.key === key ? { ...a, enabled } : a)));
        message.success(`Alert ${enabled ? 'enabled' : 'disabled'} successfully`);
    };

    const deleteAlert = (key: string) => {
        setAlerts((prev) => prev.filter((a) => a.key !== key));
        message.success('Alert rule deleted');
    };

    const columns: ColumnsType<AlertRule> = [
        {
            title: 'Alert Name',
            dataIndex: 'name',
            key: 'name',
            render: (name, record) => (
                <div className="flex items-start gap-2">
                    <BellOutlined className={record.enabled ? 'text-sky-500 mt-1' : 'text-gray-400 mt-1'} />
                    <div>
                        <Text strong>{name}</Text>
                        <Text type="secondary" className="text-xs block font-mono">{record.id}</Text>
                    </div>
                </div>
            ),
        },
        {
            title: 'Monitor',
            dataIndex: 'monitor',
            key: 'monitor',
            render: (m) => <Tag>{m}</Tag>,
        },
        {
            title: 'Condition',
            key: 'condition',
            render: (_, record) => (
                <div>
                    <Text className="text-sm block">{conditionLabels[record.condition]}</Text>
                    <Text type="secondary" className="text-xs font-mono">{record.threshold}</Text>
                </div>
            ),
        },
        {
            title: 'Channels',
            dataIndex: 'channels',
            key: 'channels',
            render: (channels: AlertChannel[]) => (
                <Space wrap>
                    {channels.map((ch) => (
                        <Tag key={ch} color={channelColors[ch]} className="capitalize">{ch}</Tag>
                    ))}
                </Space>
            ),
        },
        {
            title: 'Triggered',
            dataIndex: 'triggerCount',
            key: 'triggerCount',
            render: (count, record) => (
                <div>
                    <Badge count={count} showZero color={count > 0 ? 'red' : 'gray'} />
                    <Text type="secondary" className="text-xs block mt-1">
                        {record.lastTriggered ? `Last: ${record.lastTriggered}` : 'Never triggered'}
                    </Text>
                </div>
            ),
            sorter: (a, b) => a.triggerCount - b.triggerCount,
        },
        {
            title: 'Enabled',
            dataIndex: 'enabled',
            key: 'enabled',
            render: (enabled, record) => (
                <Switch
                    checked={enabled}
                    onChange={(val) => toggleAlert(record.key, val)}
                    checkedChildren="ON"
                    unCheckedChildren="OFF"
                />
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 100,
            render: (_, record) => (
                <Space>
                    <Tooltip title="Edit">
                        <Button
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => navigate(`/alerts/${record.key}/edit`)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Delete this alert rule?"
                        description="This action cannot be undone."
                        onConfirm={() => deleteAlert(record.key)}
                        okText="Delete"
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Delete">
                            <Button type="link" danger icon={<DeleteOutlined />} />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const enabledCount = alerts.filter((a) => a.enabled).length;
    const totalTriggers = alerts.reduce((sum, a) => sum + a.triggerCount, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <Title level={3} className="!mb-0">Alerts</Title>
                    <Text type="secondary">Manage notification rules for your monitors</Text>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate('/alerts/create')}
                >
                    Create Alert
                </Button>
            </div>

            {error && (
                <Alert message="Failed to load alerts" description={error} type="error" showIcon closable />
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Total Rules', count: alerts.length, color: 'bg-sky-50 border-sky-200 text-sky-600' },
                    { label: 'Active Rules', count: enabledCount, color: 'bg-emerald-50 border-emerald-200 text-emerald-600' },
                    { label: 'Total Triggers (7d)', count: totalTriggers, color: 'bg-rose-50 border-rose-200 text-rose-600' },
                ].map((card) => (
                    <div
                        key={card.label}
                        className={`rounded-xl border p-4 flex items-center gap-4 ${card.color}`}
                    >
                        <span className="text-3xl font-extrabold">{card.count}</span>
                        <span className="font-semibold text-sm">{card.label}</span>
                    </div>
                ))}
            </div>

            {/* Alerts Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <Table
                    columns={columns}
                    dataSource={alerts}
                    rowKey="key"
                    locale={{
                        emptyText: (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="No alert rules configured yet"
                            >
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => navigate('/alerts/create')}
                                >
                                    Create your first alert
                                </Button>
                            </Empty>
                        ),
                    }}
                    pagination={{
                        pageSize: 8,
                        showTotal: (total, range) => (
                            <span className="text-gray-500 text-xs">
                                {range[0]}-{range[1]} of {total} rules
                            </span>
                        ),
                    }}
                />
            </div>
        </div>
    );
}
