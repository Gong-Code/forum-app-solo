'use client';

import { Button } from '@/components/ui/button';
import { LatestThreads } from '../../components/LatestThreads';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../providers/authProvider';

const LandingPage = () => {
    const router = useRouter();
    const { user } = useAuth();

    const handleAddNewThreadClick = async (
        e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
        if (!user) {
            e.preventDefault();
            router.push('/log-in');
        }
    };
    return (
        <>
            <header className='bg-secondary'>
                <div className='pl-12 py-8 max-w-6xl mx-auto'>
                    <h1 className='text-base font-medium'>
                        Welcome to Threads
                    </h1>
                    <p className='text-sm text-muted-foreground'>
                        A community of developers
                    </p>
                </div>
            </header>
            <main className='mx-auto pb-5'>
                <Link
                    href='/threads/new'
                    onClick={handleAddNewThreadClick}>
                    <Button
                        className='flex items-center gap-1 mx-auto pl-12 px-6 my-8 max-w-6xl'
                        variant='outline'>
                        <Plus className='size-4' />
                        <span>Add new Thread</span>
                    </Button>
                </Link>
                <LatestThreads />
            </main>
        </>
    );
};

export default LandingPage;
