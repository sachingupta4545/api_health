import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from './useAuth';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input } from 'antd';


type FieldType = {
    email?: string;
    password?: string;
};


export default function Login() {
    const { login, loading, error } = useAuth();

    const onFinish = async (values: FieldType) => {
        try {
            console.log(values);
            await login(values);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 bg-gray-50/50">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Welcome back</h2>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <Form
                        name="login"
                        onFinish={onFinish}
                        layout="vertical"
                        requiredMark={false}
                        className="space-y-4"
                    >
                        <Form.Item<FieldType>
                            name="email"
                            label={<span className="text-sm font-semibold text-gray-700">Email Address</span>}
                            rules={[
                                { required: true, message: 'Please input your email!' },
                                { type: 'email', message: 'Please enter a valid email!' }
                            ]}
                        >
                            <Input
                                prefix={<Mail className="h-5 w-5 text-gray-400 mr-2" />}
                                className="w-full px-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all sm:text-sm h-auto"
                                placeholder="name@example.com"
                            />
                        </Form.Item>

                        <Form.Item<FieldType>
                            name="password"
                            label={<span className="text-sm font-semibold text-gray-700">Password</span>}
                            rules={[{ required: true, message: 'Please input your password!' },
                            { min: 8, message: 'Password must be at least 8 characters long' },
                            { max: 16, message: 'Password must be at most 16 characters long' },
                            { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, message: 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character' },
                            ]}
                        >
                            <Input.Password
                                prefix={<Lock className="h-5 w-5 text-gray-400 mr-2" />}
                                className="w-full px-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all sm:text-sm h-auto"
                                placeholder="••••••••"
                            />
                        </Form.Item>

                        <div className="flex items-center justify-between">
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox className="text-sm text-gray-600">Remember me</Checkbox>
                            </Form.Item>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-sky-600 hover:text-sky-500 transition-colors">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <Form.Item className="mb-0">
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                className="w-full h-12 flex justify-center items-center gap-2 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-sky-500 hover:bg-sky-600 focus:outline-none transition-all active:scale-[0.98]"
                            >
                                {!loading && <span>Sign in</span>}
                                {!loading && <ArrowRight className="h-4 w-4" />}
                            </Button>
                        </Form.Item>

                        {error && (
                            <p className="text-red-500 text-sm text-center mt-2 font-medium">
                                {error}
                            </p>
                        )}

                        <p className="mt-4 text-center text-sm text-gray-600 already-account" >
                            Don't have an account?{' '}
                            <Link to="/signup" className="font-semibold text-sky-600 hover:text-sky-500 transition-colors">
                                Sign up
                            </Link>
                        </p>
                    </Form>
                </div>
            </div>
        </div>
    );
}

