import { Navigation } from '../../components/Navigation';

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className='min-h-screen'>
            <Navigation />
            {children}
        </main>
    );
};
//push
export default PublicLayout;
