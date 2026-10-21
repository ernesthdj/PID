<?php

declare(strict_types=1);

namespace App\Domain\Auth;

/** Statuts d'un compte (ARCHITECTURE : users.statut_compte). */
final class StatutCompte
{
    public const EN_ATTENTE_VERIFICATION = 'en_attente_verification';
    public const ACTIF = 'actif';
    public const BLOQUE = 'bloque';
    public const DESACTIVE = 'desactive';
}
