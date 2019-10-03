import { Component, OnInit, OnDestroy } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ModalService } from 'src/app/shared/services/modal.service';
import { DataService } from 'src/app/shared/services/data.service';
import { UserAsset } from 'src/app/shared/interfaces/user-asset';
import { ExcelService } from 'src/app/shared/services/excel.service';

@Component({
    selector: 'app-assets',
    templateUrl: './assets.component.html',
    styleUrls: ['./assets.component.scss']
})
export class AssetsComponent implements OnInit,OnDestroy {

    constructor(private modalService:ModalService, public dataService:DataService, private excelService:ExcelService) { }

    noAsset:boolean;
    assetsSubscription:any;
    isLoading = true;

    ngOnInit() {
        this.isLoading = false;
        this.assetsSubscription = this.dataService.assets$.subscribe((assetsList:UserAsset[])=>{
            this.noAsset = assetsList.length===0;
        })
        // console.log(this.dataService.assets$);
    }

    ngOnDestroy(){
        this.assetsSubscription.unsubscribe();
    }

    newAsset(){
        this.modalService.openNewAssetDialog();
    }

    editAssetDetails(asset:any){
        this.modalService.editAssetDialog(asset.id);
    }

    deleteAsset(asset:any){
        this.modalService.confirmAssetDeletionDialog(asset.id);
    }

    exportAsXlsx(){
        const assetsList = this.dataService.assets;
        this.excelService.exportAssetsList(assetsList);
    }
}
