import { useState, useEffect, useRef } from 'react';
import useMarvelService from '../../services/MarvelServices';
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import PropTypes from 'prop-types'
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';


import './charList.scss';
const CharList = (props) => {
    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(9);
    const [charEnded, setCharEnded] = useState(false);

    const itemsRef = useRef([]);


    const { loading, error, getAllCharacters } = useMarvelService();


    useEffect(() => {
        onRequest(offset, true);
    }, [])



    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true)
        getAllCharacters(offset)
            .then(onCharListLoaded)
    }

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended)
    }

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading && !newItemLoading ? <Spinner /> : null;

    const renderItems = (arr) => {
        let className = 'char__item'

        const activeChar = (id) => {
            itemsRef.current.forEach((item) => item.classList.remove('char__item_selected'));
            itemsRef.current[id].classList.add('char__item_selected');
            itemsRef.current[id].focus();
        };

        const items = arr.map((char, i) => (
            <CSSTransition key={char.id} timeout={5000} classNames="char__item">
                <li
                    key={char.id}
                    tabIndex={0}
                    className={className}
                    ref={(el) => (itemsRef.current[i] = el)}
                    onClick={(e) => {
                        activeChar(i);
                        props.onCharSelected(char.id);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                            props.onCharSelected(char.id);
                            activeChar(i);
                        }
                    }}
                >
                    <img
                        src={char.thumbnail}
                        style={
                            char.thumbnail.indexOf('image_not_available') !== -1
                                ? { objectFit: 'contain' }
                                : { objectFit: 'cover' }
                        }
                        alt={char.name}
                    />
                    <div className="char__name">{char.name}</div>
                </li>
            </CSSTransition>
        ));

        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {items}
                </TransitionGroup>
            </ul>
        )
    };

    const items = renderItems(charList);

    return (
        <div className="char__list">

            {errorMessage}
            {spinner}
            {items}
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{ display: charEnded ? 'none' : 'block' }}
                onClick={() => onRequest(offset)}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    );


}



CharList.propTypes = {
    onCharSelected: PropTypes.func
}
export default CharList;