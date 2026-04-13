import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Form, Input, Select, Button, Card, Breadcrumb, Alert,
    Space, Typography, InputNumber, message, Spin
} from 'antd';
import {
    SaveOutlined, ArrowLeftOutlined, MailOutlined,
} from '@ant-design/icons';
import * as alertService from '../../services/alertService';
import * as monitorService from '../../services/monitorService';

const { Title, Text } = Typography;

const conditions = [
    { label: 'Monitor goes down', value: 'down' },
    { label: 'Response time exceeds threshold', value: 'slow' },
    { label: 'SSL certificate expiring soon', value: 'ssl_expiry' },
    { label: 'Unexpected HTTP status code', value: 'status_code' },
];

export default function AlertCreatePage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id?: string }>();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [monitors, setMonitors] = useState<monitorService.Monitor[]>([]);
    const [condition, setCondition] = useState<string>('down');
    const isEdit = Boolean(id);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const monitorsData = await monitorService.getMonitors();
                setMonitors(monitorsData.monitors);

                if (isEdit && id) {
                    const alertData = await alertService.getAlertById(id);
                    const alert = alertData.alert;
                    form.setFieldsValue({
                        ...alert,
                        monitor: alert.monitor._id,
                        emails: alert.emails.join(', '),
                        // Map threshold to correct field based on condition
                        ssl_days: alert.condition === 'ssl_expiry' ? alert.threshold : 14,
                        threshold: alert.condition === 'slow' ? alert.threshold : 3000,
                    });
                    setCondition(alert.condition);
                }
            } catch (err: any) {
                message.error('Failed to load required data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, isEdit, form]);

    const onFinish = async (values: any) => {
        setSubmitting(true);
        setSubmitError(null);
        try {
            const payload = {
                ...values,
                // Combine threshold fields into one based on condition
                threshold: values.condition === 'slow' ? values.threshold :
                    values.condition === 'ssl_expiry' ? values.ssl_days : 0,
                emails: values.emails.split(',').map((e: string) => e.trim()).filter(Boolean),
            };

            if (isEdit && id) {
                await alertService.updateAlert(id, payload);
                message.success('Alert rule updated successfully!');
            } else {
                await alertService.createAlert(payload);
                message.success('Alert rule created successfully!');
            }
            navigate('/alerts');
        } catch (err: any) {
            setSubmitError(err.response?.data?.message || err.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <Breadcrumb
                items={[
                    { title: <span onClick={() => navigate('/alerts')} className="cursor-pointer">Alerts</span> },
                    { title: isEdit ? 'Edit Alert' : 'Create Alert' },
                ]}
            />

            <div className="flex items-center gap-3">
                <Button icon={<ArrowLeftOutlined />} size="small" onClick={() => navigate('/alerts')} />
                <div>
                    <Title level={3} className="!mb-0">
                        {isEdit ? 'Edit Alert Rule' : 'Create Alert Rule'}
                    </Title>
                    <Text type="secondary">Configure when and how you get notified</Text>
                </div>
            </div>

            {submitError && (
                <Alert
                    type="error"
                    showIcon
                    message="Failed to save alert rule"
                    description={submitError}
                    closable
                    onClose={() => setSubmitError(null)}
                />
            )}

            <Spin spinning={loading || submitting}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ condition: 'down', channels: ['email'], threshold: 3000, ssl_days: 14 }}
                >
                    <Card title="Basic Information" className="rounded-xl shadow-sm border-gray-100 mb-4">
                        <Form.Item
                            label="Alert Name"
                            name="name"
                            rules={[
                                { required: true, message: 'Please enter an alert name' },
                                { min: 3, message: 'Name must be at least 3 characters' },
                                { max: 80, message: 'Name must be at most 80 characters' },
                            ]}
                        >
                            <Input placeholder="e.g. Auth Service Down Alert" maxLength={80} showCount />
                        </Form.Item>

                        <Form.Item
                            label="Monitor"
                            name="monitor"
                            rules={[{ required: true, message: 'Please select a monitor' }]}
                        >
                            <Select
                                placeholder="Select a monitor to watch"
                                options={monitors.map((m) => ({ label: m.name, value: m._id }))}
                                showSearch
                                filterOption={(input, option) =>
                                    String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        </Form.Item>
                    </Card>

                    <Card title="Trigger Condition" className="rounded-xl shadow-sm border-gray-100 mb-4">
                        <Form.Item
                            label="Condition"
                            name="condition"
                            rules={[{ required: true, message: 'Please select a condition' }]}
                        >
                            <Select
                                options={conditions}
                                onChange={(v) => setCondition(v)}
                                placeholder="When should this alert fire?"
                            />
                        </Form.Item>

                        {condition === 'slow' && (
                            <Form.Item
                                label="Response Time Threshold (ms)"
                                name="threshold"
                                rules={[
                                    { required: true, message: 'Please enter a threshold' },
                                    { type: 'number', min: 100, message: 'Minimum threshold is 100ms' },
                                    { type: 'number', max: 60000, message: 'Maximum threshold is 60,000ms' },
                                ]}
                            >
                                <InputNumber
                                    min={100} max={60000} step={100}
                                    addonAfter="ms"
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        )}

                        {condition === 'ssl_expiry' && (
                            <Form.Item
                                label="Alert when SSL expires within (days)"
                                name="ssl_days"
                                rules={[
                                    { required: true, message: 'Please enter number of days' },
                                    { type: 'number', min: 1, message: 'Minimum is 1 day' },
                                    { type: 'number', max: 90, message: 'Maximum is 90 days' },
                                ]}
                            >
                                <InputNumber min={1} max={90} addonAfter="days" style={{ width: '100%' }} />
                            </Form.Item>
                        )}

                        {condition === 'status_code' && (
                            <Form.Item
                                label="Status Code Pattern"
                                name="status_pattern"
                                rules={[{ required: true, message: 'Please enter a status code or pattern' }]}
                                extra='Examples: "500", ">= 400", "!= 200"'
                            >
                                <Input placeholder=">= 500" />
                            </Form.Item>
                        )}
                    </Card>

                    <Card title="Email Notification" className="rounded-xl shadow-sm border-gray-100 mb-4">
                        <Form.Item
                            label="Recipient Emails"
                            name="emails"
                            rules={[
                                { required: true, message: 'Please enter at least one email address' },
                                {

                                    
                                    validator(_, value) {
                                        if (!value) return Promise.resolve();
                                        const emails = value.split(',').map((e: string) => e.trim()).filter(Boolean);
                                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                        const invalid = emails.find((e: string) => !emailRegex.test(e));
                                        return invalid
                                            ? Promise.reject(new Error(`"${invalid}" is not a valid email address`))
                                            : Promise.resolve();
                                    },
                                },
                            ]}

                            extra="Separate multiple email addresses with commas"
                        >
                            <Input
                                prefix={<MailOutlined />}
                                placeholder="team@example.com, ops@example.com"
                            />
                        </Form.Item>
                    </Card>

                    <Space>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            loading={submitting}
                        >
                            {isEdit ? 'Save Changes' : 'Create Alert Rule'}
                        </Button>
                        <Button onClick={() => navigate('/alerts')} disabled={submitting}>
                            Cancel
                        </Button>
                    </Space>
                </Form>
            </Spin>
        </div>
    );
}
