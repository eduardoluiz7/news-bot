import { createContext, useState, ReactNode } from 'react';

type User = {
    name: string;
}
  
type AuthContextType = {
    user: User | undefined;
    signIn: (password: string) => void;
    signOut: ()=> void;
}

type AuthContextProviderProps = {
    children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
    const [user, setUser] = useState<User>();


    function signIn(password: string){
        if(password === '12345678'){
            setUser({name: 'Admin'})
        }else{
            console.log('pin invalido')
            throw new Error('PIN inválido');
        }
    }

    function signOut(){
        setUser(undefined);
    }


    return (
        <AuthContext.Provider value={{user, signIn, signOut}}>
            {props.children}
        </AuthContext.Provider>
    )
}