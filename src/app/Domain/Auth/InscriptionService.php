<?php

declare(strict_types=1);

namespace App\Domain\Auth;

/** US-AUTH-01 : crée un compte `client` en attente de vérification et envoie l'email de vérification. */
final class InscriptionService
{
    public function __construct(
        private ComptesRepository $comptes,
        private PasswordHasher $hasher,
        private VerificationMailer $mailer,
        private ?PasswordPolicy $politique = null,
        private ?\Closure $journalErreur = null,
    ) {
        $this->politique ??= new PasswordPolicy();
    }

    public function inscrire(string $nom, string $email, string $motDePasse, string $confirmation): ResultatInscription
    {
        $nom = trim($nom);
        $email = mb_strtolower(trim($email));
        $erreurs = [];

        if ($nom === '' || mb_strlen($nom) > 255) {
            $erreurs['name'][] = 'Le nom est obligatoire (255 caractères maximum).';
        }
        if (mb_strlen($email) > 255 || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            $erreurs['email'][] = "Cette adresse email n'est pas valide.";
        } elseif ($this->comptes->emailExiste($email)) {
            $erreurs['email'][] = 'Un compte existe déjà avec cette adresse email.';
        }
        $faiblesses = $this->politique->erreurs($motDePasse);
        if ($faiblesses !== []) {
            $erreurs['password'] = $faiblesses;
        }
        if ($motDePasse !== $confirmation) {
            $erreurs['password_confirmation'][] = 'La confirmation ne correspond pas au mot de passe.';
        }
        if ($erreurs !== []) {
            return ResultatInscription::echec($erreurs);
        }

        $compte = new Compte($nom, $email, $this->hasher->hacher($motDePasse));
        try {
            $this->comptes->creer($compte);
        } catch (EmailDejaUtiliseException) {
            // Course entre deux inscriptions : la contrainte UNIQUE a tranché, erreur propre.
            return ResultatInscription::echec(['email' => ['Un compte existe déjà avec cette adresse email.']]);
        }

        // Le compte n'est pas annulé si l'envoi échoue : on journalise, l'utilisateur pourra redemander le lien.
        try {
            $this->mailer->envoyerVerification($email, $nom);
            return ResultatInscription::succes(true);
        } catch (\Throwable $e) {
            if ($this->journalErreur !== null) {
                ($this->journalErreur)($e);
            }
            return ResultatInscription::succes(false);
        }
    }
}
