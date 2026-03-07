import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Form, 
    Input, 
    Button, 
    Select, 
    Card, 
    Typography, 
    Row, 
    Col 
} from 'antd';

const { Title, Text } = Typography;

export default function MonitorCreatePage() {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        console.log('Success:', values);
        // Here we would typically call an API to save the monitor
        navigate('/monitors');
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <Title level={2} className="!mb-8 !text-[#0F172A] !font-extrabold tracking-tight">
                Add Monitor
            </Title>
            
            <Card 
                className="shadow-sm border-gray-100 rounded-2xl"
                bodyStyle={{ padding: '32px' }}
            >
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
                        timeout: 5000
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
                                label={<span className="font-bold text-gray-600">Timeout (ms)</span>}
                                name="timeout"
                            >
                                <Input 
                                    type="number"
                                    placeholder="5000" 
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

                    <div className="pt-6 flex gap-4">
                        <Button 
                            type="primary" 
                            htmlType="submit"
                            className="h-12 px-8 rounded-xl bg-sky-500 hover:bg-sky-600 border-none font-bold text-sm transition-all shadow-md shadow-sky-200"
                        >
                            Create Monitor
                        </Button>
                        <Button 
                            onClick={() => navigate('/monitors')}
                            className="h-12 px-8 rounded-xl bg-gray-50 hover:bg-gray-100 border-gray-100 text-gray-600 font-bold text-sm transition-all"
                        >
                            Cancel
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
}