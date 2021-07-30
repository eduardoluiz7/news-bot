import { FormEvent, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

import '../styles/admin.scss'

export function Admin(){
    const history = useHistory();
    const { signOut } = useAuth();
    const [novaNoticia, setNovaNoticia] = useState(false);
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [urlImage, setUrlImage] = useState('');
    const [link, setLink] = useState('');
    const [tema, setTema] = useState('');

    function handleLogout(){
        signOut();
        history.push('/')
    }

    async function handleSendNew(event: FormEvent){
        event.preventDefault();
        var noticia = {
            titulo,
            descricao,
            urlImage,
            link,
            tema
        }

        const noticiaRef = database.ref('noticias');
        const firebaseNoticia = await noticiaRef.push(noticia);
        
        console.log(firebaseNoticia.key);
        setNovaNoticia(false);
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

                {!novaNoticia ? (<Button onClick={()=>setNovaNoticia(true)}>Nova notícia</Button>) : 
                    (<form onSubmit={handleSendNew}>
                        <input 
                            placeholder="Titulo da notícia"
                            onChange={event => setTitulo(event.target.value)}
                            value={titulo} />
                        <input 
                            placeholder="Link da notícia"
                            onChange={event => setLink(event.target.value)}
                            value={link}
                                 />
                        <input 
                            placeholder="URL da Imagem"
                            onChange={event => setUrlImage(event.target.value)}
                            value={urlImage}
                            />
                        <input 
                            placeholder="Tema"
                            onChange={event => setTema(event.target.value)}
                            value={tema}
                            />
                        <textarea 
                            placeholder="Descrição"
                            onChange={event => setDescricao(event.target.value)}
                            value={descricao}
                            ></textarea>

                        <div className="form-footer">
                            <Button type="submit">Pronto</Button>
                        </div>
                    </form>)
                }
                <div className="news-list">


                </div>
            </main>
        </div>
        </>
    );
}