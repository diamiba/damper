import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserAsset } from '../interfaces/user-asset';
import { isNullOrUndefined } from 'util';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor() { }

    private readonly _assets = new BehaviorSubject<UserAsset[]>([{
        "id": 1,
        "name": "Mick",
        "acquisitionDate": new Date("2017-02-15T02:11:08Z"),
        "economicDuration": 3,
        "acquisitionPrice": 73780,
        "priceIsTtc": false,
        "amoritizationType": "linear",
        "isSold": true,
        "cessionDate": new Date("2018-10-29T19:48:56Z"),
        "addedDate": new Date("2017-06-22T20:35:30Z")
    }, {
        "id": 2,
        "name": "Del",
        "acquisitionDate": new Date("2016-01-08T11:23:10Z"),
        "economicDuration": 8,
        "acquisitionPrice": 84257,
        "priceIsTtc": false,
        "amoritizationType": "degressive",
        "isSold": false,
        "cessionDate": new Date("2017-03-20T22:07:27Z"),
        "addedDate": new Date("2019-07-10T11:35:53Z")
    }, {
        "id": 3,
        "name": "Fee",
        "acquisitionDate": new Date("2016-06-30T02:22:22Z"),
        "economicDuration": 3,
        "acquisitionPrice": 126925,
        "priceIsTtc": false,
        "amoritizationType": "degressive",
        "isSold": true,
        "cessionDate": new Date("2019-09-03T15:47:53Z"),
        "addedDate": new Date("2019-02-01T09:52:51Z")
    }, {
        "id": 4,
        "name": "Fran",
        "acquisitionDate": new Date("2018-09-22T21:00:39Z"),
        "economicDuration": 3,
        "acquisitionPrice": 191664,
        "priceIsTtc": false,
        "amoritizationType": "degressive",
        "isSold": false,
        "cessionDate": new Date("2019-08-19T02:09:30Z"),
        "addedDate": new Date("2017-04-30T10:12:03Z")
    }, {
        "id": 5,
        "name": "Allard",
        "acquisitionDate": new Date("2015-10-13T08:17:04Z"),
        "economicDuration": 3,
        "acquisitionPrice": 116663,
        "priceIsTtc": true,
        "amoritizationType": "linear",
        "isSold": false,
        "cessionDate": new Date("2017-08-18T02:45:28Z"),
        "addedDate": new Date("2015-10-16T22:41:36Z")
    }, {
        "id": 6,
        "name": "Yulma",
        "acquisitionDate": new Date("2018-04-14T09:24:28Z"),
        "economicDuration": 5,
        "acquisitionPrice": 166948,
        "priceIsTtc": true,
        "amoritizationType": "degressive",
        "isSold": true,
        "cessionDate": new Date("2019-05-08T22:48:03Z"),
        "addedDate": new Date("2018-01-09T07:31:25Z")
    }, {
        "id": 7,
        "name": "Gabriel",
        "acquisitionDate": new Date("2017-08-10T21:41:11Z"),
        "economicDuration": 10,
        "acquisitionPrice": 22229,
        "priceIsTtc": true,
        "amoritizationType": "linear",
        "isSold": true,
        "cessionDate": new Date("2018-12-23T11:26:06Z"),
        "addedDate": new Date("2019-02-14T11:22:46Z")
    }, {
        "id": 8,
        "name": "Devondra",
        "acquisitionDate": new Date("2019-07-02T08:46:51Z"),
        "economicDuration": 9,
        "acquisitionPrice": 143427,
        "priceIsTtc": false,
        "amoritizationType": "degressive",
        "isSold": false,
        "cessionDate": new Date("2016-05-02T07:45:18Z"),
        "addedDate": new Date("2018-12-16T12:12:09Z")
    }, {
        "id": 9,
        "name": "Alberik",
        "acquisitionDate": new Date("2018-10-29T23:34:57Z"),
        "economicDuration": 8,
        "acquisitionPrice": 133849,
        "priceIsTtc": true,
        "amoritizationType": "degressive",
        "isSold": false,
        "cessionDate": new Date("2016-06-16T13:17:07Z"),
        "addedDate": new Date("2017-08-09T06:30:32Z")
    }, {
        "id": 10,
        "name": "Quintin",
        "acquisitionDate": new Date("2016-09-12T22:19:34Z"),
        "economicDuration": 6,
        "acquisitionPrice": 107029,
        "priceIsTtc": true,
        "amoritizationType": "degressive",
        "isSold": false,
        "cessionDate": new Date("2017-03-26T21:01:26Z"),
        "addedDate": new Date("2016-08-01T01:33:13Z")
    }, {
        "id": 11,
        "name": "Ellene",
        "acquisitionDate": new Date("2019-01-01T09:48:27Z"),
        "economicDuration": 8,
        "acquisitionPrice": 105298,
        "priceIsTtc": false,
        "amoritizationType": "degressive",
        "isSold": false,
        "cessionDate": new Date("2018-08-08T06:01:15Z"),
        "addedDate": new Date("2015-12-03T12:06:38Z")
    }, {
        "id": 12,
        "name": "Sindee",
        "acquisitionDate": new Date("2018-07-26T11:31:20Z"),
        "economicDuration": 8,
        "acquisitionPrice": 10562,
        "priceIsTtc": false,
        "amoritizationType": "linear",
        "isSold": false,
        "cessionDate": new Date("2018-09-21T21:40:53Z"),
        "addedDate": new Date("2019-07-03T15:35:16Z")
    }, {
        "id": 13,
        "name": "Pat",
        "acquisitionDate": new Date("2016-10-12T02:56:43Z"),
        "economicDuration": 9,
        "acquisitionPrice": 63636,
        "priceIsTtc": true,
        "amoritizationType": "degressive",
        "isSold": false,
        "cessionDate": new Date("2019-03-19T00:05:37Z"),
        "addedDate": new Date("2018-03-20T10:23:06Z")
    }, {
        "id": 14,
        "name": "Oren",
        "acquisitionDate": new Date("2016-06-18T21:52:26Z"),
        "economicDuration": 7,
        "acquisitionPrice": 169165,
        "priceIsTtc": true,
        "amoritizationType": "linear",
        "isSold": true,
        "cessionDate": new Date("2015-10-01T04:48:10Z"),
        "addedDate": new Date("2016-06-12T17:10:25Z")
    }, {
        "id": 15,
        "name": "Marcus",
        "acquisitionDate": new Date("2016-07-29T14:21:49Z"),
        "economicDuration": 5,
        "acquisitionPrice": 79396,
        "priceIsTtc": false,
        "amoritizationType": "degressive",
        "isSold": true,
        "cessionDate": new Date("2018-01-23T20:36:59Z"),
        "addedDate": new Date("2017-02-25T09:27:46Z")
    }, {
        "id": 16,
        "name": "Marlee",
        "acquisitionDate": new Date("2018-01-27T07:40:54Z"),
        "economicDuration": 4,
        "acquisitionPrice": 109605,
        "priceIsTtc": true,
        "amoritizationType": "degressive",
        "isSold": true,
        "cessionDate": new Date("2018-05-16T18:42:09Z"),
        "addedDate": new Date("2017-11-03T05:23:19Z")
    }, {
        "id": 17,
        "name": "Nathanial",
        "acquisitionDate": new Date("2018-03-23T04:21:25Z"),
        "economicDuration": 4,
        "acquisitionPrice": 54165,
        "priceIsTtc": true,
        "amoritizationType": "degressive",
        "isSold": false,
        "cessionDate": new Date("2016-04-15T07:48:33Z"),
        "addedDate": new Date("2017-10-11T14:18:50Z")
    }, {
        "id": 18,
        "name": "Arabele",
        "acquisitionDate": new Date("2019-05-17T06:01:26Z"),
        "economicDuration": 3,
        "acquisitionPrice": 130539,
        "priceIsTtc": false,
        "amoritizationType": "linear",
        "isSold": true,
        "cessionDate": new Date("2018-12-19T23:20:43Z"),
        "addedDate": new Date("2018-03-06T17:31:51Z")
    }, {
        "id": 19,
        "name": "Wiley",
        "acquisitionDate": new Date("2017-11-15T06:32:38Z"),
        "economicDuration": 3,
        "acquisitionPrice": 5874,
        "priceIsTtc": true,
        "amoritizationType": "degressive",
        "isSold": true,
        "cessionDate": new Date("2018-07-09T13:36:41Z"),
        "addedDate": new Date("2019-02-23T11:09:47Z")
    }, {
        "id": 20,
        "name": "Nester",
        "acquisitionDate": new Date("2016-09-06T21:21:37Z"),
        "economicDuration": 4,
        "acquisitionPrice": 110261,
        "priceIsTtc": false,
        "amoritizationType": "linear",
        "isSold": true,
        "cessionDate": new Date("2018-05-06T21:57:13Z"),
        "addedDate": new Date("2015-11-10T08:27:19Z")
    }]);

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
    }

    getAsset(assetId: number): UserAsset {
        return this.assets.find(asset => asset.id === assetId);
    }

    updateAssetDetails(concernedAsset: UserAsset) {
        let asset = this.assets.find(asset => asset.id === concernedAsset.id);

        if (asset) {
            // we need to make a new copy of todos array, and the todo as well
            // remember, our state must always remain immutable
            // otherwise, on push change detection won't work, and won't update its view

            const index = this.assets.indexOf(asset);
            this.assets[index] = concernedAsset;
            this.assets = [...this.assets];
            return true;
        }
        else{
            return false;
        }
    }

    removeAsset(assetId: number) {
        this.assets = this.assets.filter(asset => asset.id !== assetId);
    }

    getNewAssetId():number{
        let lastAssetId = Number(localStorage.getItem('lastAssetId'));
        //if it is the first one, we create it
        if (isNullOrUndefined(localStorage.getItem('lastAssetId'))) {
            localStorage.setItem('lastAssetId', '200');
            lastAssetId = 200;
        }
        else{
            lastAssetId++;
            localStorage.setItem('lastAssetId', String(lastAssetId));
        }
        return lastAssetId;
    }






}
