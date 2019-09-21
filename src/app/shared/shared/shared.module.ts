import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { AssetFormComponent } from './asset-form/asset-form.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzIconModule, NzInputModule, NzButtonModule, NzSelectModule, NzCheckboxModule, NzDatePickerModule, NzInputNumberModule, NzGridModule, NzModalModule, NzDescriptionsModule, NzTableModule, NzDividerModule } from 'ng-zorro-antd';
import { ModalComponent } from './modal/modal.component';
import { AssetFormComponent } from './modal/asset-form/asset-form.component';
import { ConfirmActionComponent } from './modal/confirm-action/confirm-action.component';
// import { RouterModule } from '@angular/router';



@NgModule({
    declarations: [ModalComponent, AssetFormComponent, ConfirmActionComponent],
    imports: [
        CommonModule,
        NzFormModule,
        // RouterModule,
        FormsModule,
        NzIconModule,
        NzInputModule,
        ReactiveFormsModule,
        NzButtonModule,
        NzSelectModule,
        NzCheckboxModule,
        NzDatePickerModule,
        NzInputNumberModule,
        NzGridModule,
        NzModalModule,
        NzDescriptionsModule,
        NzTableModule,
        NzDividerModule,
    ],
    exports: [ModalComponent, AssetFormComponent]
})
export class SharedModule { }
