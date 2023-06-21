import React, {useRef, useState, useEffect} from "react";
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

const initialBoardState: Piece[] = [];
for(let i=0;i<8;i++){
    initialBoardState.push({image : "assets/images/Chess_plt45.svg", x:i, y:1})
    initialBoardState.push({image : "assets/images/Chess_pdt45.svg", x:i, y:6})
}

// Rooks
initialBoardState.push({image : "assets/images/Chess_rdt45.svg", x:0, y:7})
initialBoardState.push({image : "assets/images/Chess_rdt45.svg", x:7, y:7})
initialBoardState.push({image : "assets/images/Chess_rlt45.svg", x:0, y:0})
initialBoardState.push({image : "assets/images/Chess_rlt45.svg", x:7, y:0})

// Knights
initialBoardState.push({image : "assets/images/Chess_ndt45.svg", x:1, y:7})
initialBoardState.push({image : "assets/images/Chess_ndt45.svg", x:6, y:7})
initialBoardState.push({image : "assets/images/Chess_nlt45.svg", x:1, y:0})
initialBoardState.push({image : "assets/images/Chess_nlt45.svg", x:6, y:0})

// Bishops
initialBoardState.push({image : "assets/images/Chess_bdt45.svg", x:2, y:7})
initialBoardState.push({image : "assets/images/Chess_bdt45.svg", x:5, y:7})
initialBoardState.push({image : "assets/images/Chess_blt45.svg", x:2, y:0})
initialBoardState.push({image : "assets/images/Chess_blt45.svg", x:5, y:0})

// Queens and kings
initialBoardState.push({image : "assets/images/Chess_qdt45.svg", x:3, y:7})
initialBoardState.push({image : "assets/images/Chess_kdt45.svg", x:4, y:7})
initialBoardState.push({image : "assets/images/Chess_qlt45.svg", x:3, y:0})
initialBoardState.push({image : "assets/images/Chess_klt45.svg", x:4, y:0})

export default function Chessboard(){
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [gridX,setGridX] = useState(0);
    const [gridY,setGridY] = useState(0);
    const [pieces, setPieces] = useState<Piece[]>(initialBoardState)
    const chessboardRef = useRef<HTMLDivElement>(null);

function grabPiece(e: React.MouseEvent){
    const chessboard = chessboardRef.current;
    const element = e.target as HTMLElement;
    if(element.classList.contains("chess-piece") && chessboard){
        setGridX(Math.floor((e.clientX - chessboard.offsetLeft)/70));
        setGridY(7 - Math.floor((e.clientY - chessboard.offsetTop)/70));
        const x = e.clientX-40;
        const y = e.clientY-40;
        element.style.position = "absolute";
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        setActivePiece(element);
    }
}
function movePiece(e: React.MouseEvent){
    const element = e.target as HTMLElement;
    const chessboard = chessboardRef.current;
    if(activePiece && chessboard){
        const minX = (chessboard.offsetLeft-20);
        const maxX = chessboard.offsetLeft + chessboard.clientWidth-70;
        const maxY = chessboard.offsetTop + chessboard.clientHeight-70;
        const minY = (chessboard.offsetTop-20);
        const x = e.clientX-40;
        const y = e.clientY-40;
        activePiece.style.position = "absolute";

        // Condition for x movement
        if(x<minX){
            activePiece.style.left = `${minX}px`;
        }
        else if(x>maxX){
            activePiece.style.left = `${maxX}px`;
        }
        else{
            activePiece.style.left = `${x}px`;
        }
        
        // Condition for y movement
        if(y<minY){
            activePiece.style.top = `${minY}px`;
        }
        else if(y>maxY){
            activePiece.style.top = `${maxY}px`;
        }
        else{
            activePiece.style.top = `${y}px`;
        }
    }
}
function dropPiece(e: React.MouseEvent){
    const chessboard = chessboardRef.current;
    if(activePiece && chessboard){
        const x = Math.floor((e.clientX - chessboard.offsetLeft)/70);
        const y = 7 - Math.floor((e.clientY - chessboard.offsetTop)/70);
        console.log(2,x,y);
        setPieces(value =>{
            const pieces = value.map(p=>{
                if(p.x===gridX && p.y===gridY){
                    p.x=x;
                    p.y=y;
                }
                return p;
            });
            return pieces;
        })
        setActivePiece(null);
    }
}

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
    id="chessboard" ref={chessboardRef}>
        {board}
    </div>
};