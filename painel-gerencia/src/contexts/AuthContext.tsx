import { createContext, useState, ReactNode, useEffect } from 'react';

type User = {
    name: string;
}
  
type AuthContextType = {
    user: User | undefined;
    signIn: (password: string) => void;
    signOut: ()=> void;
    isAuthenticated: ()=> boolean;
}

type AuthContextProviderProps = {
    children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
    const [user, setUser] = useState<User>();

    useEffect(()=>{
        if (!user){
            if(localStorage.length > 0){
                setUser({name: localStorage.getItem('user') as string});
            }
        }
      }, [user])

    function signIn(password: string){
        if(password === process.env.REACT_APP_USER_PIN){
            localStorage.setItem('user', 'Admin')
            setUser({name: 'Admin'})
        }else{
            console.log('pin invalido')
            throw new Error('PIN inválido');
        }
    }

    function signOut(){
        localStorage.clear();
        setUser(undefined);
    }

    function isAuthenticated(){
        var isUser = user? true : false;
        return isUser || localStorage.length > 0;
    }


    return (
        <AuthContext.Provider value={{user, signIn, signOut, isAuthenticated}}>
            {props.children}
        </AuthContext.Provider>
    )
}