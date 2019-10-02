import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import { UserAsset } from 'src/app/shared/interfaces/user-asset';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from 'src/app/shared/services/modal.service';
import { isUndefined } from 'util';
import { AssetDotation } from 'src/app/shared/interfaces/asset-dotation';
import { ComputingService } from 'src/app/shared/services/computing.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
// import { Observable } from 'rxjs';

@Component({
    selector: 'app-asset-details',
    templateUrl: './asset-details.component.html',
    styleUrls: ['./asset-details.component.scss']
})
export class AssetDetailsComponent implements OnInit, OnDestroy {
    notFound: boolean = false;

    constructor(private dataService: DataService, private computeSvc: ComputingService, private excelService:ExcelService, private modalService: ModalService, public navSvc: NavigationService, private activatedRoute: ActivatedRoute) { }
    concernedItem: UserAsset;
    assetEvtSubscriber: any;
    listOfData: AssetDotation[];

    ngOnInit() {
        this.notFound = false;
        const concernedAssetId = Number(this.activatedRoute.snapshot.paramMap.get("assetId"));
        this.concernedItem = this.dataService.getAsset(concernedAssetId);
        if (isUndefined(this.concernedItem)) {
            this.notFound = true;
        }
        else {
            this.listOfData = this.computeSvc.getAmortizations(this.concernedItem);
            const todayDotations = this.computeSvc.getDotationsAsToday();
            this.concernedItem.sumOfDotationsAsToday = 0;
            if (!isUndefined(todayDotations)) {
                this.concernedItem.sumOfDotationsAsToday = todayDotations;
            }
            // console.log(this.concernedItem);

        }
        // console.log(this.concernedItem);
        this.assetEvtSubscriber = this.dataService.assetDetailsUpdated.subscribe((newAssetDetails: { type: string, asset: UserAsset }) => {
            if (newAssetDetails.asset.id === this.concernedItem.id) {
                if (newAssetDetails.type === "updated") {
                    this.concernedItem = newAssetDetails.asset;
                    this.listOfData = this.computeSvc.getAmortizations(this.concernedItem);
                    const todayDotations = this.computeSvc.getDotationsAsToday();
                    this.concernedItem.sumOfDotationsAsToday = 0;
                    if (!isUndefined(todayDotations)) {
                        this.concernedItem.sumOfDotationsAsToday = todayDotations;
                    }
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

    exportAsXlsx(){
        // this.excelService.exportAsExcelFile([this.concernedItem], 'Asset Details');
        // console.log(this.concernedItem,this.listOfData);
        // this.excelService.exportAsExcelFile(this.listOfData, 'Asset Amortization',true);
        this.excelService.exportAssetDetails(this.concernedItem,this.listOfData);
    }

}
