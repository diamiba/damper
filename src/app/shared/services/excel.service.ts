import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { ComputingService } from './computing.service';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
    providedIn: 'root'
})
export class ExcelService {

    constructor(private computeSvc:ComputingService) { }

    public exportAssetDetails(assetDetails:any, amortizationPlan:any){
        amortizationPlan = this.prepareArray(amortizationPlan);
        const assetDetailsWs: XLSX.WorkSheet = XLSX.utils.json_to_sheet([assetDetails]);
        const assetAmortizationWs: XLSX.WorkSheet = XLSX.utils.json_to_sheet(amortizationPlan);
        const workbook: XLSX.WorkBook = { Sheets: { 'assetsDetails': assetDetailsWs,'amortizationPlan': assetAmortizationWs}, SheetNames: ['assetsDetails','amortizationPlan'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, "details_immobilisation");
    }

    public exportAsExcelFile(json: any, excelFileName: string, multiarray=false): void {
        if(multiarray){
            json = this.prepareArray(json);
        }
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        const workbook: XLSX.WorkBook = { Sheets: { 'amortization': worksheet }, SheetNames: ['amortization'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }

    private prepareArray(concernedData:any){
        let newArray = [["Année","taux","dotation","VNA","Cumul dotations"]];
        concernedData.forEach(element => {
            newArray.push([element.year,element.rate,element.value,element.remainingDotations,Number(element.sumOfDotations)]);
        });
        return newArray;
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }

    public exportAssetsList(assetsList:any){
        console.log(assetsList);
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(assetsList);
        const workbook: XLSX.WorkBook = { Sheets: { 'Immobilisations': worksheet }, SheetNames: ['Immobilisations'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        this.saveAsExcelFile(excelBuffer, "immobilisations");
    }
}
