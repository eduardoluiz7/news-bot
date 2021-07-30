import { FormEvent, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

import '../styles/admin.scss'

type FirebaseNoticias = Record<string,{
    titulo: string;
    descricao: string;
    urlImage: string;
    link: string;
    tema: string;
}>

type NoticiaType = {
    id: string;
    titulo: string;
    descricao: string;
    urlImage: string;
    link: string;
    tema: string;
}

export function Admin(){
    const history = useHistory();
    const { signOut, user } = useAuth();
    const [novaNoticia, setNovaNoticia] = useState(false);
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [urlImage, setUrlImage] = useState('');
    const [link, setLink] = useState('');
    const [tema, setTema] = useState('');
    const [noticias, setNoticias] = useState<NoticiaType[]>([]);

    function handleLogout(){
        signOut();
        history.push('/')
    }

    useEffect(()=>{
        const noticiasRef = database.ref(`noticias`);
        noticiasRef.on('value', noticia =>{
        const databaseNoticias = noticia.val();
        const firebaseNoticias: FirebaseNoticias = databaseNoticias  ?? {};

        const parsedNoticias = Object.entries(firebaseNoticias).map(([key, value]) => {
            return {
                id: key,
                titulo: value.titulo,
                descricao: value.descricao,
                urlImage: value.urlImage,
                link: value.link,
                tema: value.tema
            }
        });

        setNoticias(parsedNoticias);
        })

        return ()=>{
            noticiasRef.off('value');
        }
    }, [user?.name]);


    function clearForm(){
        setTitulo('');
        setDescricao('');
        setTema('');
        setLink('');
        setUrlImage('')
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
        clearForm();
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
                            <Button type="button" isOutlined={true} onClick={()=>setNovaNoticia(false)} >Fechar</Button>
                        </div>
                    </form>)
                }
                <div className="news-list">
                {noticias.map(noticia =>{
                    return(
                        <h5 key={noticia.id}>{noticia.titulo}</h5>
                    )
                })}

                </div>
            </main>
        </div>
        </>
    );
}