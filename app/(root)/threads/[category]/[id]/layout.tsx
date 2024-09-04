import CommentsProvider from '@/app/contexts/CommentsContext';

const ThreadLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <CommentsProvider>
            {children}
        </CommentsProvider>
    );
};

export default ThreadLayout;