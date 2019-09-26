import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import { UserAsset } from 'src/app/shared/interfaces/user-asset';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from 'src/app/shared/services/modal.service';
import { isUndefined } from 'util';
// import { Observable } from 'rxjs';

@Component({
    selector: 'app-asset-details',
    templateUrl: './asset-details.component.html',
    styleUrls: ['./asset-details.component.scss']
})
export class AssetDetailsComponent implements OnInit, OnDestroy {
    notFound: boolean = false;

    constructor(private dataService: DataService, private modalService: ModalService, public navSvc: NavigationService, private activatedRoute: ActivatedRoute) { }
    concernedItem: any;
    assetEvtSubscriber: any;

    ngOnInit() {
        this.notFound = false;
        const concernedAssetId = Number(this.activatedRoute.snapshot.paramMap.get("assetId"));
        this.concernedItem = this.dataService.getAsset(concernedAssetId);
        if (isUndefined(this.concernedItem)) {
            this.notFound = true;
        }
        // console.log(this.concernedItem);
        this.assetEvtSubscriber = this.dataService.assetDetailsUpdated.subscribe((newAssetDetails: { type: string, asset: UserAsset }) => {
            if (newAssetDetails.asset.id === this.concernedItem.id) {
                if (newAssetDetails.type === "updated") {
                    this.concernedItem = newAssetDetails.asset;
                }
                else {
                    this.navSvc.gotoAllAssets();
                }
            }
        })
    }

    editAssetDetails(asset: any) {
        this.modalService.editAssetDialog(asset.id);
    }

    deleteAsset(asset: any) {
        this.modalService.confirmAssetDeletionDialog(asset.id);
    }

    ngOnDestroy() {
        this.assetEvtSubscriber.unsubscribe();
    }

}
