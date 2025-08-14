<?php

/**
 * Created by PHPStorm.
 * User: Filipe Batista
 * Date: 14/08/25 15:18
 */

namespace App\Enum\Worker;

enum TimeOffStatusEnum: string
{
    case Pending = 'pending';
    case Approved = 'approved';
    case Rejected = 'rejected';
}
