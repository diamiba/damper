import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {

    constructor(private activatedRoute:ActivatedRoute, private router:Router) { }

    getConcernedAssetId(){
        console.log(this.activatedRoute);
        return Number(this.activatedRoute.snapshot.paramMap.get("assetId"));
    }

    gotoAllAssets(){
        this.router.navigate(['/assets']);
    }
}
