import React, { useState, useEffect } from 'react';

import { Thread, TagType } from '../app/types/thread';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FaLock } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import Loading from '@/components/Loading';
import { formatCategoryforURL } from '@/lib/formatCategory';
import { getAllThreads, getThreadById } from '@/lib/thread.db';
import { useRouter } from 'next/navigation';


const tags: TagType[] = [
    'WEB DEVELOPMENT',
    'MOBILE DEVELOPMENT',
    'DATA SCIENCE',
    'MACHINE LEARNING',
    'DEVOPS',
    'UI/UX DESIGN',
    'CYBERSECURITY',
    'CLOUD COMPUTING',
    'GAME DEVELOPMENT',
    'DATABASES',
];

export const LatestThreads = () => {
    const [threads, setThreads] = useState<Thread[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTag, setSelectedTag] = useState<TagType | null>(null);
    const [search, setSearch] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchThreads = async () => {
            try {
                const fetchedThreads = await getAllThreads();
                setThreads(fetchedThreads);
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

    const filteredThreads = selectedTag
        ? threads.filter(thread => thread.tags.some(tag => tag.tagType === selectedTag))
        : threads;

    const handleTagSelect = (tag: TagType) => {
        setSelectedTag(tag);
    };

    const handleResetFilter = () => {
        setSelectedTag(null);
        setSearch('');
    };

    return (
        <div className='mx-auto w-full pl-12 px-6 my-8 max-w-6xl'>
            <div className='flex justify-between items-center mb-4'>
                <div>
                    {tags
                        .filter(tag => tag.toLowerCase().includes(search.toLowerCase()))
                        .map(tag => (
                            <Button
                                key={tag}
                                onClick={() => handleTagSelect(tag)}
                                className='mr-2 mb-2'>
                                {tag}
                            </Button>
                        ))}
                </div>
                <Button onClick={handleResetFilter} variant='outline' className='ml-2'>
                    Reset Filter
                </Button>
            </div>

            <Table className='border dark:border-muted'>
                <TableHeader>
                    <TableRow>
                        <TableHead className='bg-secondary'>
                            Latest Threads
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredThreads.length ? (
                        filteredThreads.map((thread) => (
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
                                    {thread.tags.length > 0 && (
                                        <div className='flex gap-1 mt-1 items-center'>
                                            {thread.tags.map((tag) => (
                                                <Badge key={tag.threadTagId} variant='default'>
                                                    {tag.tagType}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
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

