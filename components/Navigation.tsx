'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { useAuth } from '../app/providers/authProvider';
import { formatCategoryforURL } from '@/lib/formatCategory';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase.config';
import { signOut } from 'firebase/auth';
import { useState } from 'react';
import Loading from './Loading';
import { Badge } from '@/components/ui/badge';
import { ModeToggle } from './ModeToggle';

const threadCategories: { title: string; description: string }[] = [
    {
        title: 'Software Development',
        description:
            'Discussions on programming languages, development tools, and best practices.',
    },
    {
        title: 'Networking & Security',
        description:
            'Topics related to network configuration and protection strategies.',
    },
    {
        title: 'Hardware & Gadgets',
        description:
            'A space for sharing advice on building, upgrading, and troubleshooting hardware.',
    },
    {
        title: 'Cloud Computing',
        description:
            'Conversations about cloud platforms, services, and architecture.',
    },
    {
        title: 'Tech News & Trends',
        description:
            'Updates and discussions on the latest trends in the technology world.',
    },
];

export const Navigation = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const handleRedirect = (category: string) => {
        const formattedCategory = formatCategoryforURL(category);
        router.push(`/threads/${formattedCategory}/`);
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Could not log out', error);
        } finally {
            setLoading(false);
            router.push('/');
        }
    };

    if (loading) return <Loading />;

    return (
        <NavigationMenu className='w-full'>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <Link
                        href='/'
                        legacyBehavior
                        passHref>
                        <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}>
                            Home
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>
                        Threads by Category
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] '>
                            {threadCategories.map((threadCategory) => (
                                <ListItem
                                    key={threadCategory.title}
                                    title={threadCategory.title}
                                    className='cursor-pointer'
                                    onClick={() =>
                                        handleRedirect(threadCategory.title)
                                    }>
                                    {threadCategory.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>

            <div className='flex gap-4'>
                <ModeToggle />
                {!user ? (
                    <>
                        <Link href='/log-in'>
                            <Button variant='outline'>Log in</Button>
                        </Link>
                        <Link href='/sign-up'>
                            <Button>Sign up</Button>
                        </Link>{' '}
                    </>
                ) : (
                    <div className='flex gap-4'>
                        <Badge
                            variant='default'
                            className='text-sm font-light'>
                            {getInitials(user.username)}
                        </Badge>
                        <Link href='/'>
                            <Button onClick={handleLogout}>Log out</Button>
                        </Link>
                    </div>
                )}
            </div>
        </NavigationMenu>
    );
};

const ListItem = React.forwardRef<
    React.ElementRef<'a'>,
    React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                        className
                    )}
                    {...props}>
                    <div className='text-sm font-medium leading-none'>
                        {title}
                    </div>
                    <p className='line-clamp-2 text-xs leading-snug text-muted-foreground'>
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = 'ListItem';
