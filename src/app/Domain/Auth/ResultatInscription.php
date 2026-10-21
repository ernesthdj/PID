<?php

declare(strict_types=1);

namespace App\Domain\Auth;

final class ResultatInscription
{
    /**
     * @param array<string, string[]> $erreurs erreurs par champ (vide si succès)
     */
    private function __construct(
        public bool $reussie,
        public array $erreurs,
        public bool $emailEnvoye,
    ) {
    }

    public static function succes(bool $emailEnvoye): self
    {
        return new self(true, [], $emailEnvoye);
    }

    /** @param array<string, string[]> $erreurs */
    public static function echec(array $erreurs): self
    {
        return new self(false, $erreurs, false);
    }
}
