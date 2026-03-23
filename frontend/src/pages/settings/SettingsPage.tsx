import React, { useState } from 'react';
import {
    Tabs, Form, Input, Button, Select, Switch, Card,
    Typography, Avatar, Divider, Alert, Space, Tag, Popconfirm,
    Table, message, Upload, Spin
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    UserOutlined, BellOutlined, ApiOutlined, TeamOutlined,
    SaveOutlined, PlusOutlined, DeleteOutlined, UploadOutlined,
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

// ─── Integrations Tab ─────────────────────────────────────────────────────────────
function IntegrationsTab() {
    const integrations = [
        { name: 'Slack', desc: 'Send alerts directly to Slack channels', connected: true, icon: '🟣' },
        { name: 'PagerDuty', desc: 'Escalate incidents to on-call schedules', connected: false, icon: '🟢' },
        { name: 'Email', desc: 'Email notification delivery', connected: true, icon: '📧' },
        { name: 'Webhook', desc: 'Custom HTTP webhooks for any service', connected: false, icon: '🔗' },
        { name: 'Discord', desc: 'Send alerts to Discord channels', connected: false, icon: '🔵' },
        { name: 'Microsoft Teams', desc: 'Integrate with Teams incoming webhooks', connected: false, icon: '🟦' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            {integrations.map((intg) => (
                <Card key={intg.name} className="rounded-xl border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{intg.icon}</span>
                            <div>
                                <div className="flex items-center gap-2">
                                    <Text strong>{intg.name}</Text>
                                    {intg.connected && <Tag color="green" className="text-xs">Connected</Tag>}
                                </div>
                                <Text type="secondary" className="text-xs">{intg.desc}</Text>
                            </div>
                        </div>
                    </div>
                    <div className="mt-3">
                        {intg.connected ? (
                            <Space>
                                <Button size="small">Configure</Button>
                                <Popconfirm
                                    title={`Disconnect ${intg.name}?`}
                                    onConfirm={() => message.warning(`${intg.name} disconnected`)}
                                >
                                    <Button size="small" danger>Disconnect</Button>
                                </Popconfirm>
                            </Space>
                        ) : (
                            <Button
                                type="primary"
                                size="small"
                                onClick={() => message.info(`${intg.name} integration coming soon`)}
                            >
                                Connect
                            </Button>
                        )}
                    </div>
                </Card>
            ))}
        </div>
    );
}

// ─── Team Tab ─────────────────────────────────────────────────────────────────────
interface TeamMember { key: string; name: string; email: string; role: 'Owner' | 'Admin' | 'Viewer'; status: 'active' | 'pending'; }

const initialMembers: TeamMember[] = [
    { key: '1', name: 'Sachin Gupta', email: 'sachin@example.com', role: 'Owner', status: 'active' },
    { key: '2', name: 'Priya Sharma', email: 'priya@example.com', role: 'Admin', status: 'active' },
    { key: '3', name: 'Rahul Dev', email: 'rahul@example.com', role: 'Viewer', status: 'pending' },
];

function TeamTab() {
    const [members, setMembers] = useState<TeamMember[]>(initialMembers);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<'Admin' | 'Viewer'>('Viewer');
    const [inviteError, setInviteError] = useState<string | null>(null);

    const handleInvite = () => {
        setInviteError(null);
        if (!inviteEmail) return setInviteError('Email is required');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(inviteEmail)) return setInviteError('Please enter a valid email address');
        if (members.some((m) => m.email === inviteEmail)) return setInviteError('This email is already in the team');

        const newMember: TeamMember = {
            key: Date.now().toString(), name: inviteEmail.split('@')[0],
            email: inviteEmail, role: inviteRole, status: 'pending',
        };
        setMembers((prev) => [...prev, newMember]);
        setInviteEmail('');
        message.success(`Invitation sent to ${inviteEmail}`);
    };

    const handleRemove = (key: string) => {
        setMembers((prev) => prev.filter((m) => m.key !== key));
        message.success('Member removed');
    };

    const columns: ColumnsType<TeamMember> = [
        {
            title: 'Member',
            key: 'member',
            render: (_, r) => (
                <div className="flex items-center gap-3">
                    <Avatar size={32} className="bg-sky-500">{r.name[0].toUpperCase()}</Avatar>
                    <div>
                        <Text strong className="block">{r.name}</Text>
                        <Text type="secondary" className="text-xs">{r.email}</Text>
                    </div>
                </div>
            ),
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role) => (
                <Tag color={role === 'Owner' ? 'gold' : role === 'Admin' ? 'blue' : 'default'}>{role}</Tag>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (s) => (
                <Tag color={s === 'active' ? 'green' : 'orange'} className="capitalize">{s}</Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, r) => r.role === 'Owner' ? null : (
                <Popconfirm title="Remove this member?" onConfirm={() => handleRemove(r.key)} okButtonProps={{ danger: true }}>
                    <Button type="link" danger icon={<DeleteOutlined />} size="small">Remove</Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <div className="space-y-6 max-w-2xl">
            <Card title="Invite Team Member" className="rounded-xl border-gray-100 shadow-sm">
                {inviteError && (
                    <Alert type="error" message={inviteError} showIcon closable className="mb-3" onClose={() => setInviteError(null)} />
                )}
                <Space.Compact style={{ width: '100%' }}>
                    <Input
                        prefix={<MailOutlined />}
                        placeholder="colleague@example.com"
                        value={inviteEmail}
                        onChange={(e) => { setInviteEmail(e.target.value); setInviteError(null); }}
                        onPressEnter={handleInvite}
                        status={inviteError ? 'error' : undefined}
                        style={{ flex: 1 }}
                    />
                    <Select
                        value={inviteRole}
                        onChange={setInviteRole}
                        style={{ width: 120 }}
                        options={[
                            { label: 'Admin', value: 'Admin' },
                            { label: 'Viewer', value: 'Viewer' },
                        ]}
                    />
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleInvite}>
                        Invite
                    </Button>
                </Space.Compact>
            </Card>

            <Card title="Team Members" className="rounded-xl border-gray-100 shadow-sm">
                <Table columns={columns} dataSource={members} rowKey="key" pagination={false} size="small" />
            </Card>
        </div>
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
                    {
                        key: 'integrations',
                        label: <span><ApiOutlined className="mr-1" />Integrations</span>,
                        children: <IntegrationsTab />,
                    },
                    {
                        key: 'team',
                        label: <span><TeamOutlined className="mr-1" />Team</span>,
                        children: <TeamTab />,
                    },
                ]}
            />
        </div>
    );
}
