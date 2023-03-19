import { Component } from 'react';
import MarvelService from '../../services/MarvelServices';

import './charList.scss';

class CharList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            charList: []
        }
    }

    marvelService = new MarvelService();

    onCharters = async () => {
        const charList = await this.marvelService.getAllCharacters()
        this.setState({ charList })
    }

    componentDidMount() {

        this.onCharters()
    }

    render() {
        const { charList } = this.state
        return (
            <div className="char__list">
                <ul className="char__grid">
                    <List onCharSelected={this.props.onCharSelected} charList={charList} />
                </ul>
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

const List = ({ charList, onCharSelected }) => {
    return charList.map(char => (
        <li key={char.id} onClick={() => onCharSelected(char.id)}  className="char__item">
            <img src={char.thumbnail} style={char.thumbnail.indexOf('image_not_available') !== -1 ? { objectFit: 'contain' } : { objectFit: 'cover' }} alt={char.name} />
            <div className="char__name">{char.name}</div>
        </li>
    ))
}

export default CharList;
