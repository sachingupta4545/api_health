import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table, Tag, Button, Select, DatePicker, Input, Space, Badge,
    Tooltip, Typography, Empty, Alert
} from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

type Severity = 'critical' | 'high' | 'medium' | 'low';
type IncidentStatus = 'open' | 'investigating' | 'resolved';

interface Incident {
    key: string;
    id: string;
    title: string;
    monitor: string;
    severity: Severity;
    status: IncidentStatus;
    startedAt: string;
    resolvedAt: string | null;
    duration: string;
    affectedUrl: string;
}

const mockIncidents: Incident[] = [
    {
        key: '1', id: 'INC-001', title: 'Auth Service Unreachable', monitor: 'Auth Service',
        severity: 'critical', status: 'resolved', startedAt: '2026-03-23 08:14:00',
        resolvedAt: '2026-03-23 08:42:00', duration: '28m', affectedUrl: 'auth.guard.com',
    },
    {
        key: '2', id: 'INC-002', title: 'Payment Gateway Timeout', monitor: 'Payment Gateway',
        severity: 'high', status: 'investigating', startedAt: '2026-03-23 11:55:00',
        resolvedAt: null, duration: '2h 14m', affectedUrl: 'stripe.external.api',
    },
    {
        key: '3', id: 'INC-003', title: 'Search Engine Down', monitor: 'Search Engine',
        severity: 'high', status: 'open', startedAt: '2026-03-23 13:30:00',
        resolvedAt: null, duration: '45m', affectedUrl: 'search.pulse.local',
    },
    {
        key: '4', id: 'INC-004', title: 'Admin API Slow Response', monitor: 'Admin API',
        severity: 'medium', status: 'resolved', startedAt: '2026-03-22 19:00:00',
        resolvedAt: '2026-03-22 19:35:00', duration: '35m', affectedUrl: 'api.admin.pulse',
    },
    {
        key: '5', id: 'INC-005', title: 'Worker Node 1 Offline', monitor: 'Worker Node 1',
        severity: 'critical', status: 'resolved', startedAt: '2026-03-22 03:10:00',
        resolvedAt: '2026-03-22 04:05:00', duration: '55m', affectedUrl: 'node1.cluster.local',
    },
    {
        key: '6', id: 'INC-006', title: 'Notification Hub Latency Spike', monitor: 'Notification Hub',
        severity: 'low', status: 'resolved', startedAt: '2026-03-21 14:00:00',
        resolvedAt: '2026-03-21 14:20:00', duration: '20m', affectedUrl: 'push.notify.com',
    },
    {
        key: '7', id: 'INC-007', title: 'Database Connection Pool Exhausted', monitor: 'User Database',
        severity: 'high', status: 'resolved', startedAt: '2026-03-20 09:45:00',
        resolvedAt: '2026-03-20 10:30:00', duration: '45m', affectedUrl: 'db.internal.check',
    },
];

const severityConfig: Record<Severity, { color: string; label: string }> = {
    critical: { color: 'red', label: 'Critical' },
    high: { color: 'orange', label: 'High' },
    medium: { color: 'yellow', label: 'Medium' },
    low: { color: 'blue', label: 'Low' },
};

const statusConfig: Record<IncidentStatus, { color: string; status: 'error' | 'warning' | 'success'; label: string }> = {
    open: { color: 'red', status: 'error', label: 'Open' },
    investigating: { color: 'orange', status: 'warning', label: 'Investigating' },
    resolved: { color: 'green', status: 'success', label: 'Resolved' },
};

