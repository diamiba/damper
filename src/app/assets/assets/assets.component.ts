import { Component, OnInit } from '@angular/core';
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
export class AssetsComponent implements OnInit {

    constructor(private modalService:ModalService, public dataService:DataService, private excelService:ExcelService) { }

    list: UserAsset[];
    isLoading = true;
    ngOnInit() {
        this.isLoading = false;
        // this.dataService.assets$.subscribe((assetsList:UserAsset[])=>{
        //     // console.log(assetsList);
        //     this.list = assetsList;
        //     this.isLoading = false;
        // })
        // console.log(this.dataService.assets$);
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
