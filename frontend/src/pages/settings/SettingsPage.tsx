import React, { useState } from 'react';
import {
    Tabs, Form, Input, Button, Select, Switch, Card,
    Typography, Avatar, Divider, Alert, Space,
    message, Upload, Spin
} from 'antd';
import {
    UserOutlined, BellOutlined,
    SaveOutlined, UploadOutlined,
    MailOutlined, SlackOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

// ─── Profile Tab ────────────────────────────────────────────────────────────────
function ProfileTab() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const onSave = async (values: any) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            await new Promise((r) => setTimeout(r, 800));
            console.log('Profile saved:', values);
            setSuccess(true);
            message.success('Profile updated successfully');
        } catch {
            setError('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Spin spinning={loading}>
            <div className="max-w-xl space-y-4">
                {success && <Alert type="success" message="Profile updated successfully!" closable onClose={() => setSuccess(false)} showIcon />}
                {error && <Alert type="error" message={error} closable onClose={() => setError(null)} showIcon />}

                <div className="flex items-center gap-4 mb-6">
                    <Avatar size={72} icon={<UserOutlined />} className="bg-sky-500" />
                    <Upload showUploadList={false} beforeUpload={() => { message.info('Avatar upload coming soon'); return false; }}>
                        <Button icon={<UploadOutlined />} size="small">Change Avatar</Button>
                    </Upload>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onSave}
                    initialValues={{ name: 'Sachin Gupta', email: 'sachin@example.com', timezone: 'Asia/Kolkata' }}
                >
                    <Form.Item
                        label="Full Name"
                        name="name"
                        rules={[
                            { required: true, message: 'Name is required' },
                            { min: 2, message: 'Name must be at least 2 characters' },
                        ]}
                    >
                        <Input prefix={<UserOutlined />} />
                    </Form.Item>

                    <Form.Item
                        label="Email Address"
                        name="email"
                        rules={[
                            { required: true, message: 'Email is required' },
                            { type: 'email', message: 'Please enter a valid email address' },
                        ]}
                    >
                        <Input prefix={<MailOutlined />} />
                    </Form.Item>

                    <Form.Item label="Timezone" name="timezone">
                        <Select
                            showSearch
                            options={[
                                { label: 'Asia/Kolkata (IST)', value: 'Asia/Kolkata' },
                                { label: 'UTC', value: 'UTC' },
                                { label: 'America/New_York (EST)', value: 'America/New_York' },
                                { label: 'Europe/London (GMT)', value: 'Europe/London' },
                                { label: 'America/Los_Angeles (PST)', value: 'America/Los_Angeles' },
                            ]}
                        />
                    </Form.Item>

                    <Divider />
                    <Text strong className="block mb-4">Change Password</Text>

                    <Form.Item label="Current Password" name="current_password">
                        <Input.Password placeholder="Leave blank to keep current password" />
                    </Form.Item>

                    <Form.Item
                        label="New Password"
                        name="new_password"
                        rules={[{ min: 8, message: 'Password must be at least 8 characters', warningOnly: false }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="Confirm New Password"
                        name="confirm_password"
                        dependencies={['new_password']}
                        rules={[
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('new_password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Passwords do not match'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                        Save Profile
                    </Button>
                </Form>
            </div>
        </Spin>
    );
}

// ─── Notifications Tab ───────────────────────────────────────────────────────────
function NotificationsTab() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onSave = async (values: any) => {
        setLoading(true);
        try {
            await new Promise((r) => setTimeout(r, 600));
            console.log('Notification prefs:', values);
            message.success('Notification preferences saved');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Spin spinning={loading}>
            <div className="max-w-xl">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onSave}
                    initialValues={{
                        email_down: true, email_recovered: true, email_degraded: false,
                        slack_down: true, slack_recovered: false,
                        digest: 'daily',
                    }}
                >
                    <Card title={<Text strong><MailOutlined className="mr-2" />Email Notifications</Text>} className="mb-4 rounded-xl border-gray-100 shadow-sm">
                        {[
                            { name: 'email_down', label: 'Monitor goes down', desc: 'Immediate alert when a monitor fails' },
                            { name: 'email_recovered', label: 'Monitor recovers', desc: 'Alert when a monitor comes back up' },
                            { name: 'email_degraded', label: 'Degraded performance', desc: 'Alert on slow response times' },
                        ].map((item) => (
                            <Form.Item key={item.name} name={item.name} valuePropName="checked" className="!mb-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Text className="block font-medium">{item.label}</Text>
                                        <Text type="secondary" className="text-xs">{item.desc}</Text>
                                    </div>
                                    <Form.Item name={item.name} valuePropName="checked" noStyle>
                                        <Switch />
                                    </Form.Item>
                                </div>
                            </Form.Item>
                        ))}
                    </Card>

                    <Card title={<Text strong><SlackOutlined className="mr-2" />Slack Notifications</Text>} className="mb-4 rounded-xl border-gray-100 shadow-sm">
                        {[
                            { name: 'slack_down', label: 'Monitor goes down' },
                            { name: 'slack_recovered', label: 'Monitor recovers' },
                        ].map((item) => (
                            <Form.Item key={item.name} name={item.name} valuePropName="checked" className="!mb-3">
                                <div className="flex items-center justify-between">
                                    <Text className="font-medium">{item.label}</Text>
                                    <Form.Item name={item.name} valuePropName="checked" noStyle>
                                        <Switch />
                                    </Form.Item>
                                </div>
                            </Form.Item>
                        ))}
                    </Card>

                    <Card title="Digest Reports" className="mb-4 rounded-xl border-gray-100 shadow-sm">
                        <Form.Item label="Send uptime digest" name="digest">
                            <Select
                                options={[
                                    { label: 'Never', value: 'never' },
                                    { label: 'Daily', value: 'daily' },
                                    { label: 'Weekly', value: 'weekly' },
                                    { label: 'Monthly', value: 'monthly' },
                                ]}
                            />
                        </Form.Item>
                    </Card>

                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                        Save Preferences
                    </Button>
                </Form>
            </div>
        </Spin>
    );
}

// ─── Main Settings Page ─────────────────────────────────────────────────────────
export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <Title level={3} className="!mb-0">Settings</Title>
                <Text type="secondary">Manage your account, notifications, and team</Text>
            </div>

            <Tabs
                defaultActiveKey="profile"
                size="large"
                items={[
                    {
                        key: 'profile',
                        label: <span><UserOutlined className="mr-1" />Profile</span>,
                        children: <ProfileTab />,
                    },
                    {
                        key: 'notifications',
                        label: <span><BellOutlined className="mr-1" />Notifications</span>,
                        children: <NotificationsTab />,
                    },
                ]}
            />
        </div>
    );
}
