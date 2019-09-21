import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';
import { UserAsset } from 'src/app/shared/interfaces/user-asset';

@Component({
    selector: 'app-asset-form',
    templateUrl: './asset-form.component.html',
    styleUrls: ['./asset-form.component.scss']
})
export class AssetFormComponent implements OnInit {
    @Output() modalClosed = new EventEmitter();
    @Input() newAsset: boolean;
    @Input() assetId: number;
    assetForm: FormGroup;
    concernedAsset:UserAsset;
    isLoading:boolean = false;
    constructor(private fb: FormBuilder, private dataService:DataService) { }

    ngOnInit() {
        this.isLoading = false;
        this.assetForm = this.fb.group({
            name: ['', [Validators.required]],
            acquisitionDate: ['', [Validators.required]],
            economicDuration: [3, [Validators.required]],
            acquisitionPrice: ['', [Validators.required]],
            isSold: [false, [Validators.required]],
            priceIsTtc: [false, [Validators.required]],
            cessionDate: [''],
            amoritizationType: ['linear', [Validators.required]],
        });
        if(!this.newAsset){
            this.concernedAsset = this.dataService.getAsset(this.assetId);
            this.setAsset(this.concernedAsset);
            // console.log(this.concernedAsset);
        }
    }

    setAsset(asset:UserAsset){
        this.assetForm.controls.name.setValue(asset.name);
        this.assetForm.controls.acquisitionDate.setValue(asset.acquisitionDate);
        this.assetForm.controls.economicDuration.setValue(asset.economicDuration);
        this.assetForm.controls.isSold.setValue(asset.isSold);
        this.assetForm.controls.priceIsTtc.setValue(asset.priceIsTtc);
        this.assetForm.controls.cessionDate.setValue(asset.cessionDate);
        this.assetForm.controls.amoritizationType.setValue(asset.amoritizationType);
        this.assetForm.controls.acquisitionPrice.setValue(asset.acquisitionPrice);
    }

    submitForm() {
        // console.log(this.assetForm);
        console.log(this.assetForm.value);
        this.isLoading = true;
        setTimeout(() => {
            this.isLoading = false;
        this.cancelModal();
        }, 3000);
        return false;
    }

    cancelModal() {
        this.modalClosed.emit(true);
    }

    destroyModal(): void {

    }

}
