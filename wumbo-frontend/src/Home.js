import PairList from "./PairList";
import useFetch from "./useFetch";

const Home = () => {



    
    const {data: pairs, isPending, error} = useFetch("http://localhost:8000/pairs")


    return ( 
        <div className="home">
            { error && <div>{error}</div>}
            { isPending && <div> Loading... </div>}
            {pairs && <PairList pairs={pairs}/>}
        </div>
     );
}
 
export default Home;