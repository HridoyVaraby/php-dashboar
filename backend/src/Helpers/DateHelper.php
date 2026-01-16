<?php
namespace App\Helpers;

class DateHelper {
    public static function format(string $date): string
    {
        $timestamp = strtotime($date);
        $day = date('d', $timestamp);
        $month = date('F', $timestamp);
        $year = date('Y', $timestamp);
        $time = date('h:i A', $timestamp);

        return self::translateToBengali("$day $month $year, $time");
    }

    public static function timeAgo(string $date): string
    {
        $timestamp = strtotime($date);
        $diff = time() - $timestamp;

        if ($diff < 60) {
            return 'এইমাত্র';
        }

        $minute = 60;
        $hour = $minute * 60;
        $day = $hour * 24;
        $month = $day * 30;
        $year = $day * 365;

        if ($diff < $hour) {
            $minutes = floor($diff / $minute);
            return self::translateNumber($minutes) . ' মিনিট আগে';
        }

        if ($diff < $day) {
            $hours = floor($diff / $hour);
            return self::translateNumber($hours) . ' ঘণ্টা আগে';
        }

        if ($diff < $month) {
            $days = floor($diff / $day);
            return self::translateNumber($days) . ' দিন আগে';
        }

        if ($diff < $year) {
            $months = floor($diff / $month);
            return self::translateNumber($months) . ' মাস আগে';
        }

        $years = floor($diff / $year);
        return self::translateNumber($years) . ' বছর আগে';
    }

    private static function translateToBengali(string $str): string
    {
        $map = [
            'January' => 'জানুয়ারি',
            'February' => 'ফেব্রুয়ারি',
            'March' => 'মার্চ',
            'April' => 'এপ্রিল',
            'May' => 'মে',
            'June' => 'জুন',
            'July' => 'জুলাই',
            'August' => 'আগস্ট',
            'September' => 'সেপ্টেম্বর',
            'October' => 'অক্টোবর',
            'November' => 'নভেম্বর',
            'December' => 'ডিসেম্বর',
            'PM' => 'পিএম',
            'AM' => 'এএম',
        ];

        $str = str_replace(array_keys($map), array_values($map), $str);
        return self::translateNumber($str);
    }

    private static function translateNumber(string|int $number): string
    {
        $eng = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        $bng = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        return str_replace($eng, $bng, (string)$number);
    }
}
