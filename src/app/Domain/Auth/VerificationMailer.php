<?php

declare(strict_types=1);

namespace App\Domain\Auth;

interface VerificationMailer
{
    /** @throws \Throwable si l'envoi échoue (le compte reste créé). */
    public function envoyerVerification(string $email, string $nom): void;
}
