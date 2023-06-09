import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import { Link, NavLink, useParams } from 'react-router-dom';
import useMarvelService from '../../services/MarvelServices';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton'
import './charInfo.scss';

const CharInfo = (props) => {

    const [char, setChar] = useState(null)

    const { loading, error, getCharacters, clearError } = useMarvelService()

    useEffect(() => {
        updateChar()
    }, [props.charId]);






    const updateChar = () => {
        const { charId } = props
        if (!charId) {
            return;
        }

        clearError()

        getCharacters(charId)
            .then(onChatLoaded)


    }

    const onChatLoaded = (char) => {
        let { description } = char
        if (description === '') {
            description = 'К сожалению данные о персонаже отсутствуют. Перейдите на официальный сайт';

        } else if (description.length > 200) {
            description = `${description.substring(0, 200)}...`
        }

        setChar({ ...char, description })
    }





    const skeleton = char || loading || error ? null : <Skeleton />
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error || !char) ? <View char={char} /> : null;

    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    )

}

const View = ({ char }) => {
    const { name, thumbnail, homepage, wiki, description, comicsList } = char

    const comics = comicsList.map((comic, i) => {
        const id = comic.resourceURI.slice(43)
        return (
            <li key={id} className="char__comics-item">
                <Link to={`/comics/${id}`}>
                {comic.name}
                </Link>

            </li>
        );
    });

    const comicsNull = <li className="char__comics-item"> Комиксы отсутствуют </li>

    console.log('render');

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={char.thumbnail.indexOf('image_not_available') !== -1 ? { objectFit: 'contain' } : { objectFit: 'cover' }} />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">{description} </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length === 0 ? comicsNull : comics}

            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;