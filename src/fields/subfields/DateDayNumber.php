<?php
namespace verbb\formie\fields\subfields;

use verbb\formie\fields\Number;
use verbb\formie\helpers\SchemaHelper;

use Craft;

class DateDayNumber extends Number
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('formie', 'Date - Day');
    }

    public static function getFrontEndInputTemplatePath(): string
    {
        return 'fields/number';
    }

    public static function getEmailTemplatePath(): string
    {
        return 'fields/number';
    }
}