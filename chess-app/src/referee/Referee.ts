import { PieceType, TeamType, Piece } from "../components/Chessboard/Chessboard";

export default class refree{
    tileIsOccupied(x: number, y: number, boardState: Piece[]): boolean{
        // console.log("Checking if occupied")
        const piece = boardState.find(p => p.x === x && p.y===y)
        if(piece) return true;
        else return false;
    }

    tileIsOccupiedByOpponent(x: number, y: number, boardState: Piece[], team: TeamType): boolean{
        const piece = boardState.find((p)=> p.x===x && p.y===y && p.team!=team)
        if(piece) return true;
        else return false;
    }

    isEnPassantMove(px: number, py: number, x: number, y: number, type: PieceType, team: TeamType, boardState: Piece[]){
        const pawnDirecrion = (team === TeamType.OUR)? 1:-1;
        if(type=== PieceType.PAWN){
            if((x-px===1 || x-px===-1 ) && y-py === pawnDirecrion){
                const piece = boardState.find(p=> p.x === x && p.y=== y-pawnDirecrion && p.enpassant=== true);
                if(piece) return true;
            }
        }
        return false;
    }

    isValidMove(px: number, py: number, x: number, y: number, type: PieceType, team: TeamType, boardState: Piece[]){
        if(type === PieceType.PAWN){
            const specialRow = (team === TeamType.OUR)? 1: 6;
            const pawnDirecrion = (team === TeamType.OUR)? 1:-1;
            console.log(specialRow, pawnDirecrion);
            if(px===x && py=== specialRow && y-py=== 2*pawnDirecrion){
                if(!this.tileIsOccupied(x,y,boardState) && !this.tileIsOccupied(x,y-pawnDirecrion,boardState)){
                    return true;
                }
            }
            else if(px===x && y-py=== 1*pawnDirecrion){
                if(!this.tileIsOccupied(x,y,boardState)){
                    return true;
                }
            }
            // Attack Logic
            else if(x-px===1 && y-py === pawnDirecrion){
                // Attack in upper or bottom left corner
                if(this.tileIsOccupiedByOpponent(x,y,boardState,team)){
                    return true;
                }
            }
            else if(x-px===-1 && y-py === pawnDirecrion){
                // Attack in upper or bottom right corner
                if(this.tileIsOccupiedByOpponent(x,y,boardState,team)){
                    return true;
                }
            }
        }
        return false;
    }
}