<?php

declare(strict_types=1);

namespace App\Domain\Auth;

/** Compte tel qu'il est stocké : le mot de passe n'existe que sous forme de hash. */
final class Compte
{
    public function __construct(
        public string $nom,
        public string $email,
        public string $motDePasseHache,
        public string $role = 'client',
        public string $statut = StatutCompte::EN_ATTENTE_VERIFICATION,
    ) {
    }
}
