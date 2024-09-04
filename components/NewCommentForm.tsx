'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useController } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Comment } from '../app/types/thread';
import { addCommentToThread } from '@/lib/thread.db';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { Timestamp } from 'firebase/firestore';
import { useAuth } from '../app/providers/authProvider';
import { Textarea } from '@/components/ui/textarea';
import { GoCommentDiscussion } from 'react-icons/go';
import { Badge } from '@/components/ui/badge';
import { RiRadioButtonLine } from 'react-icons/ri';

type NewCommentFormProps = {
    id: string;
    onCommentSubmit: (comment: Comment) => void;
};

export const NewCommentForm: React.FC<NewCommentFormProps> = ({
    id,
    onCommentSubmit,
}) => {
    const { user: currentUser } = useAuth();

    const FormSchema = z.object({
        commentBody: z.string().min(2, {
            message: 'Comment body must be at least 2 characters.',
        }),
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            commentBody: '',
        },
    });

    const { field } = useController({
        name: 'commentBody',
        control: form.control,
        defaultValue: '',
    });

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        if (!currentUser) {
            toast.error('You must be logged in to write a comment.');
            return;
        }

        try {
            const newComment: Comment = {
                id: uuidv4(),
                content: data.commentBody,
                creationDate: Timestamp.now(),
                creator: {
                    id: currentUser.id,
                    username: currentUser.username,
                    email: currentUser.email,
                    name: currentUser.name || '',
                },
            };

            await addCommentToThread(id, newComment);

            form.reset();
            onCommentSubmit(newComment);
            return newComment;
        } catch (error) {
            toast.error('Failed to add comment.');
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4 my-4'>
                <FormItem>
                    <FormLabel>
                        <div className='flex gap-1 items-center pb-4'>
                            <Badge
                                variant='secondary'
                                className='rounded-full p-3'>
                                <GoCommentDiscussion className='size-5' />
                            </Badge>
                            <p className='text-xl ml-1 font-semibold text-foreground/70'>
                                Comment
                            </p>
                        </div>
                    </FormLabel>
                    <FormControl>
                        <Textarea
                            placeholder='Write your message...'
                            className='px-4 py-3 h-[140px] resize-none'
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                <Button
                    type='submit'
                    className='px-6 flex gap-2 items-center'>
                    <RiRadioButtonLine className='animate-pulse' />{' '}
                    <span>Add comment</span>
                </Button>
            </form>
        </Form>
    );
};
