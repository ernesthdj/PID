<?php

declare(strict_types=1);

namespace App\Domain\Auth;

final class BcryptHasher implements PasswordHasher
{
    public function hacher(string $motDePasse): string
    {
        return password_hash($motDePasse, PASSWORD_BCRYPT);
    }
}
