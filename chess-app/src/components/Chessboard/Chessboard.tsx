import React, {useRef, useState, useEffect} from "react";
import './Chessboard.css';
import Tile from "../Tile/Tile";
import Referee from "../../referee/Referee";
import { spawn } from "child_process";
import { act } from "react-dom/test-utils";

const verticalAxis = ["1","2","3","4","5","6","7","8"];
const horizontalAxis = ["a","b","c","d","e","f","g","h"];

export interface Piece {
    image : string;
    x : number;
    y : number;
    type: PieceType;
    team: TeamType;
    enpassant?: boolean;
}

export enum TeamType{
    OPPONENT,
    OUR
}

export enum PieceType{
    PAWN,
    BISHOP,
    KNIGHT,
    ROOK,
    QUEEN,
    KING
}

const pieces : Piece[] = [];

const initialBoardState: Piece[] = [];
for(let i=0;i<8;i++){
    initialBoardState.push({image : "assets/images/Chess_plt45.svg", x:i, y:1, type: PieceType.PAWN, team: TeamType.OUR})
    initialBoardState.push({image : "assets/images/Chess_pdt45.svg", x:i, y:6, type: PieceType.PAWN, team: TeamType.OPPONENT})
}

// Rooks
initialBoardState.push({image : "assets/images/Chess_rdt45.svg", x:0, y:7, type: PieceType.ROOK, team: TeamType.OPPONENT})
initialBoardState.push({image : "assets/images/Chess_rdt45.svg", x:7, y:7, type: PieceType.ROOK, team: TeamType.OPPONENT})
initialBoardState.push({image : "assets/images/Chess_rlt45.svg", x:0, y:0, type: PieceType.ROOK, team: TeamType.OUR})
initialBoardState.push({image : "assets/images/Chess_rlt45.svg", x:7, y:0, type: PieceType.ROOK, team: TeamType.OUR})

// Knights
initialBoardState.push({image : "assets/images/Chess_ndt45.svg", x:1, y:7, type: PieceType.KNIGHT, team: TeamType.OPPONENT})
initialBoardState.push({image : "assets/images/Chess_ndt45.svg", x:6, y:7, type: PieceType.KNIGHT, team: TeamType.OPPONENT})
initialBoardState.push({image : "assets/images/Chess_nlt45.svg", x:1, y:0, type: PieceType.KNIGHT, team: TeamType.OUR})
initialBoardState.push({image : "assets/images/Chess_nlt45.svg", x:6, y:0, type: PieceType.KNIGHT, team: TeamType.OUR})

// Bishops
initialBoardState.push({image : "assets/images/Chess_bdt45.svg", x:2, y:7, type: PieceType.BISHOP, team: TeamType.OPPONENT})
initialBoardState.push({image : "assets/images/Chess_bdt45.svg", x:5, y:7, type: PieceType.BISHOP, team: TeamType.OPPONENT})
initialBoardState.push({image : "assets/images/Chess_blt45.svg", x:2, y:0, type: PieceType.BISHOP, team: TeamType.OUR})
initialBoardState.push({image : "assets/images/Chess_blt45.svg", x:5, y:0, type: PieceType.BISHOP, team: TeamType.OUR})

// Queens and kings
initialBoardState.push({image : "assets/images/Chess_qdt45.svg", x:3, y:7, type: PieceType.QUEEN, team: TeamType.OPPONENT})
initialBoardState.push({image : "assets/images/Chess_kdt45.svg", x:4, y:7, type: PieceType.KING, team: TeamType.OPPONENT})
initialBoardState.push({image : "assets/images/Chess_qlt45.svg", x:3, y:0, type: PieceType.QUEEN, team: TeamType.OUR})
initialBoardState.push({image : "assets/images/Chess_klt45.svg", x:4, y:0, type: PieceType.KING, team: TeamType.OUR})

export default function Chessboard(){
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [gridX,setGridX] = useState(0);
    const [gridY,setGridY] = useState(0);
    const [pieces, setPieces] = useState<Piece[]>(initialBoardState)
    const chessboardRef = useRef<HTMLDivElement>(null);
    const referee = new Referee();

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

        const currentPiece = pieces.find((p)=> p.x=== gridX && p.y=== gridY);
        const attackPiece = pieces.find((p)=> p.x=== x && p.y=== y);
        
        if(currentPiece){
            const isEnPassantMove = referee.isEnPassantMove(gridX,gridY,x,y,currentPiece.type, currentPiece.team,pieces);
            const pawnDirecrion = (currentPiece.team === TeamType.OUR)? 1:-1;
            const validMove = referee.isValidMove(gridX, gridY, x,y,currentPiece.type, currentPiece.team, pieces);
            if(isEnPassantMove){
                const updatedPieces = pieces.reduce((results,piece)=>{
                    if(piece.x=== gridX && piece.y === gridY){
                        piece.enpassant= false;

                        piece.x=x; 
                        piece.y=y;
                        results.push(piece);
                    }else if(!(piece.x===x && piece.y===y-pawnDirecrion)){
                        if(piece.type=== PieceType.PAWN){
                            piece.enpassant= false;
                        }
                        results.push(piece);
                    }
                    return results;
                }, [] as Piece[])
                setPieces(updatedPieces)
            }
            else if(validMove){
                // Using reduce function The first parameter is result array and second parameter is the current piece 
                const updatedPieces = pieces.reduce((results,piece)=>{
                    if(piece.x=== gridX && piece.y === gridY){
                        if(Math.abs(gridY-y)===2 && piece.type=== PieceType.PAWN){
                            piece.enpassant= true;
                        }
                        else{
                            piece.enpassant= false;
                        }
                        piece.x=x; piece.y = y;
                        results.push(piece);
                    }
                    else if(!(piece.x===x && piece.y===y)){
                        if(piece.type=== PieceType.PAWN){
                            piece.enpassant= false;
                        }
                        results.push(piece);
                    }
                    return results;
                }, [] as Piece[]);
                setPieces(updatedPieces)
            }
            else{
                // Resets Piece Position
                activePiece.style.position = 'relative';
                activePiece.style.removeProperty('top');
                activePiece.style.removeProperty('left');
            }
        }
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