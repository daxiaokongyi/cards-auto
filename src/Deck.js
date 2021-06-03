import React, {useState, useEffect, useRef} from 'react';
import Card from './Card';
import axios from 'axios';
import './Deck.css'

const API_BASE_URL = "https://deckofcardsapi.com/api/deck/";

const Deck = () => {
    const [deck, setDeck] = useState(null);
    const [drawn, setDrawn] = useState([]);
    const [autoDraw, setAutoDraw] = useState(false);
    const timerRef = useRef;

    useEffect(() => {
        let getDeck = async () => {
            let deckRes = await axios.get(`${API_BASE_URL}/new/shuffle`);
            setDeck(deckRes.data);
        }
        getDeck();
    }, [setDeck]);

    useEffect(() => {        
        const getCard = async () => {
            // automatically draw cards
            let {deck_id} = deck;
            
            try {
                // get card's info 
                let drawResult = await axios.get(`${API_BASE_URL}/${deck_id}/draw`);

                if (drawResult.data.remaining === 0) {
                    setAutoDraw(false);
                    throw new Error ("No More Cards!");
                }

                let currentCard = drawResult.data.cards[0];

                setDrawn(drawn => 
                    [...drawn, {
                        id: currentCard.code,
                        name: currentCard.suit + " " + currentCard.value,
                        image: currentCard.image
                        }
                    ]
                );
            } catch (error) {
                alert(error);
            }
        }

        if (autoDraw && !timerRef.current) {
            timerRef.current = setInterval(async () => {await getCard();}, 1000);
        }

        return () => {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, [autoDraw, setAutoDraw, deck]);

    // setup cards component
    const cards = drawn.map(each => <Card key = {each.id} name = {each.name} image = {each.image}/>);

    // set function of toggle
    const handleToggle = () => {
        setAutoDraw(auto => !auto);
    }

    return (
        <div className="Deck">
            {deck ? (
                    <button className="Deck-gimme" onClick={handleToggle}>{autoDraw ? "Stop" : "Keep"} drawing for me</button>
            ) : null}
            <div className="Deck-cardarea">{cards}</div>
        </div>
    );
}

export default Deck;