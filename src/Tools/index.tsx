import './style.css'

type Props = {
    onRectangle: () => void;
    onCircle: () => void;
}

export const Tools = ({ onRectangle, onCircle }: Props) => {
    return (
        <div className="tools">
            <button
                onClick={() => {
                    onRectangle();
                }}
            >
                Rectangle
            </button>
            <button
                onClick={() => {
                    onCircle();
                }}
            >
                Circle
            </button>
        </div>
    )
}