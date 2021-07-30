import { useHistory } from 'react-router-dom';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';

import '../styles/admin.scss'

export function Admin(){
    const history = useHistory();
    const { signOut } = useAuth();

    function handleLogout(){
        signOut();
        history.push('/')
    }


    return (
        <>
            <div id="page-admin">
            <header>
                <div className="content">
                    <h3>News Bot</h3>
                    <button onClick={handleLogout}>Sair</button>
                </div>
            </header>
            <main>
                <div className="page-title">
                    <h1>Painel de Gerencia</h1>
                </div>

                <form >
                    <input placeholder="Titulo da notícia" />
                    <input placeholder="Link da notícia" />
                    <input placeholder="URL da Imagem" />
                    <input placeholder="Tema" />
                    <textarea placeholder="Descrição"></textarea>

                    <div className="form-footer">
                        <Button type="submit">Adicionar notícia</Button>
                    </div>
                </form>
                
                <div className="news-list">


                </div>
            </main>
        </div>
        </>
    );
}