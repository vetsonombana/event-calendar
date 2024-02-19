import "./Time.css";

const Time = ()=>{
    return (<div className="time-panel">
        { Array.from({length: 13}, (_, i) => i + 9).map((element)=>{
            return <div className="hour" key={element} > {element} </div>
        }) }
    </div>);
}

export default Time;
