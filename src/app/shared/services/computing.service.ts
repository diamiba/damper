import { Injectable } from '@angular/core';
import { UserAsset } from '../interfaces/user-asset';
import { AssetDotation } from '../interfaces/asset-dotation';
import { UserAssetDates } from '../interfaces/user-asset-dates';
import {Asset} from '../classes/asset.class';

@Injectable({
    providedIn: 'root'
})
export class ComputingService {
    defaultAsset: UserAsset;
    assetDates: UserAssetDates;
    assetDotations: AssetDotation[];
    acquisitionDate = new Date();

    constructor() {
        this.defaultAsset = {
            id: 1,
            name: "Voiture",
            amoritizationType: "linear",
            acquisitionDate: new Date(),
            economicDuration: 5,
            acquisitionPrice: 10000,
            cessionDate: new Date('9/8/2022'),
            isSold: false,
            priceIsTtc: false,
        }

        let regarde = new Asset(this.defaultAsset);
        regarde.logAssetDetails();

        this.assetDates = {
            acquisitionYear: 0,
            acquisitionMonth: 0,
            acquisitionDay: 0,
            scheduledDuration: 0,
        }
    }

    computeLinearAmortization() {
        console.log(this.defaultAsset);
        this.prepareAssetDates(this.defaultAsset);

        let firstLinearDotation = this.computeFirstLinearDotation(this.defaultAsset);
        let nextLinearDotations = this.computeNextLinearDotations(this.defaultAsset, firstLinearDotation);
        let allDotations = this.computeLastLinearDotation(this.defaultAsset, nextLinearDotations);
        console.log(allDotations);
    }


    private prepareAssetDates(concernedAsset: UserAsset): UserAssetDates {
        this.assetDates.acquisitionYear = concernedAsset.acquisitionDate.getFullYear();
        this.assetDates.acquisitionMonth = concernedAsset.acquisitionDate.getMonth() + 1;
        this.assetDates.acquisitionDay = concernedAsset.acquisitionDate.getDate();
        this.assetDates.scheduledDuration = concernedAsset.economicDuration;
        if (concernedAsset.isSold) {
            this.assetDates.scheduledDuration = concernedAsset.cessionDate.getFullYear() - this.assetDates.acquisitionYear; //the asset is supposed to be sold during the year
        }
        console.log(this.assetDates);
        return this.assetDates;
    }

    computeDegressiveAmortization() {
        // const today = new Date();
        // const endOfYear = new Date('12/31/'+today.getFullYear());
        console.log(this.defaultAsset);
        this.prepareAssetDates(this.defaultAsset);
        console.log(this.assetDates);

        // console.log(this.computeFirstLinearDotation(this.defaultAsset));
        let firstDotation = this.computeFirstDegressiveDotation(this.defaultAsset);
        let nextDotations = this.computeNextDegressiveDotations(this.defaultAsset, firstDotation);
        console.log(nextDotations);
    }

    getAmortizationRate(concernedAsset: UserAsset): number {
        return (1 / concernedAsset.economicDuration);
    }

    getNormalLinearDotation(concernedAsset: UserAsset): number {
        const amortizationRate = this.getAmortizationRate(concernedAsset);
        return concernedAsset.acquisitionPrice * amortizationRate;
    }

    computeFirstLinearDotation(concernedAsset: UserAsset): AssetDotation {
        const remainingMonths = 12 - this.assetDates.acquisitionMonth;
        const numberOfDaysInTheMonth = new Date(this.assetDates.acquisitionYear, this.assetDates.acquisitionMonth, 0).getDate();
        var remainingDays = numberOfDaysInTheMonth - this.assetDates.acquisitionDay;
        for (let i = 0; i < remainingMonths; i++) {
            remainingDays += new Date(this.assetDates.acquisitionYear, i + this.assetDates.acquisitionMonth, 0).getDate();
        }
        const amortizationRate = this.getAmortizationRate(concernedAsset);
        let dotationValue = this.getNormalLinearDotation(concernedAsset) * (remainingDays / 365);
        dotationValue = Number(dotationValue.toFixed(2));

        return {
            year: this.assetDates.acquisitionYear,
            rate: amortizationRate,
            value: dotationValue,
            sumOfDotations: dotationValue,
            remainingDays: remainingDays,
            remainingDotations: concernedAsset.acquisitionPrice - dotationValue
        }
    }

    computeNextLinearDotations(concernedAsset: UserAsset, firstDotation: AssetDotation): AssetDotation[] {
        let remainingYears = this.assetDates.scheduledDuration - 1;
        console.log(this.assetDates.scheduledDuration)
        let lastDotationsSum = firstDotation.sumOfDotations;
        let remainingDotations = firstDotation.remainingDotations;
        let dotationsList = [firstDotation];
        for (let i = 1; i <= remainingYears; i++) {
            const year = this.assetDates.acquisitionYear + i;
            const rate = this.getAmortizationRate(concernedAsset);
            const amortization = this.getNormalLinearDotation(concernedAsset);
            remainingDotations = remainingDotations - amortization;
            lastDotationsSum = lastDotationsSum + amortization;

            dotationsList[dotationsList.length] = {
                year: year,
                rate: rate,
                value: amortization,
                sumOfDotations: lastDotationsSum,
                remainingDotations: Number(remainingDotations.toFixed(2))
            }

        }
        return dotationsList;
    }

