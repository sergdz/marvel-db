import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useMarvelService from '../../services/MarvelServices';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './SingleComicPage.scss';

const SingleComicPage = () => {

    const { comicId } = useParams();
    const [comic, setComic] = useState(null)
    const { loading, error, getComic, clearError } = useMarvelService();

    useEffect(() => {
        updateComic()
    }, [comicId]);


    const updateComic = () => {
        clearError()
        getComic(comicId)
            .then(onComicLoaded)


    }

    const onComicLoaded = (comic) => {
        let { description } = comic
        if (!description) {
            description = 'К сожалению данные о персонаже отсутствуют. Перейдите на официальный сайт';

        } else if (description.length > 200) {
            description = `${description.substring(0, 200)}...`
        }

        setComic(comic)
    }


    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error || !comic) ? <View comic={comic} /> : null;

    return (
        <>
            {errorMessage}
            {spinner}
            {content}
        </>
    )
}

const View = ({ comic }) => {


    const { title, description, pageCount, thumbnail, language, price } = comic
    const navigate = useNavigate()
    const back = () => navigate(-1)
    return (
        <div className="single-comic">
            <img src={thumbnail} alt={title} className="single-comic__img" />
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">{pageCount}</p>
                <p className="single-comic__descr">Language: {language}</p>
                <div className="single-comic__price">{price}</div>
            </div>
            <div
                onClick={back}
                className="single-comic__back">
                Back to all
            </div>
        </div>
    )
}

export default SingleComicPage;