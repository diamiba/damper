import { UserAsset } from "../interfaces/user-asset";

export class Asset {
    id:number;
    name:string;
    acquisitionDate:Date;
    economicDuration:number;
    acquisitionPrice:number;
    isSold:boolean;
    priceIsTtc:boolean;
    cessionDate?:Date;
    amoritizationType:string;
    assetDetails:UserAsset;

    constructor(assetDetails:UserAsset){
        this.name = assetDetails.name;
        this.acquisitionDate = assetDetails.acquisitionDate;
        this.economicDuration = assetDetails.economicDuration;
        this.acquisitionPrice = assetDetails.acquisitionPrice;
        this.isSold = assetDetails.isSold;
        this.assetDetails = assetDetails;
    }

    logAssetDetails(){
    }
}
