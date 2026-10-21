<?php

declare(strict_types=1);

namespace App\Domain\Auth;

/** Règle minimale : 8 caractères, majuscule, minuscule, chiffre (L3-auth-comptes). */
final class PasswordPolicy
{
    public const LONGUEUR_MIN = 8;

    /** @return string[] messages d'erreur explicites, vide si le mot de passe est valide */
    public function erreurs(string $motDePasse): array
    {
        $erreurs = [];
        if (mb_strlen($motDePasse) < self::LONGUEUR_MIN) {
            $erreurs[] = 'Le mot de passe doit contenir au moins ' . self::LONGUEUR_MIN . ' caractères.';
        }
        if (!preg_match('/\p{Lu}/u', $motDePasse)) {
            $erreurs[] = 'Le mot de passe doit contenir au moins une majuscule.';
        }
        if (!preg_match('/\p{Ll}/u', $motDePasse)) {
            $erreurs[] = 'Le mot de passe doit contenir au moins une minuscule.';
        }
        if (!preg_match('/\d/', $motDePasse)) {
            $erreurs[] = 'Le mot de passe doit contenir au moins un chiffre.';
        }
        return $erreurs;
    }
}
