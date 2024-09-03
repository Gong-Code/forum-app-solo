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
import { useAuth } from '../providers/authProvider';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addNewUser } from '@/lib/user.db';
import { MdErrorOutline } from 'react-icons/md';

type SignUpFormValues = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

const formSchema = z.object({
    email: z.string().email({ message: 'You need to enter a valid email' }),
    firstName: z.string().min(1, { message: 'You need to enter a first name' }),
    lastName: z.string().min(1, { message: 'You need to enter a last name' }),
    password: z.string().min(6, {
        message: 'The password must be at least 6 characters long',
    }),
});

export const SignUpForm = () => {
    const { register } = useAuth();
    const router = useRouter();

    const form = useForm<SignUpFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
        },
    });

    const onSubmit = async (values: SignUpFormValues) => {
        try {
            const uid = await register(values);
            if (!uid) {
                throw new Error('Registration failed, no user ID returned');
            }
            await addNewUser({
                id: uid,
                username: `${values.firstName} ${values.lastName}`,
                name: '',
                email: values.email,
                password: values.password,
            });
            router.push('/');
            console.log('User added successfully');
        } catch (error) {
            console.error('Could not add user to database!', error);
        }
    };

    return (
        <Card className='mx-auto max-w-sm'>
            <CardHeader>
                <CardTitle className='text-xl'>Sign Up</CardTitle>
                <CardDescription>
                    Enter your information to create an account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className='grid gap-4'>
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='grid gap-2'>
                                <Label htmlFor='first-name'>First name</Label>
                                <Input
                                    id='first-name'
                                    placeholder='Max'
                                    required
                                    {...form.register('firstName')}
                                />
                                {form.formState.errors.firstName && (
                                    <span className='text-error text-xs mt-[2px] flex gap-1 items-center'>
                                        <MdErrorOutline />
                                        <span className='text-xs'>
                                            {
                                                form.formState.errors.firstName
                                                    .message
                                            }
                                        </span>
                                    </span>
                                )}
                            </div>
                            <div className='grid gap-2'>
                                <Label htmlFor='last-name'>Last name</Label>
                                <Input
                                    id='last-name'
                                    placeholder='Robinson'
                                    required
                                    {...form.register('lastName')}
                                />
                                {form.formState.errors.lastName && (
                                    <span className='text-error text-xs mt-[2px] flex gap-1 items-center'>
                                        <MdErrorOutline />
                                        <span className='text-xs'>
                                            {
                                                form.formState.errors.lastName
                                                    .message
                                            }
                                        </span>
                                    </span>
                                )}
                            </div>
                        </div>
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
                                        {form.formState.errors.email?.message}
                                    </span>
                                </span>
                            )}
                        </div>
                        <div className='grid gap-2'>
                            <Label htmlFor='password'>Password</Label>
                            <Input
                                id='password'
                                type='password'
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
                            Create an account
                        </Button>
                    </div>
                </form>
                <div className='mt-4 text-center text-sm'>
                    Already have an account?{' '}
                    <Link
                        href='/log-in'
                        className='underline'>
                        Sign in
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
};
