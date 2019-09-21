import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ModalService {

    constructor() { }

    @Output() openConfirmModal:EventEmitter<any> = new EventEmitter<any>();

    private openConfirm(_itemId: number, _itemType: string, itemName: string = "") {
        this.openConfirmModal.emit({
            emitMode: true,
            itemId: _itemId,
            itemType: _itemType,
            itemName: itemName
        });
    }

    openNewAssetDialog() {
        this.openConfirm(0,'new_asset');
    }

    editAssetDialog(assetId:number) {
        this.openConfirm(assetId,'edit_asset');
    }

    confirmAssetDeletionDialog(assetId:number) {
        this.openConfirm(assetId,'delete_asset');
    }
}
