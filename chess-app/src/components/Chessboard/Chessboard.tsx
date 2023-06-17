import React from "react";
import './Chessboard.css';
import Tile from "../Tile/Tile";
import { spawn } from "child_process";
import { act } from "react-dom/test-utils";

const verticalAxis = ["1","2","3","4","5","6","7","8"];
const horizontalAxis = ["a","b","c","d","e","f","g","h"];

interface Piece {
    image : string;
    x : number;
    y : number;
}

const pieces : Piece[] = [];

// Pawns
for(let i=0;i<8;i++){
    pieces.push({image : "assets/images/Chess_pdt45.svg", x:i, y:6})
    pieces.push({image : "assets/images/Chess_plt45.svg", x:i, y:1})
}

// Rooks
pieces.push({image : "assets/images/Chess_rdt45.svg", x:0, y:7})
pieces.push({image : "assets/images/Chess_rdt45.svg", x:7, y:7})
pieces.push({image : "assets/images/Chess_rlt45.svg", x:0, y:0})
pieces.push({image : "assets/images/Chess_rlt45.svg", x:7, y:0})

// Knights
pieces.push({image : "assets/images/Chess_ndt45.svg", x:1, y:7})
pieces.push({image : "assets/images/Chess_ndt45.svg", x:6, y:7})
pieces.push({image : "assets/images/Chess_nlt45.svg", x:1, y:0})
pieces.push({image : "assets/images/Chess_nlt45.svg", x:6, y:0})

// Bishops
pieces.push({image : "assets/images/Chess_bdt45.svg", x:2, y:7})
pieces.push({image : "assets/images/Chess_bdt45.svg", x:5, y:7})
pieces.push({image : "assets/images/Chess_blt45.svg", x:2, y:0})
pieces.push({image : "assets/images/Chess_blt45.svg", x:5, y:0})

// Queens and kings
pieces.push({image : "assets/images/Chess_qdt45.svg", x:3, y:7})
pieces.push({image : "assets/images/Chess_kdt45.svg", x:4, y:7})
pieces.push({image : "assets/images/Chess_qlt45.svg", x:3, y:0})
pieces.push({image : "assets/images/Chess_klt45.svg", x:4, y:0})

let activePiece: HTMLElement | null = null;

function grabPiece(e: React.MouseEvent){
    const element = e.target as HTMLElement;
    if(element.classList.contains("chess-piece")){
        const x = e.clientX-40;
        const y = e.clientY-40;
        element.style.position = "absolute";
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        activePiece = element;
    }
}
function movePiece(e: React.MouseEvent){
    const element = e.target as HTMLElement;
    if(activePiece){
        const x = e.clientX-40;
        const y = e.clientY-40;
        activePiece.style.position = "absolute";
        activePiece.style.left = `${x}px`;
        activePiece.style.top = `${y}px`;
    }
}
function dropPiece(e: React.MouseEvent){
    if(activePiece){
        activePiece = null;
    }
}
export default function Chessboard(){
    let board = [];
    for(let j=verticalAxis.length-1;j>=0;j--){
    for(let i=0;i<horizontalAxis.length;i++){
        const number = j+i;
        let image = undefined;
        pieces.forEach(p=>{
            if(p.x === i && p.y=== j){
                image = p.image;
            }
        })
        board.push(<Tile key= {`${j},${i}`}image={image} number = {number}/>)
    }
};
    return <div 
    onMouseDown={e=> grabPiece(e) } 
    onMouseMove={(e)=> movePiece(e)} 
    onMouseUp={e=> dropPiece(e)}
    id="chessboard">
        {board}
    </div>
};