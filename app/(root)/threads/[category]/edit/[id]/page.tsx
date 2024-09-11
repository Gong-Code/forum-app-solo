"use client"

import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/app/providers/authProvider';
import { User } from '@/app/types/user';
import { useParams, useRouter } from 'next/navigation';
import { TagType, ThreadCategory, ThreadTag } from '@/app/types/thread';
import { useForm } from 'react-hook-form';
import { getThreadById, editThread } from '@/lib/thread.db';
import toast from 'react-hot-toast';
import Loading from '@/components/Loading';
import { Form, FormField, FormItem, FormLabel, FormDescription, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ComboBox } from '@/components/SelectCategoryNewThread';
import { Button } from '@/components/ui/button';
import { ThreadSchema } from '@/lib/schemas';
import { TagComboBox } from '@/components/SelectTagNewThread';


type Param = {
    id: string;
};

const EditThread = () => {
    const router = useRouter();
    const { user: currentUser } = useAuth() as { user: User | null };
    const [loading, setLoading] = useState(true);
    const { id } = useParams() as Param;
    const [threadData, setThreadData] = useState<z.infer<typeof ThreadSchema> | null>(null);

    const form = useForm<z.infer<typeof ThreadSchema>>({
        resolver: zodResolver(ThreadSchema),
        defaultValues: {
            title: '',
            description: '',
            threadCategory: '',
            isQnA: false,
            tags: [] as ThreadTag[]
        } as z.infer<typeof ThreadSchema>,
    });

    const fetchThread = async () => {
        if (!id) return;

        try {
            const fetchedThread = await getThreadById(id);
            if (!fetchedThread) {
                console.log('No thread found with the given ID');
                router.push('/404');
                return;
            }

            if (!currentUser) {
                toast.error('You must be logged in to edit a thread.');
                router.push('/login');
                return;
            }

            if (fetchedThread.creator.id !== currentUser.id && !currentUser.isModerator) {
                toast.error('You do not have permission to edit this thread.');
                router.push(`/`);
                return;
            }

            // Map over the fetchedThread.tags array and transform each tag into a new format.
            // The new format includes threadTagId and tagType, where tagType is asserted to be one of the specified string values.
            // The result is cast to a specific TypeScript type: [ThreadTag, ...ThreadTag[]], ensuring the array contains at least one ThreadTag object.

            const mappedTags: [ThreadTag, ...ThreadTag[]] = fetchedThread.tags.map(tag => ({
                threadTagId: tag.threadTagId,
                tagType: tag.tagType as "WEB DEVELOPMENT" | "MOBILE DEVELOPMENT" | "DATA SCIENCE" | "MACHINE LEARNING" | "DEVOPS" | "UI/UX DESIGN" | "CYBERSECURITY" | "CLOUD COMPUTING" | "GAME DEVELOPMENT" | "DATABASES"
            })) as [ThreadTag, ...ThreadTag[]];
    
            form.setValue('title', fetchedThread.title);
            form.setValue('description', fetchedThread.description);
            form.setValue('threadCategory', fetchedThread.category);
            form.setValue('isQnA', fetchedThread.isQnA);
            form.setValue('tags', mappedTags);
    
            setThreadData({
                title: fetchedThread.title,
                description: fetchedThread.description,
                threadCategory: fetchedThread.category,
                isQnA: fetchedThread.isQnA,
                tags: mappedTags
            });
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching thread data:', error);
            toast.error('Failed to fetch thread data.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchThread();
    }, [id, router, currentUser, form]);

    const onSubmit = async (data: z.infer<typeof ThreadSchema>) => {
        if (!currentUser) {
            toast.error('You must be logged in to edit a thread.');
            return;
        }
    
        try {
            const updatedThread = await editThread(id, currentUser, data);
    
            if (updatedThread) {
                const mappedTags: [ThreadTag, ...ThreadTag[]] = updatedThread.tags.map(tag => ({
                    threadTagId: tag.threadTagId,
                    tagType: tag.tagType as "WEB DEVELOPMENT" | "MOBILE DEVELOPMENT" | "DATA SCIENCE" | "MACHINE LEARNING" | "DEVOPS" | "UI/UX DESIGN" | "CYBERSECURITY" | "CLOUD COMPUTING" | "GAME DEVELOPMENT" | "DATABASES"
                })) as [ThreadTag, ...ThreadTag[]];
    
                console.log('Updated thread:', updatedThread);
                setThreadData({
                    title: updatedThread.title,
                    description: updatedThread.description,
                    threadCategory: updatedThread.category,
                    isQnA: updatedThread.isQnA,
                    tags: mappedTags
                });
                router.push(`/`);
            }
        } catch (error) {
            console.error('Error updating thread:', error);
            toast.error('Failed to update thread.');
        }
    };

    if (loading) return <Loading />;

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='mx-auto w-2/3 space-y-4 pl-12 py-12 max-w-3xl'>
                <FormField
                    control={form.control}
                    name='title'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-xl'>
                                Edit Thread
                            </FormLabel>
                            <FormDescription className='pb-6'>
                                Please provide a title, body, and its corresponding category for your thread.
                            </FormDescription>
                            <FormControl>
                                <Input
                                    placeholder='Title'
                                    className='resize-none'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea
                                    placeholder='Body'
                                    rows={5}
                                    className='resize-none'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='isQnA'
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className='flex items-center'>
                                    <Checkbox
                                        id='isQnA'
                                        checked={field.value || false}
                                        onCheckedChange={(checked) => {
                                            field.onChange(checked);
                                        }}
                                    />
                                    <Label
                                        htmlFor='isQnA'
                                        className='ml-2 cursor-pointer'>
                                        Q&A
                                    </Label>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className='flex items-center justify-between'>
                    <FormField
                        control={form.control}
                        name='threadCategory'
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <ComboBox
                                        value={field.value as ThreadCategory}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='tags'
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <TagComboBox
                                        value={field.value as ThreadTag[]}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        type='submit'
                        className='px-8'>
                        Save
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default EditThread;