export  default class RelationVector {  
    constructor(symbol, relationVector, prefixTirps, nextTirps) {
      this.symbol = symbol;
      this.relationVector = relationVector;
      this.prefixTirps = prefixTirps;
      this.nextTirps = nextTirps;
    }

    getSymbol= ()=> this.symbol;
    getRelationVector= ()=> this.relationVector;
    getPrefixTirps= ()=> this.prefixTirps;
    getNextTirps= ()=> this.nextTirps;


   toString = () =>{
     return "symbol: "+this.symbol+", relation vector: "
     +this.relationVector+", prefix tirps: "+this.prefixTirps
     +", next tirps: "+this.nextTirps;
   }
  
  }