    computeLastLinearDotation(concernedAsset: UserAsset, previousDotations: AssetDotation[]): AssetDotation[] {
        let firstDotation = previousDotations[0];
        let lastComputedDotation = previousDotations[previousDotations.length - 1];
        const year = lastComputedDotation.year + 1;
        const rate = this.getAmortizationRate(concernedAsset);
        let sumOfDotations = concernedAsset.acquisitionPrice;
        let remainingDotations = 0.00;
        let remainingDays = 365 - firstDotation.remainingDays;
        let value = 0;
        if (concernedAsset.isSold) {
            const cessionMonth = concernedAsset.cessionDate.getMonth() + 1;
            const cessionYear = concernedAsset.cessionDate.getFullYear();
            const cessionDay = concernedAsset.cessionDate.getDate();
            const numberOfMonths = cessionMonth;
            let daysOfUsage = cessionDay;
            for (let i = 1; i < cessionMonth; i++) {
                daysOfUsage += new Date(cessionYear, i, 0).getDate();
            }
            let dotationValue = this.getNormalLinearDotation(concernedAsset) * (daysOfUsage / 365);
            value = Number(dotationValue.toFixed(2));
            sumOfDotations = lastComputedDotation.sumOfDotations+value;
            remainingDotations = concernedAsset.acquisitionPrice - sumOfDotations;
            remainingDotations = Number(remainingDotations.toFixed(2));
            remainingDays = daysOfUsage;
        }
        else{
            value = this.getNormalLinearDotation(concernedAsset) - firstDotation.value;
        }

        previousDotations[previousDotations.length] = {
            year: year,
            rate: rate,
            value: value,
            sumOfDotations: sumOfDotations,
            remainingDotations: remainingDotations,
            remainingDays: remainingDays
        }
        return previousDotations;
    }

    getDegressiveAmortizationRate(concernedAsset: UserAsset): number {
        let rate = 0.2;
        let coefficient = 1.5;
        const economicDuration = concernedAsset.economicDuration;
        if (economicDuration > 2 && economicDuration < 5) {
            coefficient = 1.5;
        }
        if (economicDuration === 5) {
            coefficient = 2;
        }
        if (economicDuration >= 6) {
            coefficient = 3;
        }

        rate = Number((1 / economicDuration).toFixed(2)) * coefficient;
        return rate;
    }

    computeFirstDegressiveDotation(concernedAsset: UserAsset): AssetDotation {
        const remainingMonths = 12 - this.assetDates.acquisitionMonth;
        const amortizationRate = this.getDegressiveAmortizationRate(concernedAsset);
        const degressiveDotation = concernedAsset.acquisitionPrice * amortizationRate * (remainingMonths / 12);
        const linearDotation = this.computeFirstLinearDotation(concernedAsset).value;
        let dotationValue = degressiveDotation;
        if (linearDotation > degressiveDotation) {
            dotationValue = linearDotation;
        }
        dotationValue = Number(dotationValue.toFixed(2));

        return {
            year: this.assetDates.acquisitionYear,
            rate: amortizationRate,
            value: dotationValue,
            linearDotation: linearDotation,
            sumOfDotations: dotationValue,
            remainingDays: remainingMonths,
            remainingDotations: concernedAsset.acquisitionPrice - dotationValue
        }
    }

    computeNextDegressiveDotations(concernedAsset: UserAsset, firstDotation: AssetDotation): AssetDotation[] {
        let remainingYears = concernedAsset.economicDuration;
        let scheduledDuration = this.assetDates.scheduledDuration;
        let compteur = remainingYears;
        let daysOfUsage = 0;
        if(concernedAsset.isSold){
            compteur = scheduledDuration;
        }
        let lastDotationsSum = firstDotation.sumOfDotations;
        let remainingDotations = firstDotation.remainingDotations;
        let dotationsList = [firstDotation];
        let switchedToLinear = false;
        let switchRate = 0.5;
        let switchValue = 0;
        for (let i = 0; i < compteur; i++) {
            const degressiveRate = this.getDegressiveAmortizationRate(concernedAsset);
            const linearRate = 1 / (remainingYears - i);
            const year = this.assetDates.acquisitionYear + i + 1;
            let rate = degressiveRate;
            let amortization = remainingDotations * degressiveRate;
            let dotationBase = remainingDotations;
            let linearDotation = dotationBase / (remainingYears - i);
            if (switchedToLinear) {
                rate = switchRate;
                amortization = switchValue * rate;
                dotationBase = switchValue;
            }
            else {
                if (linearRate > degressiveRate) {
                    switchedToLinear = true;
                    switchRate = linearRate;
                    switchValue = remainingDotations;
                    rate = linearRate;
                    amortization = switchValue * linearRate;
                }
            }
            if (concernedAsset.isSold && ((i+1)===scheduledDuration)) {
                const cessionMonth = concernedAsset.cessionDate.getMonth() + 1;
                const cessionYear = concernedAsset.cessionDate.getFullYear();
                const cessionDay = concernedAsset.cessionDate.getDate();
                const numberOfMonths = cessionMonth;
                daysOfUsage = cessionDay;
                for (let i = 1; i < cessionMonth; i++) {
                    daysOfUsage += new Date(cessionYear, i, 0).getDate();
                }
                amortization = amortization * (daysOfUsage / 365);

            }
            amortization = Number(amortization.toFixed(2));
            remainingDotations = remainingDotations - amortization;
            remainingDotations = Number(remainingDotations.toFixed(2));
            linearDotation = Number(linearDotation.toFixed(2));
            lastDotationsSum = lastDotationsSum + amortization;
            // let lastDotation = dotationsList[dotationsList.length - 1];
            // let degressiveDotation = remainingDotations*degressiveRate;


            dotationsList[dotationsList.length] = {
                year: year,
                rate: rate,
                value: amortization,
                linearDotation: linearDotation,
                dotationBase: dotationBase,
                sumOfDotations: lastDotationsSum,
                remainingDays: daysOfUsage,
                remainingDotations: Number(remainingDotations.toFixed(2))
            }

        }
        return dotationsList;
    }
}
