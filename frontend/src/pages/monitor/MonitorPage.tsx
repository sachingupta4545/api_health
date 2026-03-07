import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Space, Table, Tag, Button } from 'antd';
import { Pencil, Trash2, Plus } from 'lucide-react';
const { Column } = Table;

interface DataType {
    key: React.Key;
    name: string;
    url: string;
    method: string;
    status: string;
    responsetime: string;
    interval: string;
    lastChecked: any;
}

const data: DataType[] = [
    {
        key: '2',
        name: 'Jane',
        url: 'example.com/api/v1',
        method: 'POST',
        status: 'Up',
        responsetime: '150ms',
        interval: '10m',
        lastChecked: '2022-01-01 12:05:00',
    },
    {
        key: '3',
        name: 'Admin API',
        url: 'api.admin.pulse',
        method: 'GET',
        status: 'Down',
        responsetime: '0ms',
        interval: '1m',
        lastChecked: '2022-01-01 12:10:00',
    },
    {
        key: '4',
        name: 'Auth Service',
        url: 'auth.guard.com',
        method: 'POST',
        status: 'Up',
        responsetime: '85ms',
        interval: '5m',
        lastChecked: '2022-01-01 12:15:00',
    },
    {
        key: '5',
        name: 'User Database',
        url: 'db.internal.check',
        method: 'GET',
        status: 'Up',
        responsetime: '12ms',
        interval: '15m',
        lastChecked: '2022-01-01 12:20:00',
    },
    {
        key: '6',
        name: 'Payment Gateway',
        url: 'stripe.external.api',
        method: 'POST',
        status: 'Up',
        responsetime: '210ms',
        interval: '5m',
        lastChecked: '2022-01-01 12:25:00',
    },
    {
        key: '7',
        name: 'Notification Hub',
        url: 'push.notify.com',
        method: 'GET',
        status: 'Up',
        responsetime: '45ms',
        interval: '10m',
        lastChecked: '2022-01-01 12:30:00',
    },
    {
        key: '8',
        name: 'Storage Hook',
        url: 's3.check.internal',
        method: 'HEAD',
        status: 'Up',
        responsetime: '33ms',
        interval: '5m',
        lastChecked: '2022-01-01 12:35:00',
    },
    {
        key: '9',
        name: 'Search Engine',
        url: 'search.pulse.local',
        method: 'GET',
        status: 'Down',
        responsetime: '0ms',
        interval: '2m',
        lastChecked: '2022-01-01 12:40:00',
    },
    {
        key: '10',
        name: 'Analytics API',
        url: 'stats.internal.check',
        method: 'POST',
        status: 'Up',
        responsetime: '178ms',
        interval: '5m',
        lastChecked: '2022-01-01 12:45:00',
    },
    {
        key: '11',
        name: 'Worker Node 1',
        url: 'node1.cluster.local',
        method: 'GET',
        status: 'Up',
        responsetime: '5ms',
        interval: '1m',
        lastChecked: '2022-01-01 12:50:00',
    },
    {
        key: '1',
        name: 'John',
        url: 'Brown',
        method: 'GET',
        status: 'Up',
        responsetime: '100ms',
        interval: '5m',
        lastChecked: '2022-01-01 12:00:00',
    },
];

export default function MonitorPage() {

    const navigate = useNavigate();
    return (
        <>
            <div className="flex justify-end mb-4">
                <Button type="primary" onClick={() => navigate('/monitors/create')}>
                    <Plus /> Add Monitor
                </Button>
            </div>
            <Table<DataType> dataSource={data} style={{ border: '1px solid #e5e7eb', borderRadius: '10px' }}
                pagination={{
                    pageSize: 7,
                    showTotal: (total, range) => (
                        <span className="text-gray-500 font-medium">
                            Showing {range[0]}-{range[1]} of {total} monitors
                        </span>
                    ),
                    style: { display: 'flex', alignItems: 'left', width: '100%' }
                }}>
                <Column title="Name" dataIndex="name" key="name" />
                <Column title="URL" dataIndex="url" key="url" />
                <Column title="Method" dataIndex="method" key="method" />
                <Column title="Status" dataIndex="status" key="status"
                    render={(text: string) => {
                        return (
                            <Tag color={text === 'Up' ? 'green' : 'red'}>
                                {text}
                            </Tag>
                        );
                    }} />
                <Column title="Response Time" dataIndex="responsetime" key="responsetime" />
                <Column title="Interval" dataIndex="interval" key="interval" />
                <Column title="Last Checked" dataIndex="lastChecked" key="lastChecked" />
                <Column
                    title="Action"
                    key="action"
                    render={(_: any, record: DataType) => (
                        <Space size="middle">
                            <a className="text-blue-500 hover:text-blue-600 cursor-pointer"> <Pencil /></a>
                            <a className="text-red-500 hover:text-red-600 cursor-pointer"> <Trash2 /></a>
                        </Space>
                    )}
                />
            </Table>
        </>
    );
}