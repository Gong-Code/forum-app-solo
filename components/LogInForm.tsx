'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { useAuth } from '../app/providers/authProvider';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MdErrorOutline } from 'react-icons/md';

type LoginFormValues = {
    email: string;
    password: string;
};

const formSchema = z.object({
    email: z.string().email({ message: 'You need to enter a valid email' }),
    password: z.string().min(1, { message: 'You need to enter a password' }),
});

export const LoginForm = () => {
    const { login } = useAuth();
    const router = useRouter();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    function onSubmit(values: LoginFormValues) {
        login(values);
        router.push('/');
    }

    return (
        <Card className='mx-auto max-w-sm'>
            <CardHeader>
                <CardTitle className='text-2xl'>Login</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent>
                    <div className='grid gap-6'>
                        <div className='grid gap-2'>
                            <Label htmlFor='email'>Email</Label>
                            <Input
                                id='email'
                                type='email'
                                placeholder='m@example.com'
                                required
                                {...form.register('email')}
                            />
                            {form.formState.errors.email && (
                                <span className='text-error text-xs mt-[2px] flex gap-1 items-center'>
                                    <MdErrorOutline />
                                    <span className='text-xs'>
                                        {form.formState.errors.email.message}
                                    </span>
                                </span>
                            )}
                        </div>
                        <div className='grid gap-2'>
                            <Label htmlFor='password'>Password</Label>
                            <Input
                                id='password'
                                type='password'
                                required
                                {...form.register('password')}
                            />
                            {form.formState.errors.password && (
                                <span className='text-error text-xs mt-[2px] flex gap-1 items-center'>
                                    <MdErrorOutline />
                                    <span className='text-xs'>
                                        {form.formState.errors.password.message}
                                    </span>
                                </span>
                            )}
                        </div>
                        <Button
                            type='submit'
                            className='w-full'>
                            Login
                        </Button>
                    </div>
                    <div className='mt-4 text-center text-sm'>
                        Don&apos;t have an account?{' '}
                        <Link
                            href='/sign-up'
                            className='underline'>
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </form>
        </Card>
    );
};
