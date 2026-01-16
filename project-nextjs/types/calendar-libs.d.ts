declare module 'date-bengali-revised' {
    class BengaliDate {
        constructor(date?: Date | string | number);
        date: number;
        month: number;
        year: number;
        day: number;
        format(format?: string): string;
    }
    export = BengaliDate;
}

declare module 'moment-hijri' {
    import { Moment } from 'moment';

    interface MomentHijri extends Moment {
        format(format: string): string;
    }

    function momentHijri(date?: Date | string | number): MomentHijri;

    export = momentHijri;
}
