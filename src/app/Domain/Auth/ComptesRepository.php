<?php

declare(strict_types=1);

namespace App\Domain\Auth;

interface ComptesRepository
{
    public function emailExiste(string $email): bool;

    /** @throws EmailDejaUtiliseException si l'email existe déjà (contrainte UNIQUE). */
    public function creer(Compte $compte): void;
}
