export interface UserAsset {
    id?:number;
    name:string;
    acquisitionDate:Date;
    economicDuration:number;
    acquisitionPrice:number;
    isSold:boolean;
    priceIsTtc:boolean;
    cessionDate?:Date;
    addedDate?:Date;
    sumOfDotationsAsToday?:number;
    amoritizationType:string;
}
