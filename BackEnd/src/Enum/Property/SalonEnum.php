<?php

/**
 * Created by Muzzapp.
 * User: Filipe Batista
 * Date: 10/07/25 21:29
 */

namespace App\Enum\Property;

enum SalonEnum: string
{
    case SALON_NAME = 'name';
    case SALON_PHONE= 'phone';
    case SALON_ADDRESS = 'address';
    case SALON_EMAIL = 'email';
    case SALON_WEBSITE = 'website';
}
