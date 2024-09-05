import { db } from '@/firebase.config';
import { setDoc, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import toast from 'react-hot-toast';
import bcrypt from 'bcryptjs';
import { User } from '@/app/types/user';

export const getAllUsers = async (): Promise<User[]> => {
    try {
        const userRef = collection(db, 'users');
        const userSnapshot = await getDocs(userRef);
        const users: User[] = userSnapshot.docs.map(doc => {
            const userData = doc.data() as User;
            return {
                id: doc.id,
                name: userData.name,
                username: userData.username,
                email: userData.email,
                password: userData.password,
                isModerator: userData.isModerator,
            };
        });

        toast.success('Users fetched successfully!');
        return users;
    } catch (error) {
        console.error('Failed to fetch users:', (error as Error).message);
        toast.error('Failed to fetch users: ' + (error as Error).message);
        return [];
    }
};

export const addNewUser = async (user: User): Promise<void> => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password || '', salt);

        const userData = {
            ...user,
            password: hashedPassword,
            isModerator: user.isModerator,
        };
        
        await setDoc(doc(db, 'users', user.id), userData);
        toast.success('User added successfully!');
    } catch (error) {
        toast.error('Failed to add user: ' + (error as Error).message);
    }
}

export const getUserById = async (userId: string): Promise<User | null> => {
    try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            toast.error('User not found');
            return null;
        }

        const userData: User = userDoc.data() as User;

        if (!userData) {
            toast.error('Failed to retrieve user data');
            return null;
        }

        const user: User = {
            id: userDoc.id,
            name: userData.name,
            username: userData.username,
            email: userData.email,
            password: userData.password,
            isModerator: userData.isModerator,
        };

        console.log('isModerator: ', user.isModerator);

        return user;
    } catch (error) {
        console.error('Failed to fetch user:', (error as Error).message);
        toast.error('Failed to fetch user: ' + (error as Error).message);
        return null;
    }
};