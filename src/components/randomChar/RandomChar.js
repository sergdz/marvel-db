import { Component } from 'react';
import Spinner from '../spinner/Spinner';
import MarvelService from '../../services/MarvelServices';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {

    state = {
        char: {},
        loading: true,
        error: false
    }

    marvelService = new MarvelService()


    onChatLoaded = (char) => {
        let { description } = char
        if (description === '') {
            description = 'К сожалению данные о персонаже отсутствуют. Перейдите на официальный сайт';

        } else if (description.length > 200) {
            description = `${description.substring(0, 200)}...`
        }
        this.setState
            ({
                char: { ...char, description },
                loading: false
            })
    }

    onError = () => {
        this.setState
            ({

                loading: false,
                error: true

            })
    }



    componentDidMount() {

        this.updateChar()
/*         this.timerId = setInterval(this.updateChar, 3000)
 */    }
    componentWillUnmount() {
        clearInterval(this.timerId)
    }

    updateChar = () => {

        this.setState({ error: false, loading: true });


        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000)
        this.marvelService
            .getCharacters(id)
            .then(char => this.onChatLoaded(char))
            .catch(() => this.onError())
    }



    render() {
        let { char, loading, error } = this.state
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error) ? <View char={char} /> : null;


        return (
            <div className="randomchar">
                {errorMessage}
                {spinner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br />
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button className="button button__main">
                        <div className="inner"
                            onClick={this.updateChar}
                        >try it </div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
                </div>
            </div>
        )
    }

}

const View = ({ char }) => {
    const { name, description, thumbnail, homepage, wiki } = char;

    const res = thumbnail.indexOf('image_not_available')


    return (
        <div className="randomchar__block">
            <img src={thumbnail} style={res !== -1 ? { objectFit: 'contain' } : { objectFit: 'cover' }} alt={name} className="randomchar__img" />
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;