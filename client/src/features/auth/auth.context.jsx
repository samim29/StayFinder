import {createContext,useState} from 'react';

export const AuthContext = createContext();

/**
 * @description AuthProvider component that provides authentication context to its children.
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child components that will have access to the authentication context.
 * @return {JSX.Element} The AuthProvider component that wraps its children with the authentication context.
 */
export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    return(
        <AuthContext.Provider value={{user, setUser, loading, setLoading}}>
            {children}
        </AuthContext.Provider>
    )
}
