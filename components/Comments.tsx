import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { FaCheck, FaStar } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { MarkedAsAnswered } from './MarkedAsAnswered';
import { timeDifference } from '@/lib/relativeDateTime';
import { FaCircleUser } from 'react-icons/fa6';
import { useAuth } from '../app/providers/authProvider';
import { useComments } from '@/app/contexts/CommentsContext';

type CommentsProps = {
    isQnA: boolean;
    isLocked: boolean;
};

export const Comments: React.FC<CommentsProps> = ({ isQnA, isLocked }) => {
    const {
        comments,
        answeredComment,
        answeredCommentId,
        handleMarkAsAnswered,
    } = useComments();

    const { user: currentUser } = useAuth();
    const router = useRouter();

    return (
        <>
            {isQnA && answeredComment && (
                <MarkedAsAnswered
                    key={answeredComment.commentId}
                    comment={answeredComment}
                />
            )}

            <Table className='border dark:border-muted mt-3'>
                <TableHeader>
                    <TableRow>
                        <TableHead className='bg-secondary'>Comments</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className='bg-primary-foreground'>
                    {comments.length === 0 && (
                        <TableRow>
                            <TableCell>
                                <div className='flex py-8 items-center justify-center gap-2 font-medium text-secondary-foreground/30'>
                                    No comments yet! Be the first to comment on
                                    this thread.
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                    {comments.map((comment, index) => {
                        const isAnswered = comment.commentId === answeredCommentId;
                        return (
                            <TableRow
                                key={comment.commentId || index}
                                className='dark:bg-muted/50'>
                                <TableCell>
                                    <div className='block p-3 w-full rounded-sm bg-background outline outline-1 outline-white shadow-sm shadow-slate-300 dark:bg-muted dark:outline-white/10 dark:shadow-none'>
                                        {comment.content}
                                    </div>
                                    <div className='flex items-center justify-between'>
                                        <div className='flex flex-col gap-1 px-2 pt-4 pb-1'>
                                            <span className='flex gap-1 items-center'>
                                                <FaCircleUser className='text-muted-foreground' />
                                                <span className='text-xs font-semibold'>
                                                    {comment.creator?.username}
                                                </span>
                                                {comment.creator?.isModerator && (
                                                    <FaStar className='text-yellow-500' />
                                                )}
                                            </span>
                                            <span className='text-xs text-muted-foreground'>
                                                {timeDifference(
                                                    new Date(),
                                                    new Date(
                                                        comment.creationDate.toDate()
                                                    )
                                                )}
                                            </span>
                                        </div>
                                        <div>
                                            {isQnA &&
                                                (isAnswered ? (
                                                    <span
                                                        className={`flex items-center ${
                                                            isLocked
                                                                ? 'text-green-600/70'
                                                                : 'text-green-600'
                                                        }`}>
                                                        <FaCheck className='mr-2' />
                                                        Answered
                                                    </span>
                                                ) : (
                                                    <button
                                                        className={`flex items-center ${
                                                            isLocked
                                                                ? 'text-gray-400 dark:text-primary/20'
                                                                : 'text-gray-600 dark:text-muted-foreground'
                                                        }`}
                                                        onClick={() => {
                                                            if (currentUser) {
                                                                handleMarkAsAnswered(
                                                                    comment.commentId
                                                                );
                                                            } else {
                                                                router.push(
                                                                    '/log-in'
                                                                );
                                                                toast.error(
                                                                    'You need to log in to mark a comment as answered.'
                                                                );
                                                            }
                                                        }}
                                                        disabled={isLocked}>
                                                        <FaCheck className='mr-2' />
                                                        Mark as Answered
                                                    </button>
                                                ))}
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </>
    );
};
