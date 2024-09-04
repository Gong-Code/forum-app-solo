import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { FaRegCheckCircle } from 'react-icons/fa';
import { timeDifference } from '@/lib/relativeDateTime';
import { FaCircleUser } from 'react-icons/fa6';

type AnsweredCommentProps = {
    comment: {
        content: string;
        creator?: {
            username: string;
        };
        creationDate: {
            toDate: () => Date;
        };
    };
};

export const MarkedAsAnswered: React.FC<AnsweredCommentProps> = ({
    comment,
}) => {
    return (
        <Table className='rounded-md dark:border-green-600/40 border-green-600/60 border mt-6'>
            <TableHeader>
                <TableRow>
                    <TableHead
                        className='bg-secondary w-full flex items-center gap-2 text-green-600 '
                        colSpan={3}>
                        <FaRegCheckCircle />
                        <span>Marked as Answer</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody className='bg-primary-foreground'>
                <TableRow className='dark:bg-muted/50'>
                    <TableCell>
                        <div className='block p-3 w-full rounded-sm bg-background outline outline-1 outline-white shadow-sm shadow-slate-300 dark:bg-muted dark:outline-white/10 dark:shadow-none'>
                            {comment.content}
                        </div>
                        <div className='flex flex-col gap-1 px-2 pt-4 pb-1'>
                            <span className='flex gap-1 items-center'>
                                <FaCircleUser className='text-muted-foreground' />
                                <span className='text-xs font-semibold'>
                                    {comment.creator?.username}
                                </span>
                            </span>
                            <span className='text-xs text-muted-foreground'>
                                {timeDifference(
                                    new Date(),
                                    new Date(comment.creationDate.toDate())
                                )}
                            </span>
                        </div>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
};
