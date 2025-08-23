import { auth } from '../config/firebase';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    updateProfile,
    type UserCredential
} from 'firebase/auth';



// --- Firebase Auth Service ---
export const authService = {
    login: async (email: string, pass: string): Promise<User> => {
        const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, pass);
        const { displayName, email: userEmail } = userCredential.user;
        return { name: displayName, email: userEmail };
    },
    signUp: async (name: string, email: string, pass: string): Promise<User> => {
        const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(userCredential.user, { displayName: name });
        const { email: userEmail } = userCredential.user;
        return { name, email: userEmail };
    },
    logout: (): Promise<void> => {
        return signOut(auth);
    },
};