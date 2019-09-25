import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';
import { UserAsset } from 'src/app/shared/interfaces/user-asset';
import { isNullOrUndefined } from 'util';

@Component({
    selector: 'app-asset-form',
    templateUrl: './asset-form.component.html',
    styleUrls: ['./asset-form.component.scss']
})
export class AssetFormComponent implements OnInit, OnDestroy {
    @Output() modalClosed = new EventEmitter();
    @Input() newAsset: boolean;
    @Input() assetId: number;
    assetForm: FormGroup;
    valueChangeObs:any;
    concernedAsset:UserAsset;
    assetIsSold:boolean;
    isLoading:boolean = false;
    constructor(private fb: FormBuilder, private dataService:DataService) { }

    ngOnInit() {
        this.isLoading = false;
        if(!this.newAsset){
            this.concernedAsset = this.dataService.getAsset(this.assetId);
            this.buildForm(this.concernedAsset);
        }
        else{
            this.buildForm();
        }

    }

    ngOnDestroy(){
        this.valueChangeObs.unsubscribe();
    }

    buildForm(asset?:UserAsset){
        if(isNullOrUndefined(asset)){
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
        }
        else{
            this.assetForm = this.fb.group({
                name: [asset.name, [Validators.required]],
                acquisitionDate: [asset.acquisitionDate, [Validators.required]],
                economicDuration: [asset.economicDuration, [Validators.required]],
                acquisitionPrice: [asset.acquisitionPrice, [Validators.required]],
                isSold: [asset.isSold, [Validators.required]],
                priceIsTtc: [asset.priceIsTtc, [Validators.required]],
                cessionDate: [asset.cessionDate],
                amoritizationType: [asset.amoritizationType, [Validators.required]],
            });
            this.assetIsSold = asset.isSold;
            this.updateCessionDateValidity(asset.isSold);
        }

        this.valueChangeObs = this.assetForm.controls.isSold.valueChanges;
        this.valueChangeObs.subscribe((newValue:boolean)=>{
            this.assetIsSold = newValue;
            this.updateCessionDateValidity(newValue);
        })

    }

    updateCessionDateValidity(required:boolean){
        if(required){
            this.assetForm.controls.cessionDate.setValidators([Validators.required]);
            this.assetForm.controls.cessionDate.updateValueAndValidity();
        }
        else{
            this.assetForm.controls.cessionDate.clearValidators();
            this.assetForm.controls.cessionDate.updateValueAndValidity();
        }
    }

    submitForm() {
        // console.log(this.assetForm);
        this.isLoading = true;
        if(this.newAsset){
            let newAsset = this.assetForm.value;
            newAsset.addedDate = new Date();
            this.dataService.addAsset(newAsset);
            this.isLoading = false;
            this.cancelModal();
        }
        else{
            let updatedAsset = this.assetForm.value;
            updatedAsset.id = this.assetId;
            updatedAsset.addedDate = this.concernedAsset.addedDate;
            if(this.dataService.updateAssetDetails(updatedAsset)){
                this.isLoading = false;
                this.cancelModal();
            }
            else{
                this.isLoading = false;
                alert('ya eu erreur');
            }
        }
        return false;
    }

    cancelModal() {
        this.modalClosed.emit(true);
    }

    destroyModal(): void {

    }

}
