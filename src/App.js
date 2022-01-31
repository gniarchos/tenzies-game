import React from 'react'
import Die from './components/Die'
import {nanoid} from 'nanoid'
import Confetti from 'react-confetti'

export default function App() {

    const [dice,setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [rolls, setRolls] = React.useState(0)
    const [timer, setTimer] = React.useState({start: getTime(), end: 0, elapsed: "0:00"})
    const [highscore, setHighscore] = React.useState({ rolls: localStorage.getItem("best_rolls"), time: localStorage.getItem("best_time")})

    var elapsed = ""
    var secs = ""

    function getTime() {
        const start = performance.now();

        return start
    }

    React.useEffect(() => {
        const end = performance.now();

        const timeDiff = (end - timer.start) / 1000;
        secs = Math.round(timeDiff);

        var days = Math.floor(secs / (3600*24));
        secs  -= days*3600*24;
        var hrs   = Math.floor(secs / 3600);
        secs  -= hrs*3600;
        var mnts = Math.floor(secs / 60);
        secs  -= mnts*60;
        // console.log(days+" days, "+hrs+" Hrs, "+mnts+" Minutes, "+secs+" Seconds");
        // console.log("Time elapsed: " + mnts + ":" + secs)
        elapsed = `${secs}`

        setTimer(oldTimer => {
            return {
                ...oldTimer,
                end: end,
                elapsed: elapsed
            }
        })

        // console.log(timer);

        

        

    }, [tenzies])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }

    function allNewDice() {
        const newDice = []

        for (let i=0; i < 10; i++)
        {
            newDice.push(generateNewDie())
        }
     
        return newDice
    }

    function holdDice(id) {
        // console.log(id)
        setDice(prevDice => prevDice.map(die => {
            return die.id === id ? 
            {...die, isHeld: !die.isHeld} : 
            die
        }))
    }

    const dieNumber = dice.map(die => 
        <Die 
            key= {die.id}
            id = {die.id}
            value = {die.value}
            isHeld = {die.isHeld}
            handleClick = {holdDice}
        />)

    function Roll() {

        if(!tenzies) 
        {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))

            setRolls(prevRolls => prevRolls = prevRolls + 1)
        } 
        else 
        {
            if (localStorage.getItem("best_rolls") > rolls)
            {
                localStorage.setItem("best_rolls", rolls)

                if (parseInt(localStorage.getItem("best_time")) > timer.elapsed)
                {
                    localStorage.setItem("best_time", timer.elapsed)
                }
                
            }
            else if (parseInt(localStorage.getItem("best_time")) > timer.elapsed)
            { 
                localStorage.setItem("best_time", timer.elapsed)

                if (localStorage.getItem("best_rolls") > rolls)
                {
                    localStorage.setItem("best_rolls", rolls)
                }
            }
            else if (localStorage.getItem("best_rolls") == null || parseInt(localStorage.getItem("best_time")) == null)
            {
                localStorage.setItem("best_rolls", rolls)
                localStorage.setItem("best_time", timer.elapsed)
            }

            setTenzies(false)
            setDice(allNewDice())
            setRolls(prevRolls => prevRolls = 0)
            setTimer(oldTimer => {
                return {
                    start: getTime(),
                    end: 0,
                    elapsed: "00"
                }
            }) 

        }

    }


    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld == true)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value == firstValue)

        if (allHeld && allSameValue)
        {
            setTenzies(true)
        }
    }, [dice])


    return (
        <main>
            {tenzies == true && <Confetti />}
            <h1 className="title">Tenzies</h1>
            {tenzies == false ? <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p> : <h2>YOU WON!</h2>}
            {localStorage.getItem("best_rolls") != null && <p className="highscore"><b>Your Highscore:</b> {localStorage.getItem("best_rolls") == null ? "0" : localStorage.getItem("best_rolls")} Rolls in {parseInt(localStorage.getItem("best_time")) == null ? "0" : localStorage.getItem("best_time")} seconds</p>}
            <div className="dice-container">
                {dieNumber}
            </div>
            <button onClick={Roll} className='button-roll'>{tenzies == false ? "Roll Dice!" : "New Game!"}</button>
            {tenzies == true && <p>Rolled: {rolls} times in {timer.elapsed} seconds</p>}
            
        </main>
    )
}