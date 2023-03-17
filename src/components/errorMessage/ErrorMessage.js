import img from './error.gif'

const ErrorMessage = () => {
    return (
        <img style={
            {
                display: 'block',
                width: '200px',
                height: '180px',
                objectFit: 'cover',
            }
        }
        src={img}
        alt={'error'}
        />
    )
}

export default ErrorMessage