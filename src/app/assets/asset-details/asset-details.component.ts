import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import { UserAsset } from 'src/app/shared/interfaces/user-asset';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-asset-details',
    templateUrl: './asset-details.component.html',
    styleUrls: ['./asset-details.component.scss']
})
export class AssetDetailsComponent implements OnInit {

    constructor(private dataService: DataService, private navSvc: NavigationService, private activatedRoute: ActivatedRoute) { }
    concernedItem: UserAsset;

    ngOnInit() {
        const concernedAssetId = Number(this.activatedRoute.snapshot.paramMap.get("assetId"));;
        console.log(concernedAssetId);
        this.concernedItem = this.dataService.getAsset(concernedAssetId);
        console.log(this.concernedItem);
    }

}
