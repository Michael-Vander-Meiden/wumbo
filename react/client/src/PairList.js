
import React, {Component} from "react";


const PairList = ({pairs }) => {

    const handleClick = () => {
        console.log("web3 happens here");

    }

    return ( 
        <div className="pair-list">
            <h1>Get optimal interest rates</h1>
            {pairs.map((pair)=>(
                <div className="pair-preview" key={pair.id}>
                        <h2>{pair.title}</h2>
                <div>
                    <button onClick={handleClick}>leverage</button>
                </div>
                </div>

            ))}
        </div>
    );
}
 
export default PairList;