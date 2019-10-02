import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzModalModule } from 'ng-zorro-antd/modal';

import { AssetsRoutingModule } from './assets-routing.module';
import { AssetsComponent } from './assets/assets.component';
import { NzSkeletonModule, NzButtonModule, NzDescriptionsModule, NzTableModule, NzDividerModule, NzIconModule, NzStatisticModule, NzGridModule, NzEmptyModule } from 'ng-zorro-antd';
import { AssetDetailsComponent } from './asset-details/asset-details.component';
import { SharedModule } from '../shared/shared/shared.module';
import { RouterModule } from '@angular/router';



@NgModule({
    declarations: [AssetsComponent, AssetDetailsComponent],
    imports: [
        CommonModule,
        AssetsRoutingModule,
        NzPageHeaderModule,
        NzListModule,
        RouterModule,
        NzSkeletonModule,
        NzButtonModule,
        NzModalModule,
        NzDescriptionsModule,
        NzTableModule,
        NzDividerModule,
        NzIconModule,
        NzStatisticModule,
        NzGridModule,
        NzEmptyModule,
        SharedModule
    ]
})
export class AssetsModule { }
