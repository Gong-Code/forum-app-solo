'use client';

import { ThreadsByCategory } from '@/components/ThreadsByCategory';
import { ThreadCategory } from '@/app/types/thread';
import { useParams } from 'next/navigation';

const CategoryPage = () => {
    const { category } = useParams();
    console.log('Current category ID:', category);
    return <ThreadsByCategory currentCategory={category as ThreadCategory} />;
};

export default CategoryPage;
