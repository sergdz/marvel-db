import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './comicsList.scss';
import useMarvelService from '../../services/MarvelServices';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import uw from '../../resources/img/UW.png';
import xMen from '../../resources/img/x-men.png';

const ComicsList = () => {


    const id = useParams()
    const { loading, error, getComicsList} = useMarvelService()
    const [comicsList, setComicsList] = useState([])
    const [limitComics, setLimitComics] = useState(8)
    const [comicsEnd, setComicsEnd] = useState(false)

console.log(id);

    useEffect(() => {

        onRequest(limitComics)
    }, [])

    const onRequest = (limitComics) => {
        getComicsList(limitComics).then(newComicsList)
    }

    const newComicsList = (comicsList) => {
        let end = false
        if (comicsList.length >= 32 ) {
            end = true

        }
        setComicsEnd(comicsEnd => end)
        setLimitComics(limitComics => limitComics + 8)
        setComicsList(comicsList)
    }


console.log(comicsList);
    const content = comicsList.map((item) => (
        <li className="comics__item" key={item.id}>
            <Link to={`/comics/${item.id}`}>
                <img src={item.thumbnail} alt={item.title} className="comics__item-img" />
                <div className="comics__item-name">{item.title}</div>
                <div className="comics__item-price">{item.price ? `${item.price}$` : 'Цена не указана'}</div>
            </Link>
        </li>
    ));

    const spinner =  loading ? <Spinner/> : null
    const errorMessage = error ? <ErrorMessage/> : null







    return (
        <div className="comics__list">

            <ul className="comics__grid">

                {content}
                {errorMessage}



            </ul>
             {spinner}
            <button
            onClick={() => onRequest(limitComics)}
            style={{'display': comicsEnd  ? 'none' : 'block'}}
            className="button button__main button__long">
                <div  className="inner">load more</div>
            </button>

        </div>
    )
}

export default ComicsList;