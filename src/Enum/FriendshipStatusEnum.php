<?php

namespace App\Enum;

enum FriendshipStatusEnum: string
{
    case PENDING = 'pending';
    case ACCEPTED = 'accepted';
    case BLOCKED = 'blocked';
    case REJECTED = 'rejected';
}
