import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table, Tag, Button, Switch, Space, Tooltip, Typography,
    Empty, Alert, Badge, Popconfirm, message, Spin
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, BellOutlined, MailOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import * as alertService from '../../services/alertService';

const { Title, Text } = Typography;

const channelColors: Record<string, string> = {
    email: 'blue',
};

const conditionLabels: Record<string, string> = {
    down: 'Monitor Down',
    slow: 'Response Too Slow',
    ssl_expiry: 'SSL Expiring Soon',
    status_code: 'Unexpected Status Code',
};

export default function AlertsPage() {
    const navigate = useNavigate();
    const [alerts, setAlerts] = useState<alertService.AlertRule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAlerts = async () => {
        setLoading(true);
        try {
            const data = await alertService.getAlerts();
            setAlerts(data.alerts);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to fetch alerts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    const toggleAlert = async (id: string, enabled: boolean) => {
        try {
            await alertService.updateAlert(id, { enabled });
            setAlerts((prev) => prev.map((a) => (a._id === id ? { ...a, enabled } : a)));
            message.success(`Alert ${enabled ? 'enabled' : 'disabled'} successfully`);
        } catch (err: any) {
            message.error(err.response?.data?.message || 'Failed to update alert');
        }
    };

    const deleteAlert = async (id: string) => {
        try {
            await alertService.deleteAlert(id);
            setAlerts((prev) => prev.filter((a) => a._id !== id));
            message.success('Alert rule deleted');
        } catch (err: any) {
            message.error(err.response?.data?.message || 'Failed to delete alert');
        }
    };

    const columns: ColumnsType<alertService.AlertRule> = [
        {
            title: 'Alert Name',
            dataIndex: 'name',
            key: 'name',
            render: (name, record) => (
                <div className="flex items-start gap-2">
                    <BellOutlined className={record.enabled ? 'text-sky-500 mt-1' : 'text-gray-400 mt-1'} />
                    <div>
                        <Text strong>{name}</Text>
                        <Text type="secondary" className="text-xs block font-mono">{record._id.slice(-6).toUpperCase()}</Text>
                    </div>
                </div>
            ),
        },
        {
            title: 'Monitor',
            dataIndex: 'monitor',
            key: 'monitor',
            render: (m) => <Tag>{m?.name || 'N/A'}</Tag>,
        },
        {
            title: 'Condition',
            key: 'condition',
            render: (_, record) => (
                <div>
                    <Text className="text-sm block">{conditionLabels[record.condition]}</Text>
                    <Text type="secondary" className="text-xs font-mono">
                        {record.condition === 'slow' ? `> ${record.threshold}ms` : 
                         record.condition === 'ssl_expiry' ? `< ${record.threshold} days` :
                         record.condition === 'status_code' ? record.status_pattern : 'Immediately'}
                    </Text>
                </div>
            ),
        },
        {
            title: 'Channel',
            dataIndex: 'emails',
            key: 'emails',
            render: (emails) => (
                <Tooltip title={emails.join(', ')}>
                    <Tag color="blue" icon={<MailOutlined />}>Email ({emails.length})</Tag>
                </Tooltip>
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
                        {record.lastTriggered ? `Last: ${new Date(record.lastTriggered).toLocaleString()}` : 'Never triggered'}
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
                    onChange={(val) => toggleAlert(record._id, val)}
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
                            onClick={() => navigate(`/alerts/${record._id}/edit`)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Delete this alert rule?"
                        description="This action cannot be undone."
                        onConfirm={() => deleteAlert(record._id)}
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
    const totalTriggers = alerts.reduce((sum, a) => sum + (a.triggerCount || 0), 0);

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
                    { label: 'Total Triggers', count: totalTriggers, color: 'bg-rose-50 border-rose-200 text-rose-600' },
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
                <Spin spinning={loading}>
                    <Table
                        columns={columns}
                        dataSource={alerts}
                        rowKey="_id"
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
                </Spin>
            </div>
        </div>
    );
}
