<?php

declare(strict_types=1);

namespace App\Domain\Auth;

/** Levée par le dépôt quand la contrainte UNIQUE sur l'email tranche une course. */
final class EmailDejaUtiliseException extends \RuntimeException
{
}
