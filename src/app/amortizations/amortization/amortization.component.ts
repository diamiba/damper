import { Component, OnInit } from '@angular/core';
import { ComputingService } from 'src/app/shared/services/computing.service';

@Component({
    selector: 'app-amortization',
    templateUrl: './amortization.component.html',
    styleUrls: ['./amortization.component.scss']
})
export class AmortizationComponent implements OnInit {

    constructor(
        private computingService: ComputingService
    ) { }

    ngOnInit() {
        this.computingService.computeDegressiveAmortization();
        console.log(this.computingService.acquisitionDate);
    }

}
