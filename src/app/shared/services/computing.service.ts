import { Injectable } from '@angular/core';
import { UserAsset } from '../interfaces/user-asset';
import { AssetDotation } from '../interfaces/asset-dotation';
import { UserAssetDates } from '../interfaces/user-asset-dates';
import { Asset } from '../classes/asset.class';
import { isNullOrUndefined } from 'util';

@Injectable({
    providedIn: 'root'
})
export class ComputingService {
    defaultAsset: UserAsset;
    assetDates: UserAssetDates;
    dotationsAsToday: number;
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

        this.assetDates = {
            acquisitionYear: 0,
            acquisitionMonth: 0,
            acquisitionDay: 0,
            scheduledDuration: 0,
        }
    }

    computeLinearAmortization(asset: UserAsset) {
        // console.log(this.defaultAsset);
        this.prepareAssetDates(asset);

        let firstLinearDotation = this.computeFirstLinearDotation(asset);
        let nextLinearDotations = this.computeNextLinearDotations(asset, firstLinearDotation);
        let allDotations = this.computeLastLinearDotation(asset, nextLinearDotations);
        return allDotations;
    }

    private prepareAssetDates(concernedAsset: UserAsset): UserAssetDates {
        // console.log(concernedAsset);
        this.assetDates.acquisitionYear = concernedAsset.acquisitionDate.getFullYear();
        this.assetDates.acquisitionMonth = concernedAsset.acquisitionDate.getMonth() + 1;
        this.assetDates.acquisitionDay = concernedAsset.acquisitionDate.getDate();
        this.assetDates.scheduledDuration = concernedAsset.economicDuration;
        // if (concernedAsset.isSold) {
        //     this.assetDates.scheduledDuration = concernedAsset.cessionDate.getFullYear() - this.assetDates.acquisitionYear; //the asset is supposed to be sold during the year
        // }
        return this.assetDates;
    }

    public getAmortizations(asset: UserAsset): AssetDotation[] {
        this.dotationsAsToday = 0;
        let computedDotations = [];
        if (asset.amoritizationType == "linear") {
            computedDotations = this.computeLinearAmortization(asset);
        }
        else {
            computedDotations = this.computeDegressiveAmortization(asset);
        }
        return computedDotations;
    }

    computeDegressiveAmortization(asset: UserAsset) {
        // const today = new Date();
        // const endOfYear = new Date('12/31/'+today.getFullYear());
        // console.log(this.defaultAsset);
        this.prepareAssetDates(asset);
        // console.log(this.assetDates);

        // console.log(this.computeFirstLinearDotation(asset));
        let firstDotation = this.computeFirstDegressiveDotation(asset);
        let nextDotations = this.computeNextDegressiveDotations(asset, firstDotation);
        return nextDotations;
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
        const currentYear = new Date().getFullYear();
        for (let i = 0; i < remainingMonths; i++) {
            remainingDays += new Date(this.assetDates.acquisitionYear, i + this.assetDates.acquisitionMonth, 0).getDate();
        }
        const amortizationRate = this.getAmortizationRate(concernedAsset);
        let dotationValue = this.getNormalLinearDotation(concernedAsset) * (remainingDays / 365);
        dotationValue = Number(dotationValue.toFixed(2));
        if (this.assetDates.acquisitionYear === currentYear) {
            this.dotationsAsToday = this.getTodayDotationsCumul(0, this.getNormalLinearDotation(concernedAsset), true, concernedAsset);
        }
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
        const today = new Date();
        const currentYear = today.getFullYear();
        let remainingYears = this.assetDates.scheduledDuration - 1;
        let lastDotationsSum = firstDotation.sumOfDotations;
        let remainingDotations = firstDotation.remainingDotations;
        let dotationsList = [firstDotation];
        for (let i = 1; i <= remainingYears; i++) {
            const year = this.assetDates.acquisitionYear + i;
            const amortization = this.getNormalLinearDotation(concernedAsset);
            if (year === currentYear) {
                this.dotationsAsToday = this.getTodayDotationsCumul(lastDotationsSum, amortization);
            }
            const rate = this.getAmortizationRate(concernedAsset);
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
        const currentYear = new Date().getFullYear();
        const rate = this.getAmortizationRate(concernedAsset);
        let sumOfDotations = concernedAsset.acquisitionPrice;
        let remainingDotations = 0.00;
        let remainingDays = 365 - firstDotation.remainingDays;
        let value = 0;
        if (year === currentYear) {
            this.dotationsAsToday = this.getTodayDotationsCumul(lastComputedDotation.sumOfDotations, this.getNormalLinearDotation(concernedAsset));
        }
        value = this.getNormalLinearDotation(concernedAsset) - firstDotation.value;
        // }

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
        const currentYear = new Date().getFullYear();
        const degressiveDotation = concernedAsset.acquisitionPrice * amortizationRate * (remainingMonths / 12);
        const linearDotation = this.computeFirstLinearDotation(concernedAsset).value;
        let dotationValue = degressiveDotation;
        if (linearDotation > degressiveDotation) {
            dotationValue = linearDotation;
        }
        dotationValue = Number(dotationValue.toFixed(2));
        if (this.assetDates.acquisitionYear === currentYear) {
            this.dotationsAsToday = this.getTodayDotationsCumul(0, dotationValue, true, concernedAsset);
        }
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
        const currentYear = new Date().getFullYear();
        let compteur = remainingYears;
        let daysOfUsage = 0;
        // if (concernedAsset.isSold) {
        //     compteur = scheduledDuration;
        // }
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
            // if (concernedAsset.isSold && ((i + 1) === scheduledDuration)) {
            //     const cessionMonth = concernedAsset.cessionDate.getMonth() + 1;
            //     const cessionYear = concernedAsset.cessionDate.getFullYear();
            //     const cessionDay = concernedAsset.cessionDate.getDate();
            //     const numberOfMonths = cessionMonth;
            //     daysOfUsage = cessionDay;
            //     for (let i = 1; i < cessionMonth; i++) {
            //         daysOfUsage += new Date(cessionYear, i, 0).getDate();
            //     }
            //     amortization = amortization * (daysOfUsage / 365);

            // }
            amortization = Number(amortization.toFixed(2));
            remainingDotations = remainingDotations - amortization;
            remainingDotations = Number(remainingDotations.toFixed(2));
            linearDotation = Number(linearDotation.toFixed(2));
            if (year === currentYear) {
                this.dotationsAsToday = this.getTodayDotationsCumul(lastDotationsSum, amortization);
            }
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

    private dateDiffInDays(a:Date, b:Date) {
        const _MS_PER_DAY = 1000 * 60 * 60 * 24;
        const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

        return Math.floor((utc2 - utc1) / _MS_PER_DAY);
      }

    private getTodayDotationsCumul(lastCumul: number, thisYearDotation: number, firstYear?:boolean, concernedAsset?:UserAsset): number {
        // console.log(firstYear);
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;
        let todayDotationCumul = 0;
        if (firstYear) {
            // const thisDate = today.getDate();
            // // const remainingMonths = currentMonth - this.a;
            // const numberOfDaysInTheMonth = new Date(currentYear, currentMonth, 0).getDate();
            // var remainingDays = numberOfDaysInTheMonth - thisDate;
            // for (let i = 0; i < remainingMonths; i++) {
            //     remainingDays += new Date(currentYear, i + currentMonth, 0).getDate();
            // }
            let remainingDays = this.dateDiffInDays(concernedAsset.acquisitionDate, new Date());
            let dotationValue = thisYearDotation * (remainingDays / 365);
            todayDotationCumul = Number(dotationValue.toFixed(2));
        }
        else{
            let daysOfUsage = today.getDate();
            for (let i = 1; i < currentMonth; i++) {
                daysOfUsage += new Date(currentYear, i, 0).getDate();
            }
            const todayDotation = thisYearDotation * (daysOfUsage / 360);
            todayDotationCumul = lastCumul + todayDotation;
        }
        return todayDotationCumul;
    }

    getDotationsAsToday() {
        return this.dotationsAsToday;
    }

    getDotationsAsTodayOfAssets(assets: UserAsset[]) {
        let dotationsAsToday = 0;
        // assets.forEach(function(asset){
        // });
        for (let i = 0; i < assets.length; i++) {
            const asset = assets[i];
            this.getAmortizations(asset);
            const todayDotations = this.getDotationsAsToday();
            // console.log(todayDotations);
            dotationsAsToday += todayDotations;
        }
        return dotationsAsToday;
    }
}
