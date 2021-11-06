
const PairList = ({pairs }) => {

    return ( 
        <div className="pair-list">
            {pairs.map((pair)=>(
                <div className="pair-preview" key={pair.id}>
                        <h2>{pair.title}</h2>
                </div>
            ))}
        </div>
    );
}
 
export default PairList;