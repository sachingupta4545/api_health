import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Form, Input, Select, Button, Card, Breadcrumb, Alert,
    Space, Typography, Checkbox, Divider, InputNumber, message, Spin
} from 'antd';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const monitors = [
    'Auth Service', 'Payment Gateway', 'Admin API', 'User Database',
    'Notification Hub', 'Storage Hook', 'Search Engine', 'Analytics API', 'Worker Node 1',
];

const conditions = [
    { label: 'Monitor goes down', value: 'down' },
    { label: 'Response time exceeds threshold', value: 'slow' },
    { label: 'SSL certificate expiring soon', value: 'ssl_expiry' },
    { label: 'Unexpected HTTP status code', value: 'status_code' },
];

const channels = [
    { label: 'Email', value: 'email' },
    { label: 'Slack', value: 'slack' },
    { label: 'Webhook', value: 'webhook' },
    { label: 'PagerDuty', value: 'pagerduty' },
];

export default function AlertCreatePage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id?: string }>();
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [condition, setCondition] = useState<string>('down');
    const isEdit = Boolean(id);

    const onFinish = async (values: any) => {
        setSubmitting(true);
        setSubmitError(null);
        try {
            // Simulated API delay
            await new Promise((r) => setTimeout(r, 800));
            console.log('Alert rule payload:', values);
            message.success(`Alert rule ${isEdit ? 'updated' : 'created'} successfully!`);
            navigate('/alerts');
        } catch (err: any) {
            setSubmitError(err?.message ?? 'An unexpected error occurred. Please try again.');
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

            <Spin spinning={submitting}>
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
                                options={monitors.map((m) => ({ label: m, value: m }))}
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.label as string).toLowerCase().includes(input.toLowerCase())
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

                    <Card title="Notification Channels" className="rounded-xl shadow-sm border-gray-100 mb-4">
                        <Form.Item
                            label="Notify via"
                            name="channels"
                            rules={[{ required: true, message: 'Please select at least one channel' }]}
                        >
                            <Checkbox.Group options={channels} className="flex flex-col gap-2" />
                        </Form.Item>

                        <Divider />

                        <Form.Item
                            label="Email Recipients"
                            name="emails"
                            extra="Separate multiple emails with commas"
                        >
                            <Input placeholder="team@example.com, ops@example.com" />
                        </Form.Item>

                        <Form.Item
                            label="Slack Webhook URL"
                            name="slack_webhook"
                            rules={[
                                {
                                    type: 'url',
                                    message: 'Please enter a valid URL',
                                    warningOnly: true,
                                },
                            ]}
                        >
                            <Input placeholder="https://hooks.slack.com/services/..." />
                        </Form.Item>
                    </Card>

                    {/* Actions */}
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
