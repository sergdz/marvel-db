import { useHttp } from "../hooks/http.hook";


const  useMarvelService = () =>  {
    const {loading, request, error, clearError} = useHttp();



    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=692574fa6a73ec0b530adcca79cd0f4f';
    const _baseOffset = 210;
    const _limit = 8;



     const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }


    const getCharacters = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0])

    }

    const getComicsList =  async (limit = _limit) => {
        const res = await request(`${_apiBase}comics?orderBy=issueNumber&limit=${limit}&${_apiKey}`)
        return res.data.results.map(_transformComics)
    }


    const _transformCharacter = (char) => {

        return {
            id: char.id,
            name: char.name,
            description: char.description,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comicsList: char.comics.items


        }
    }
    const _transformComics = (char) => {

        return {
            id: char.id,
            title: char.title,
            price: char.prices[0].price,
            urls: char.urls[0].url,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,

        }
    }

    return {loading,clearError, error, getAllCharacters, getCharacters, getComicsList }
}

export default useMarvelService;