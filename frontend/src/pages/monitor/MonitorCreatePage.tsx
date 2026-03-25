import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Form,
    Input,
    Button,
    Select,
    Card,
    Typography,
    Row,
    Col,
    notification,
    Spin
} from 'antd';
import { createMonitor, fetchMonitorData, updateMonitor } from '../../services/monitorService';

const { Title, Text } = Typography;

export default function MonitorCreatePage() {
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fetchingMonitor, setFetchingMonitor] = useState(isEditMode);
    const [error, setError] = useState<any>(null);

    // Fetch the existing monitor data if in edit mode
    useEffect(() => {
        if (isEditMode && id) {
            setFetchingMonitor(true);
            fetchMonitorData(id)
                .then((data: any) => {
                    const monitor = data.monitor || data;
                    // Populate the form fields with the fetched data
                    form.setFieldsValue({
                        name: monitor.name,
                        url: monitor.url,
                        method: monitor.method,
                        interval: monitor.interval,
                        timeout: monitor.timeout,
                        alerts: monitor.alert_contact
                    });
                })
                .catch((err) => {
                    notification.error({
                        message: 'Error fetching monitor',
                        description: err.response?.data?.message || err.message,
                    });
                    console.error(err);
                })
                .finally(() => {
                    setFetchingMonitor(false);
                });
        }
    }, [id, form, isEditMode]);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            // Map 'alerts' to 'alert_contact' and add default 'status'
            const payload = {
                ...values,
                alert_contact: values.alerts,
                status: 'active'
            };

            if (isEditMode && id) {
                await updateMonitor(id, payload);
                notification.success({
                    message: 'Success',
                    description: 'Monitor updated successfully',
                    placement: 'topRight',
                });
            } else {
                await createMonitor(payload);
                notification.success({
                    message: 'Success',
                    description: 'Monitor created successfully',
                    placement: 'topRight',
                });
            }

            navigate('/monitors');
        } catch (error: any) {
            setError(error);
            console.error('Save Monitor Error:', error);
            notification.error({
                message: 'Error',
                description: error.response?.data?.message || 'Failed to save monitor',
                placement: 'topRight',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <Title level={2} className="!mb-8 !text-[#0F172A] !font-extrabold tracking-tight">
               {isEditMode ? 'Edit Monitor' : 'Add Monitor'}
            </Title>

            <Card
                className="shadow-sm border-gray-100 rounded-2xl"
                bodyStyle={{ padding: '32px' }}
            >
                {fetchingMonitor ? (
                    <div className="flex justify-center items-center py-16">
                        <Spin size="large" tip="Loading monitor details..." />
                    </div>
                ) : (
                    <>
                        <div className="mb-8 border-b border-gray-50 pb-4">
                            <Title level={4} className="!mb-1 !text-[#0F172A] !font-extrabold tracking-tight">
                                Monitor Configuration
                            </Title>
                        </div>

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            requiredMark={true}
                            initialValues={{
                                method: 'GET',
                                interval: 60,
                                timeout: 10
                            }}
                            className="space-y-4"
                        >
                            <Form.Item
                                label={<span className="font-bold text-gray-600">Monitor Name</span>}
                                name="name"
                                rules={[{ required: true, message: 'Please enter a monitor name' }]}
                            >
                                <Input
                                    placeholder="e.g. Users API"
                                    className="h-12 rounded-xl bg-gray-50 border-gray-100 hover:border-sky-500 focus:border-sky-500 transition-all font-medium"
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span className="font-bold text-gray-600">API URL</span>}
                                name="url"
                                rules={[
                                    { required: true, message: 'Please enter an API URL' },
                                    { type: 'url', message: 'Please enter a valid URL' }
                                ]}
                            >
                                <Input
                                    placeholder="https://api.example.com/health"
                                    className="h-12 rounded-xl bg-gray-50 border-gray-100 hover:border-sky-500 focus:border-sky-500 transition-all font-medium"
                                />
                            </Form.Item>

                            <Row gutter={24}>
                                <Col span={12}>
                                    <Form.Item
                                        label={<span className="font-bold text-gray-600">HTTP Method</span>}
                                        name="method"
                                    >
                                        <Select
                                            className="h-12 rounded-xl bg-gray-50 border-gray-100"
                                            options={[
                                                { value: 'GET', label: 'GET' },
                                                { value: 'POST', label: 'POST' },
                                                { value: 'PUT', label: 'PUT' },
                                                { value: 'DELETE', label: 'DELETE' },
                                                { value: 'PATCH', label: 'PATCH' },
                                            ]}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label={<span className="font-bold text-gray-600">Check Interval</span>}
                                        name="interval"
                                    >
                                        <Select
                                            className="h-12 rounded-xl bg-gray-50 border-gray-100"
                                            options={[
                                                { value: 60, label: 'Every 60 seconds' },
                                                { value: 300, label: 'Every 5 minutes' },
                                                { value: 600, label: 'Every 10 minutes' },
                                                { value: 1800, label: 'Every 30 minutes' },
                                                { value: 3600, label: 'Every 60 minutes' },
                                            ]}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={24}>
                                <Col span={12}>
                                    <Form.Item
                                        label={<span className="font-bold text-gray-600">Timeout (seconds)</span>}
                                        name="timeout"
                                    >
                                        <Input
                                            type="number"
                                            placeholder="10"
                                            className="h-12 rounded-xl bg-gray-50 border-gray-100 hover:border-sky-500 focus:border-sky-500 transition-all font-medium"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label={<span className="font-bold text-gray-600">Alert Contacts</span>}
                                        name="alerts"
                                    >
                                        <Input
                                            placeholder="team@example.com"
                                            className="h-12 rounded-xl bg-gray-50 border-gray-100 hover:border-sky-500 focus:border-sky-500 transition-all font-medium"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            {error ? <Text type="danger">{error.response?.data?.message ?? "Something went wrong"}</Text> : ""}

                            <div className="pt-6 flex gap-4">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    className="h-12 px-8 rounded-xl bg-sky-500 hover:bg-sky-600 border-none font-bold text-sm transition-all shadow-md shadow-sky-200"
                                >
                                    {isEditMode ? 'Update Monitor' : 'Create Monitor'}
                                </Button>
                                <Button
                                    onClick={() => navigate('/monitors')}
                                    className="h-12 px-8 rounded-xl bg-gray-50 hover:bg-gray-100 border-gray-100 text-gray-600 font-bold text-sm transition-all"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </Form>
                    </>
                )}
            </Card>
        </div>
    );
}