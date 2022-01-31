import React from 'react'

export default function Die(props) {

    const styles = {
        backgroundColor: props.isHeld == true ? "#59E391" : "#FFFFFF"
    }

    return (
        
        <div className="die-face" style={styles} onClick={() => props.handleClick(props.id)}>
            <h2 className='dice-value'>{props.value}</h2>
        </div>
        
    )
}