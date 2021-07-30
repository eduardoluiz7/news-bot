import { useHistory } from 'react-router-dom';

import '../styles/auth.scss';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { FormEvent, useState } from 'react';

export function Home(){
    const history = useHistory();
    const { signIn } = useAuth();
    const [ pin, setPin] = useState('');

    function handleLogin(event: FormEvent){
        event.preventDefault();

        if(pin.trim() === ''){
            return;
        }

        try{
            signIn(pin);
            history.push('/admin')
        
        }catch(err){
            alert('PIN inválido!')
        }

    }

    return (
        <>
            <div id="page-auth">
            <aside>
                <strong>Gerencie Notícias</strong>
                <p>Adicione, remova e edite notícias do news bot</p>
            </aside>
            <main>
                <div className='main-content'>
                    <h1>News Bot</h1>
                    <div className='separator'></div>
                    <form onSubmit={handleLogin}>
                        <input 
                            type="password"
                            placeholder="Digite o PIN de segurança"
                            onChange={event => setPin(event.target.value)}
                            value={pin}
                            autoComplete="off"
                        />
                        <Button type="submit">
                            Entrar
                        </Button>
                    </form>
                </div>
            </main>
        </div>
        </>
    );
}