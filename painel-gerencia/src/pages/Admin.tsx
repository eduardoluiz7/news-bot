import { FormEvent, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import deleteImg from '../assets/images/delete.svg';
import editImg from '../assets/images/pencil.svg';

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
    const [edit, setEdit] = useState(false);
    const [editID, setEditID] = useState('');

    function handleLogout(){
        signOut();
        history.push('/')
    }

    function isDisabled(){
        return titulo === '' || link === '' || tema === '' || tema === 'Selecione um tema' 
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

        setNoticias(parsedNoticias.reverse());
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

    async function handleDeleteNoticia(noticiaId: string){
        if (window.confirm('Tem certeza que você deseja remover essa notícia?')){
            await database.ref(`/noticias/${noticiaId}`).remove();
        }
    }

    async function handleEditNoticia(noticia: NoticiaType){
        setNovaNoticia(true);
        setTitulo(noticia.titulo);
        setDescricao(noticia.descricao);
        setTema(noticia.tema);
        setLink(noticia.link);
        setUrlImage(noticia.urlImage);
        setEdit(true);
        setEditID(noticia.id);
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

        if(edit){
            database.ref('noticias/' + editID).set(noticia, (error)=>{
                if(error){
                    alert('Erro ao atualizar notícia');
                }else{
                    alert('Notícia atualizada!')
                }
            });
            clearForm();
            setNovaNoticia(false);
            setEdit(false);
            setEditID('');
        }else{
            const noticiaRef = database.ref('noticias');
            await noticiaRef.push(noticia);
            clearForm();
            setNovaNoticia(false);
            alert('Notícia adicionada!');
            }
    }

    return (
        <>
            <div id="page-admin">
            <header>
                <div className="content">
                    <h3>News Bot</h3>
                    <button title="Sair" onClick={handleLogout}>Sair</button>
                </div>
            </header>
            <main>
                <div className="page-title">
                    <h1>Painel de Gerência</h1>
                </div>

                {!novaNoticia ? (<Button title="Nova notícia" onClick={()=>setNovaNoticia(true)}>Nova notícia</Button>) : 
                    (<form onSubmit={handleSendNew}>
                        <label>{titulo === '' ? '' : 'Título' }
                            <input 
                                placeholder="Titulo da notícia"
                                onChange={event => setTitulo(event.target.value)}
                                value={titulo} />
                        </label>

                        <label>{tema === '' || tema === 'Selecione um tema' ? '' : 'Tema' }
                            <select value={tema} onChange={event => setTema(event.target.value)}>
                                <option>Selecione um tema</option>
                                <option>Esportes</option>
                                <option>Entretenimento</option>
                                <option>Política</option>
                                <option>Famosos</option>
                            </select>
                        </label>
                        <label>{descricao === '' ? '' : 'Descrição' }
                            <textarea 
                                placeholder="Descrição"
                                onChange={event => setDescricao(event.target.value)}
                                value={descricao}
                                ></textarea>
                        </label>

                        <label>{link === '' ? '' : 'Link da notícia' }
                            <input 
                                placeholder="Link da notícia"
                                onChange={event => setLink(event.target.value)}
                                value={link}
                                    />
                        </label>
                        <label> {urlImage === '' ? '' : 'Link da Imagem' }
                            <input 
                                placeholder="Link da Imagem"
                                onChange={event => setUrlImage(event.target.value)}
                                value={urlImage}
                                />
                        </label>
                        

                        <div className="form-footer">
                            <Button type="submit" title="Pronto" disabled={isDisabled()}>Pronto</Button>
                            <Button type="button" title="Fechar" isOutlined={true} onClick={()=>setNovaNoticia(false)} >Fechar</Button>
                        </div>
                    </form>)
                }
                <table>
                    <thead>
                        <tr>
                            <th>Titulo</th>
                            <th>Tema</th>
                            <th>Descrição</th>
                            <th>Link</th>
                            <th>Link da IMG</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {noticias.map(noticia =>{
                            return(
                                <tr key={noticia.id}>
                                    <th><p>{noticia.titulo}</p></th>
                                    <th><p>{noticia.tema}</p></th>
                                    <th><p>{noticia.descricao}</p></th>
                                    <th><a href={noticia.link} target="_blank" rel="noreferrer">Link da notícia</a></th>
                                    <th><a href={noticia.urlImage} target="_blank" rel="noreferrer">Link da Imagem</a></th>
                                    <th>
                                        <button title="Editar" onClick={()=> handleEditNoticia(noticia)}>
                                            <img src={editImg} alt='edit'></img>
                                        </button>
                                        <button title="Excluir" onClick={()=> handleDeleteNoticia(noticia.id)}>
                                            <img src={deleteImg} alt='delete'></img>
                                        </button>
                                    </th>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </main>
        </div>
        </>
    );
}