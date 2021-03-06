﻿import { PatientBedInfo } from './patient-bed-info.model';
import { BillingDeposit } from '../../billing/shared/billing-deposit.model';
import { BillingTransactionItem } from '../../billing/shared/billing-transaction-item.model';
import * as moment from 'moment/moment';
import {
    NgForm,
    FormGroup,
    FormControl,
    Validators,
    FormBuilder,
    ReactiveFormsModule
} from '@angular/forms'

export class Admission {
    public PatientVisitId: number = 0;
    public PatientAdmissionId: number = 0;
    public PatientId: number = 0;
    public AdmittingDoctorId: number = null;
    public CreatedBy: number = null;
    public CreatedOn: string = null;
    public TransferDate: string = null;
    public AdmissionDate: string = null;
    public DischargeDate: string = null;
    public AdmissionNotes: string = null;
    public AdmissionOrders: string = null;
    public AdmissionStatus: string = null;
    public DischargedBy: number = null;
    public BillStatusOnDischarge: string = null;
    public DischargeRemarks: string = null;
    public ModifiedOn: string = null;
    public ModifiedBy: number = null;
    public PatientBedInfos: Array<PatientBedInfo> = new Array<PatientBedInfo>();
    public AdmissionValidator: FormGroup = null;

    public CareOfPersonName: string = null;
    public CareOfPersonPhoneNo: string = null;
    public CareOfPersonRelation: string = null;

    public BilDeposit: BillingDeposit = new BillingDeposit();
    //public BilTxnItems: BillingTransactionItem = new BillingTransactionItem();
    public RequestingDeptId: number = null;     //sud:19Jun'18  //uncommented ram:1oct'18

    //Added by Yubraj --19th November 2018
    public CancelledOn: string=null;
    public CancelledBy: string=null;
    public CancelledRemark: string = null;

    public ProcedureType: string = null;

constructor() {

    var _formBuilder = new FormBuilder();
    this.AdmissionValidator = _formBuilder.group({
        'AdmittingDoctorId': ['', Validators.compose([Validators.required])],
        'AdmissionDate': ['', Validators.compose([Validators.required, this.dateValidator])],
        'AdmissionNotes': ['', Validators.compose([Validators.maxLength(1000)])],
        'AdmissionOrders': ['', Validators.compose([Validators.maxLength(200)])],
        //'DischargeDate': ['', Validators.compose([]),],
        'DischargeRemarks': ['', Validators.compose([]),],
        'CareOfPersonPhoneNo': ['', Validators.compose([Validators.pattern('^[0-9]{0,10}$')])],
        'CareOfPersonName': ['', Validators.compose([Validators.maxLength(100)])],
        //'RequestingDeptId': ['', Validators.compose([Validators.required])]         //ramavtar:2oct'18 added as doctor is require so is this (it gets filled while filling doctor)
        'CareOfPersonRelation': ['', Validators.compose([Validators.maxLength(100)])]
    });
}
//Modified: Ashim 14thSep : 
//Validation: Can select admission date of upto 1 year before or after from today's date.
dateValidator(control: FormControl): { [key: string]: boolean } {

    //dateTime limit is 1 day
    //Ex:it's 16Aug 7:30 PM now
    //user can add admission entry  upto 15Aug 12:00AM 
    var limitDate = moment({ hour: 0, minute: 0, second: 0, millisecond: 0 }).subtract(1, 'year').format('YYYY-MM-DD HH:mm');
    //if positive then selected date is of future else it of the past || selected year can't be of future
    if (control.value) {
        if ((moment(control.value).diff(limitDate) < 0)
            || (moment(control.value).diff(moment().add(10, 'minutes').format('YYYY-MM-DD HH:mm')) > 0))
            //||(moment(control.value).diff(limitDate, 'years') > 1)) //can admit patient upto 1 year from today.
            return { 'wrongDate': true };
    }
    else
        return { 'wrongDate': true };
}
    public IsDirty(fieldName): boolean {
    if (fieldName == undefined)
        return this.AdmissionValidator.dirty;
    else
        return this.AdmissionValidator.controls[fieldName].dirty;
}

    public IsValid():boolean{if(this.AdmissionValidator.valid){return true;}else{return false;}} public IsValidCheck(fieldName, validator): boolean {
    if (fieldName == undefined)
        return this.AdmissionValidator.valid;
    else
        return !(this.AdmissionValidator.hasError(validator, fieldName));
}

    //conditional sets ON and OFF the validation on dischargeDate
    public UpdateDischargeValidator(onOff: boolean) {
    let validator = null;
    if (onOff) {
        //this.AdmissionValidator.controls['DischargeDate'].validator = Validators.compose([Validators.required, this.dateValidator]);
        this.AdmissionValidator.controls['DischargeRemarks'].validator = Validators.compose([Validators.required, Validators.maxLength(100)]);
    }
    else {
        // this.AdmissionValidator.controls['DischargeDate'].validator = Validators.compose([]);
        this.AdmissionValidator.controls['DischargeRemarks'].validator = Validators.compose([]);
    }
    // this.AdmissionValidator.controls['DischargeDate'].updateValueAndValidity();
        this.AdmissionValidator.controls['DischargeRemarks'].updateValueAndValidity();
}

}