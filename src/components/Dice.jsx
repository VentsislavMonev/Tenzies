export default function Dice(props)
{
    return (
        <img src={props.svg} alt="{`Die face showing ${props.value}`}"
        onClick={()=> props.hold(props.id)} 
        className={`die ${props.clicked && 'clicked'}`}
        aria-label={`Die with value ${props.value}, ${props.isHeld ? "held" : "not held"}`} />
    )
}