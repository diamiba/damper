import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {

    constructor(private activatedRoute:ActivatedRoute) { }

    getConcernedAssetId(){
        console.log(this.activatedRoute);
        return Number(this.activatedRoute.snapshot.paramMap.get("assetId"));
    }
}
