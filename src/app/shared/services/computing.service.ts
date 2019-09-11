import { Injectable } from '@angular/core';
import { UserAsset } from '../interfaces/user-asset';
import { AssetDotation } from '../interfaces/asset-dotation';
import { UserAssetDates } from '../interfaces/user-asset-dates';

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
            isSold: false,
            priceIsTtc: false,
        }

        this.assetDates = {
            acquisitionYear: 0,
            acquisitionMonth: 0,
            acquisitionDay: 0
        }
    }

    computeLinearAmortization() {
        // const today = new Date();
        // const endOfYear = new Date('12/31/'+today.getFullYear());
        this.assetDates.acquisitionYear = this.defaultAsset.acquisitionDate.getFullYear();
        this.assetDates.acquisitionMonth = this.defaultAsset.acquisitionDate.getMonth() + 1;
        this.assetDates.acquisitionDay = this.defaultAsset.acquisitionDate.getDate();

        // console.log(this.computeFirstLinearDotation(this.defaultAsset));
        let firstLinearDotation = this.computeFirstLinearDotation(this.defaultAsset);
        let nextLinearDotations = this.computeNextLinearDotations(this.defaultAsset, firstLinearDotation);
        let allDotations = this.computeLastLinearDotation(this.defaultAsset, nextLinearDotations);
        console.log(allDotations);
    }


    computeDegressiveAmortization() {
        // const today = new Date();
        // const endOfYear = new Date('12/31/'+today.getFullYear());
        this.assetDates.acquisitionYear = this.defaultAsset.acquisitionDate.getFullYear();
        this.assetDates.acquisitionMonth = this.defaultAsset.acquisitionDate.getMonth() + 1;
        this.assetDates.acquisitionDay = this.defaultAsset.acquisitionDate.getDate();

        // console.log(this.computeFirstLinearDotation(this.defaultAsset));
        let firstDotation = this.computeFirstDegressiveDotation(this.defaultAsset);
        let nextDotations = this.computeNextDegressiveDotations(this.defaultAsset, firstDotation);
        console.log(nextDotations);
    }

    computeDegressive

    prepareData(concernedAsset: UserAsset) {
        // let remainingMonths =
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
        let remainingYears = concernedAsset.economicDuration - 1;
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
        const value = this.getNormalLinearDotation(concernedAsset) - firstDotation.value;
        previousDotations[previousDotations.length] = {
            year: year,
            rate: rate,
            value: value,
            sumOfDotations: concernedAsset.acquisitionPrice,
            remainingDotations: 0.00,
            remainingDays: 365 - firstDotation.remainingDays
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
        let lastDotationsSum = firstDotation.sumOfDotations;
        let remainingDotations = firstDotation.remainingDotations;
        let dotationsList = [firstDotation];
        let switchedToLinear = false;
        let switchRate = 0.5;
        let switchValue = 0;
        for (let i = 0; i < remainingYears; i++) {
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
            remainingDotations = remainingDotations - amortization;
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
                remainingDotations: Number(remainingDotations.toFixed(2))
            }

        }
        return dotationsList;
    }
}
