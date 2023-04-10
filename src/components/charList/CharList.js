import React, { Component } from 'react';
import MarvelService from '../../services/MarvelServices';
import PropTypes from 'prop-types'

import './charList.scss';

class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 1548,
        charEnded: false
    }

    marvelService = new MarvelService();




    componentDidMount() {
        this.onRequest();

    }



    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }


        this.setState(({ offset, charList }) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    render() {
        const { charList, offset, newItemLoading, charEnded } = this.state
        return (
            <div className="char__list">
                <ul className="char__grid">
                    <List onCharSelected={this.props.onCharSelected} charList={charList} />
                </ul>

                <button

                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{ 'display': charEnded ? 'none' : 'block' }}
                    onClick={() => this.onRequest(offset)}
                >
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

class List extends Component {
    state = {
        active: null
    }

    itemsRef = []

    setRef = (item) => {
        this.itemsRef.push(item)
    }

    activeChar = (id) => {

        this.itemsRef.forEach(item => item.classList.remove('char__item_selected'))
        this.itemsRef[id].classList.add('char__item_selected');
         this.itemsRef[id].focus()
         console.log(this.itemsRef[id].className);
    }


    render() {
        const { charList, onCharSelected } = this.props
        const className = "char__item"

        return charList.map((char, index) => (


            <li
                key={char.id}
                tabIndex={0}

                className={className}
                ref={this.setRef}
                onClick={(e) => {
                   this.activeChar(index)
                    onCharSelected(char.id)
                }}

                keyboardEvent={(e) => {
                    if (e.key === ' ' || e.key === "Enter") {
                        this.props.onCharSelected(char.id);
                        this.activeChar(index);
                    }
                }}>


                <img src={char.thumbnail} style={char.thumbnail.indexOf('image_not_available') !== -1 ? { objectFit: 'contain' } : { objectFit: 'cover' }} alt={char.name} />
                <div className="char__name">{char.name}</div>
            </li>
        ))
    }




}

CharList.propTypes = {
    onCharSelected: PropTypes.func
}
export default CharList;
