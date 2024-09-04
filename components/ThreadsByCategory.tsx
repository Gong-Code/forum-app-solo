'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Thread, ThreadCategory } from '../app/types/thread';
import { getAllThreads } from '@/lib/thread.db';
import { useState, useEffect } from 'react';
import { formatCategory } from '@/lib/formatCategory';
import Link from 'next/link';
import Loading from './Loading';

type ThreadsByCategoryProps = {
    currentCategory: ThreadCategory;
};

export const ThreadsByCategory = ({
    currentCategory,
}: ThreadsByCategoryProps) => {
    const category = formatCategory(currentCategory);

    const [threads, setThreads] = useState<Thread[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchThreads = async () => {
            try {
                const allThreads = await getAllThreads();
                const filteredThreads = allThreads.filter(
                    (thread) => thread.category === category
                );
                setThreads(filteredThreads);
            } catch (error) {
                console.error('Error fetching threads:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchThreads();
    }, [category]);

    if (loading) return <Loading />;

    return (
        <div className='mx-auto pl-12 px-6 my-8 max-w-6xl'>
            <div className='rounded-md border'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <span>Threads in </span>
                                {category}
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {threads.length > 0 ? (
                            threads.map((thread) => (
                                <TableRow key={thread.id}>
                                    <TableCell>
                                        <Link
                                            href={`/threads/${currentCategory}/${thread.id}`}>
                                            <div className='w-[600px]'>
                                                <p className='truncate'>
                                                    {thread.title}
                                                </p>
                                                <div className='flex gap-1 mt-1'>
                                                    <p className='text-xs text-muted-foreground truncate'>
                                                        {thread.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={2}
                                    className='h-24 text-center'>
                                    No threads found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
