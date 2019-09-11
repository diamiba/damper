export interface AssetDotation {
    year:number;
    rate:number;
    value:number;
    sumOfDotations:number;
    remainingDotations:number;
    remainingDays?:number;
    dotationBase?:number;
    linearDotation?:number;
}
