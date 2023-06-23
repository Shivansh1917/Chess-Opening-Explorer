import { PieceType, TeamType, Piece } from "../components/Chessboard/Chessboard";

export default class refree{
    tileIsOccupied(x: number, y: number, boardState: Piece[]): boolean{
        // console.log("Checking if occupied")
        const piece = boardState.find(p => p.x === x && p.y===y)
        if(piece) return true;
        else return false;
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
        }
        return false;
    }
}