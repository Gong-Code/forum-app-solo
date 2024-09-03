'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { Thread } from '../types/thread';
import { getAllThreads, getThreadById } from '@/lib/thread.db';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatCategoryforURL } from '@/lib/formatCategory';
import { FaLock } from 'react-icons/fa';
import Loading from './Loading';

export const LatestThreads = () => {
    const [threads, setThreads] = useState<Thread[]>([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const fetchThreads = async () => {
            try {
                const data: Thread[] = await getAllThreads();
                setThreads(data);
            } catch (error) {
                console.error('Error fetching threads:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchThreads();
    }, []);

    if (loading) return <Loading />;

    const handleRowClick = async (threadId: string, category: string) => {
        try {
            const thread = await getThreadById(threadId);
            if (thread) {
                const formattedCategory = formatCategoryforURL(category);
                router.push(`/threads/${formattedCategory}/${threadId}`);
            } else {
                console.error('Thread not found');
            }
        } catch (error) {
            console.error('Error fetching thread:', error);
        }
    };

    return (
        <div className='mx-auto w-full pl-12 px-6 my-8 max-w-6xl'>
            <Table className='border dark:border-muted'>
                <TableHeader>
                    <TableRow>
                        <TableHead className='bg-secondary'>
                            Latest Threads
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {threads.length ? (
                        threads.map((thread) => (
                            <TableRow
                                key={thread.id}
                                onClick={() =>
                                    handleRowClick(thread.id, thread.category)
                                }
                                className='cursor-pointer dark:bg-muted/50'>
                                <TableCell>
                                    <div className='flex justify-between items-center'>
                                        <span className='truncate'>
                                            {thread.title}
                                        </span>
                                        <div className='flex items-center gap-2'>
                                            {thread.isQnA && (
                                                <Badge variant='qna'>Q&A</Badge>
                                            )}
                                            {thread.isLocked && (
                                                <Badge variant='destructive'>
                                                    <FaLock className='h-3 w-3 my-[0.2rem] mx-1' />
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className='flex gap-1 mt-1 items-center'>
                                        <span className='text-xs text-muted-foreground'>
                                            in
                                        </span>
                                        <span className='text-xs hover:underline cursor-pointer'>
                                            {thread.category}
                                        </span>
                                    </div>
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
    );
};