export default function IncidentsPage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [severityFilter, setSeverityFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [error] = useState<string | null>(null);

    const filtered = mockIncidents.filter((inc) => {
        const matchSearch =
            inc.title.toLowerCase().includes(search.toLowerCase()) ||
            inc.monitor.toLowerCase().includes(search.toLowerCase()) ||
            inc.id.toLowerCase().includes(search.toLowerCase());
        const matchSeverity = severityFilter === 'all' || inc.severity === severityFilter;
        const matchStatus = statusFilter === 'all' || inc.status === statusFilter;
        return matchSearch && matchSeverity && matchStatus;
    });

    const openCount = mockIncidents.filter((i) => i.status === 'open').length;
    const investigatingCount = mockIncidents.filter((i) => i.status === 'investigating').length;
    const resolvedCount = mockIncidents.filter((i) => i.status === 'resolved').length;

    const columns: ColumnsType<Incident> = [
        {
            title: 'Incident ID',
            dataIndex: 'id',
            key: 'id',
            width: 120,
            render: (id) => <Text className="font-mono text-xs text-gray-500">{id}</Text>,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (title, record) => (
                <div>
                    <Text strong className="block">{title}</Text>
                    <Text type="secondary" className="text-xs">{record.affectedUrl}</Text>
                </div>
            ),
        },
        {
            title: 'Monitor',
            dataIndex: 'monitor',
            key: 'monitor',
            render: (monitor) => <Tag>{monitor}</Tag>,
        },
        {
            title: 'Severity',
            dataIndex: 'severity',
            key: 'severity',
            render: (s: Severity) => (
                <Tag color={severityConfig[s].color} className="font-semibold uppercase text-xs">
                    {severityConfig[s].label}
                </Tag>
            ),
            filters: [
                { text: 'Critical', value: 'critical' },
                { text: 'High', value: 'high' },
                { text: 'Medium', value: 'medium' },
                { text: 'Low', value: 'low' },
            ],
            onFilter: (value, record) => record.severity === value,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (s: IncidentStatus) => (
                <Badge
                    status={statusConfig[s].status}
                    text={<span className="font-medium">{statusConfig[s].label}</span>}
                />
            ),
            filters: [
                { text: 'Open', value: 'open' },
                { text: 'Investigating', value: 'investigating' },
                { text: 'Resolved', value: 'resolved' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Started At',
            dataIndex: 'startedAt',
            key: 'startedAt',
            render: (v) => <Text className="text-xs">{v}</Text>,
            sorter: (a, b) => dayjs(a.startedAt).unix() - dayjs(b.startedAt).unix(),
        },
        {
            title: 'Duration',
            dataIndex: 'duration',
            key: 'duration',
            render: (v) => <Text className="font-mono text-xs">{v}</Text>,
        },
        {
            title: 'Action',
            key: 'action',
            width: 80,
            render: (_, record) => (
                <Tooltip title="View Details">
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`/incidents/${record.key}`)}
                    />
                </Tooltip>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <Title level={3} className="!mb-0">Incidents</Title>
                    <Text type="secondary">Track and manage service disruptions</Text>
                </div>
                <Button icon={<ReloadOutlined />}>Refresh</Button>
            </div>

            {/* Error Banner */}
            {error && (
                <Alert message="Failed to load incidents" description={error} type="error" showIcon closable />
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Open', count: openCount, color: 'bg-red-50 border-red-200 text-red-600' },
                    { label: 'Investigating', count: investigatingCount, color: 'bg-orange-50 border-orange-200 text-orange-600' },
                    { label: 'Resolved (7d)', count: resolvedCount, color: 'bg-green-50 border-green-200 text-green-600' },
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

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <Space wrap>
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder="Search incidents…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        allowClear
                        style={{ width: 240 }}
                    />
                    <Select
                        value={severityFilter}
                        onChange={setSeverityFilter}
                        style={{ width: 150 }}
                        options={[
                            { label: 'All Severities', value: 'all' },
                            { label: 'Critical', value: 'critical' },
                            { label: 'High', value: 'high' },
                            { label: 'Medium', value: 'medium' },
                            { label: 'Low', value: 'low' },
                        ]}
                        prefix={<FilterOutlined />}
                    />
                    <Select
                        value={statusFilter}
                        onChange={setStatusFilter}
                        style={{ width: 160 }}
                        options={[
                            { label: 'All Statuses', value: 'all' },
                            { label: 'Open', value: 'open' },
                            { label: 'Investigating', value: 'investigating' },
                            { label: 'Resolved', value: 'resolved' },
                        ]}
                    />
                    <RangePicker placeholder={['Start Date', 'End Date']} />
                </Space>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <Table
                    columns={columns}
                    dataSource={filtered}
                    rowKey="key"
                    locale={{
                        emptyText: (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="No incidents found matching your filters"
                            />
                        ),
                    }}
                    pagination={{
                        pageSize: 10,
                        showTotal: (total, range) => (
                            <span className="text-gray-500 text-xs">
                                {range[0]}-{range[1]} of {total} incidents
                            </span>
                        ),
                    }}
                />
            </div>
        </div>
    );
}
