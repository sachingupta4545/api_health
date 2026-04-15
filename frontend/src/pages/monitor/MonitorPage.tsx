import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Space, Table, Tag, Button, notification, Modal } from 'antd';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { getMonitors, deleteMonitor, Monitor } from '../../services/monitorService';
const { Column } = Table;

// Using the Monitor interface from the service

// Static data removed

export default function MonitorPage() {
    const navigate = useNavigate();
    const [monitors, setMonitors] = React.useState<Monitor[]>([]);
    const [loading, setLoading] = React.useState(true);

    const fetchMonitors = async () => {
        try {
            setLoading(true);
            const data = await getMonitors();
            setMonitors(data.monitors || []);
        } catch (error) {
            console.error('Fetch Monitors Error:', error);
            notification.error({
                message: 'Error',
                description: 'Failed to fetch monitors',
            });
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchMonitors();
    }, []);

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this monitor?',
            content: 'This action cannot be undone.',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'No',
            async onOk() {
                try {
                    await deleteMonitor(id);
                    notification.success({
                        message: 'Success',
                        description: 'Monitor deleted successfully',
                    });
                    fetchMonitors();
                } catch (error) {
                    console.error('Delete Monitor Error:', error);
                    notification.error({
                        message: 'Error',
                        description: 'Failed to delete monitor',
                    });
                }
            },
        });
    };

    return (
        <>
            <div className="flex justify-end mb-4">
                <Button type="primary" onClick={() => navigate('/monitors/create')} className="flex items-center gap-2">
                    <Plus size={18} /> Add Monitor
                </Button>
            </div>
            <Table<Monitor>
                dataSource={monitors}
                rowKey="_id"
                loading={loading}
                scroll={{ x: 700 }}
                style={{ border: '1px solid #e5e7eb', borderRadius: '10px' }}
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
                <Column title="Status" dataIndex="lastStatus" key="lastStatus"
                    render={(text: string) => {
                        const colorMap: any = {
                            up: 'green',
                            down: 'red',
                            unknown: 'gray',
                        };
                        return (
                            <Tag color={colorMap[text] || 'gray'}>
                                {text ? text.toUpperCase() : 'UNKNOWN'}
                            </Tag>
                        );
                    }} />
                <Column title="Interval" dataIndex="interval" key="interval" render={(val) => `${val}s`} />
                <Column title="Last Checked" dataIndex="lastChecked" key="lastChecked" render={(val) => val ? new Date(val).toLocaleString() : 'Never'} />
                <Column
                    title="Action"
                    key="action"
                    render={(_: any, record: Monitor) => (
                        <Space size="middle">
                            <a onClick={() => navigate(`/monitors/edit/${record._id}`)} className="text-blue-500 hover:text-blue-600 cursor-pointer"> <Pencil size={18} /></a>
                            <a onClick={() => handleDelete(record._id)} className="text-red-500 hover:text-red-600 cursor-pointer"> <Trash2 size={18} /></a>
                        </Space>
                    )}
                />
            </Table>
        </>
    );
}