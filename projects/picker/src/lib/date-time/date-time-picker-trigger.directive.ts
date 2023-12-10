/**
 * date-time-picker-trigger.directive
 */


import {
    AfterContentInit,
    ChangeDetectorRef,
    Directive,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges
} from '@angular/core';
import { OwlDateTimeComponent } from './date-time-picker.component';
import { Subscription, merge } from 'rxjs';
@Directive({
    selector: '[owlDateTimeTrigger]',
    host: {
        '(click)': 'handleClickOnHost($event)',
        '[class.owl-dt-trigger-disabled]': 'owlDTTriggerDisabledClass'
    }
})
export class OwlDateTimeTriggerDirective<T> implements OnInit, OnChanges, AfterContentInit, OnDestroy {

    @Input('owlDateTimeTrigger') dtPicker: OwlDateTimeComponent<T>;

    private _disabled: boolean;
    @Input()
    get disabled(): boolean {
        return this._disabled === undefined ? this.dtPicker.disabled : !!this._disabled;
    }

    set disabled( value: boolean ) {
        this._disabled = value;
    }

    get owlDTTriggerDisabledClass(): boolean {
        return this.disabled;
    }

    private stateChanges = Subscription.EMPTY;

    constructor( protected changeDetector: ChangeDetectorRef ) {
    }

    public ngOnInit(): void {
    }

    public ngOnChanges( changes: SimpleChanges ) {
        if (changes.datepicker) {
            this.watchStateChanges();
        }
    }

    public ngAfterContentInit() {
        this.watchStateChanges();
    }

    public ngOnDestroy(): void {
        this.stateChanges.unsubscribe();
    }

    public handleClickOnHost( event: Event ): void {
        if (this.dtPicker) {
            this.dtPicker.open();
            event.stopPropagation();
        }
    }

    private watchStateChanges(): void {
        this.stateChanges.unsubscribe();
        let eventarray: EventEmitter<boolean>[]= [];
        if(this.dtPicker && this.dtPicker.dtInput) {
          eventarray.push(this.dtPicker.dtInput.disabledChange);
        }

        if(this.dtPicker) {
          eventarray.push(this.dtPicker.disabledChange);
          }
        this.stateChanges = merge(...eventarray)
            .subscribe((_) => {
                this.changeDetector.markForCheck();
            });
    }
}
