import { Injectable, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserAsset } from '../interfaces/user-asset';
import { isNullOrUndefined } from 'util';
import { ComputingService } from './computing.service';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor(private computingSvc:ComputingService) { }

    private defaultAsset: UserAsset = {
        name: "",
        acquisitionDate: new Date(),
        economicDuration: 5,
        acquisitionPrice: 10000,
        isSold: false,
        priceIsTtc: false,
        amoritizationType: "linear",
    }

    @Output() assetDetailsUpdated = new EventEmitter<{type:string, asset:UserAsset}>();

    // assetsList = [
    //     {
    //         "id": 1,
    //         "name": "Mick",
    //         "acquisitionDate": new Date("2017-02-15T02:11:08Z"),
    //         "economicDuration": 3,
    //         "acquisitionPrice": 73780,
    //         "priceIsTtc": false,
    //         "amoritizationType": "linear",
    //         "isSold": true,
    //         "cessionDate": new Date("2018-10-29T19:48:56Z"),
    //         "addedDate": new Date("2017-06-22T20:35:30Z")
    //     }, {
    //         "id": 2,
    //         "name": "Del",
    //         "acquisitionDate": new Date("2016-01-08T11:23:10Z"),
    //         "economicDuration": 8,
    //         "acquisitionPrice": 84257,
    //         "priceIsTtc": false,
    //         "amoritizationType": "degressive",
    //         "isSold": false,
    //         "cessionDate": new Date("2017-03-20T22:07:27Z"),
    //         "addedDate": new Date("2019-07-10T11:35:53Z")
    //     }, {
    //         "id": 19,
    //         "name": "Wiley",
    //         "acquisitionDate": new Date("2017-11-15T06:32:38Z"),
    //         "economicDuration": 3,
    //         "acquisitionPrice": 5874,
    //         "priceIsTtc": true,
    //         "amoritizationType": "degressive",
    //         "isSold": true,
    //         "cessionDate": new Date("2018-07-09T13:36:41Z"),
    //         "addedDate": new Date("2019-02-23T11:09:47Z")
    //     }, {
    //         "id": 20,
    //         "name": "Nester",
    //         "acquisitionDate": new Date("2016-09-06T21:21:37Z"),
    //         "economicDuration": 4,
    //         "acquisitionPrice": 110261,
    //         "priceIsTtc": false,
    //         "amoritizationType": "linear",
    //         "isSold": true,
    //         "cessionDate": new Date("2018-05-06T21:57:13Z"),
    //         "addedDate": new Date("2015-11-10T08:27:19Z")
    //     }];
    private readonly _assets = new BehaviorSubject<UserAsset[]>(this._getStoredAssets());

    private readonly _assets_value = new BehaviorSubject<any>(this.getTotalAssetsValue());
    // private readonly _dotations_as_today = new BehaviorSubject<Number>(this.getTotalAssetsValue());

    readonly totalAssetsValue$ = this._assets_value.asObservable();

    readonly assets$ = this._assets.asObservable();

    get assets(): UserAsset[] {
        return this._assets.getValue();
    }

    set assets(assetsList: UserAsset[]) {
        this._assets.next(assetsList);
    }

    addAsset(newAsset: UserAsset) {
        newAsset.id = this.getNewAssetId();
        this.assets = [
            ...this.assets,
            newAsset
        ];
        this.updateTotalAssetsValue();
    }

    getAsset(assetId: number): UserAsset {
        const concernedAsset = this.assets.find(asset => asset.id === assetId);
        // if(concernedAsset){}
        return concernedAsset;
    }

    private _getStoredAssets(){
        let storedAssets = JSON.parse(localStorage.getItem('storedAssets'));
        storedAssets.forEach(asset => {
            asset.acquisitionDate = new Date(asset.acquisitionDate);
            asset.addedDate = new Date(asset.addedDate);
            if(!isNullOrUndefined(asset.cessionDate)){
                asset.cessionDate = new Date(asset.cessionDate);
            }
        });
        if(isNullOrUndefined(storedAssets)){
            storedAssets = [];
            localStorage.setItem('storedAssets',JSON.stringify(storedAssets));
        }
        return storedAssets;
    }

    private _updateStoredAssets(assetsList:UserAsset[]){
        localStorage.setItem('storedAssets',JSON.stringify(assetsList));
    }

    private updateTotalAssetsValue(){
        const totalValue = this.assets.reduce((acc, asset) => acc + Number(asset.acquisitionPrice), 0);
        const dotationsAsToday = this.computingSvc.getDotationsAsTodayOfAssets(this.assets);
        const assetsValue = {
            "totalValue":totalValue,
            "dotationsAsToday":dotationsAsToday,
            "vna":totalValue - dotationsAsToday
        }
        // console.log(totalValue);
        this._assets_value.next(assetsValue);
        localStorage.setItem('totalAssetsValue',String(totalValue));
        this._updateStoredAssets(this.assets);
        // console.log(dotationsAsToday);
    }

    getTotalAssetsValue(){
        const totalValue = Number(localStorage.getItem('totalAssetsValue'));
        const dotationsAsToday = this.computingSvc.getDotationsAsTodayOfAssets(this.assets);
        const assetsValue = {
            "totalValue":totalValue,
            "dotationsAsToday":dotationsAsToday,
            "vna":totalValue - dotationsAsToday
        }
        return assetsValue;
    }

    updateAssetDetails(concernedAsset: UserAsset) {
        let asset = this.assets.find(asset => asset.id === concernedAsset.id);

        if (asset) {
            const index = this.assets.indexOf(asset);
            this.assets[index] = concernedAsset;
            this.assets = [...this.assets];
            this.assetDetailsUpdated.emit({type:"updated",asset:concernedAsset});
            this.updateTotalAssetsValue();
            return true;
        }
        else {
            return false;
        }
    }

    removeAsset(assetId: number) {
        const concernedAsset = this.getAsset(assetId);
        this.assets = this.assets.filter(asset => asset.id !== assetId);
        this.assetDetailsUpdated.emit({type:"deleted",asset:concernedAsset});
        this.updateTotalAssetsValue();
    }

    getNewAssetId(): number {
        let lastAssetId = Number(localStorage.getItem('lastAssetId'));
        //if it is the first one, we create it
        if (isNullOrUndefined(localStorage.getItem('lastAssetId'))) {
            localStorage.setItem('lastAssetId', '200');
            lastAssetId = 200;
        }
        else {
            lastAssetId++;
            localStorage.setItem('lastAssetId', String(lastAssetId));
        }
        return lastAssetId;
    }






}
