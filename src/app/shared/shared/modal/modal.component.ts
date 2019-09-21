import { Component, OnInit, TemplateRef } from '@angular/core';
import { NzModalService, NzModalRef } from 'ng-zorro-antd';
import { ModalService } from '../../services/modal.service';
import { AssetFormComponent } from './asset-form/asset-form.component';

const NEW_ASSET = "Ajout d'un nouveau bien";
const EDIT_ASSET = "Modification des informations d'un bien";
@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
    createAsset: boolean;
    newAsset: boolean;
    deleteAssetMode: boolean;
    modalTitle: string;
    assetId:number;
    initLoading = false;
    isVisible = false;
    isOkLoading = false;

    constructor(private nzModal: NzModalService, private modalService: ModalService) { }


    ngOnInit() {
        this.isVisible = false;
        this.modalService.openConfirmModal.subscribe((actionDetails: any) => {
            this.initModes();
            // console.log(actionDetails);
            switch (actionDetails.itemType) {
                case 'new_asset':
                    this.AddNewAsset(actionDetails.itemId);
                    break;
                case 'edit_asset':
                    this.EditAsset(actionDetails.itemId);
                    break;
                case 'delete_asset':
                    this.showDeleteConfirm(actionDetails.itemId);
                    break;
                default:
                    this.AddNewAsset(actionDetails.itemId);
                    break;
            }
        })
    }

    showModal(): void {
        this.isVisible = true;
    }

    initModes() {
        this.isVisible = false;
        this.createAsset = false;
        this.newAsset = false;
        this.deleteAssetMode = false;
        this.assetId = 0;
        this.modalTitle = NEW_ASSET;
    }

    AddNewAsset(assetId: number) {
        this.showModal();
        this.createAsset = true;
        this.newAsset = true;
        this.modalTitle = NEW_ASSET;
    }


    EditAsset(assetId: number) {
        this.showModal();
        this.createAsset = true;
        this.newAsset = false;
        this.assetId = assetId;
        this.modalTitle = EDIT_ASSET;
    }

    DeleteAsset(assetId: number) {
        // this.showModal();
        this.isVisible = false;
        this.deleteAssetMode = true;
        this.showDeleteConfirm(assetId);
    }

    handleOk(): void {
        this.isOkLoading = true;
        setTimeout(() => {
            this.isVisible = false;
            this.isOkLoading = false;
        }, 3000);
    }

    handleCancel($event?): void {
        // this.nzModalRef.destroy();
        this.initModes();
        this.isVisible = false;
    }

    showDeleteConfirm(itemId: number): void {
        this.nzModal.confirm({
            nzTitle: 'Voulez-vous vraiment supprimer ce bien ?',
            nzContent: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Perferendis ipsa minima ipsam dicta repellendus numquam vel, rerum excepturi est cupiditate. Saepe deleniti nisi ex. Vero voluptatibus consequuntur magnam atque ad.',
            nzOkText: 'Oui, supprimer',
            nzOkType: 'danger',
            nzOnOk: () => console.log('OK'),
            nzCancelText: 'Non',
            nzOnCancel: () => console.log('Cancel')
        });
    }

}
